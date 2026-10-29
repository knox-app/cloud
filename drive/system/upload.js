/**
 * upload.js
 * Centralized File Upload Engine (ImgBB + Uploadcare)
 * Integrates directly with datasets.js
 */

import { createFileRecord } from "./datasets.js"; // or your hosted GitHub URL

export const UPLOAD_CONFIG = {
    IMGBB_API_KEY: "80c452b9a4b80f240ada316f23078d2c",
    UPLOADCARE_PUB_KEY: "demopublickey",
    MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024 // 50MB limit
};

/**
 * Uploads a single image to ImgBB
 * @param {File} file 
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${UPLOAD_CONFIG.IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`ImgBB upload failed with status ${response.status}`);
    }

    const json = await response.json();
    if (!json.success || !json.data?.url) {
        throw new Error(json.error?.message || "Failed to parse ImgBB image URL");
    }

    return json.data.url;
}

/**
 * Uploads any generic file to Uploadcare
 * @param {File} file 
 * @returns {Promise<string>} Public CDN URL of the uploaded file
 */
export async function uploadToUploadcare(file) {
    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', UPLOAD_CONFIG.UPLOADCARE_PUB_KEY);
    formData.append('UPLOADCARE_STORE', '1');
    formData.append('file', file);

    const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Uploadcare upload failed with status ${response.status}`);
    }

    const json = await response.json();
    if (!json.file) {
        throw new Error("Failed to parse Uploadcare file ID");
    }

    return `https://ucarecdn.com/${json.file}/${encodeURIComponent(file.name)}`;
}

/**
 * Inspects a File object to determine display type and uploads to the appropriate service
 * @param {File} file 
 * @returns {Promise<{ fileUrl: string, fileType: string }>}
 */
export async function uploadSingleFile(file) {
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
        throw new Error(`File "${file.name}" exceeds maximum allowed size of 50MB`);
    }

    let fileUrl = "";
    let fileType = "Document";

    if (file.type.startsWith('image/')) {
        fileUrl = await uploadToImgBB(file);
        fileType = "Image";
    } else {
        fileUrl = await uploadToUploadcare(file);
        const ext = file.name.split('.').pop()?.toUpperCase();
        fileType = ext || "Document";
    }

    return { fileUrl, fileType };
}

/**
 * Uploads a list of files sequentially and saves their documents to Firestore
 * @param {FileList|Array<File>} files 
 * @param {Object} options 
 * @param {string} options.userEmail 
 * @param {string|null} [options.parentFolderId=null] 
 * @param {Array<string>} [options.labels=[]] 
 * @param {Function} [options.onProgress] - Callback (currentIndex, totalCount, fileName)
 * @param {Function} [options.onError] - Callback (fileName, error)
 * @returns {Promise<Array<Object>>} Array of created Firestore records
 */
export async function processBatchUpload(files, {
    userEmail,
    parentFolderId = null,
    labels = [],
    onProgress = null,
    onError = null
}) {
    const uploadedDocs = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];

        if (onProgress) {
            onProgress(i + 1, totalFiles, file.name);
        }

        try {
            const { fileUrl, fileType } = await uploadSingleFile(file);

            const newDoc = await createFileRecord({
                userEmail,
                fileUrl,
                fileName: file.name,
                fileType,
                parentFolderId,
                labels
            });

            uploadedDocs.push(newDoc);
        } catch (err) {
            console.error(`Failed uploading file ${file.name}:`, err);
            if (onError) onError(file.name, err);
        }
    }

    return uploadedDocs;
}

/**
 * Sets up drag-and-drop file upload listeners on the window
 * @param {HTMLElement} overlayEl - The drag overlay container element
 * @param {Function} onDropFiles - Callback function receiving FileList
 */
export function setupDragAndDrop(overlayEl, onDropFiles) {
    if (!overlayEl) return;

    window.addEventListener('dragover', (e) => {
        e.preventDefault();
        overlayEl.classList.add('active');
    });

    window.addEventListener('dragleave', (e) => {
        if (e.clientX === 0 && e.clientY === 0) {
            overlayEl.classList.remove('active');
        }
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        overlayEl.classList.remove('active');
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            onDropFiles(e.dataTransfer.files);
        }
    });
}
