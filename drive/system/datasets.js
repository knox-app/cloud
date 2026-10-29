/**
 * datasets.js
 * Centralized Firestore Database Operations & Data Helpers
 * Firebase App: cloud-computer-4891a
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, collection, query, where, getDocs, or, onSnapshot,
    doc, getDoc, updateDoc, deleteDoc, addDoc, arrayUnion, arrayRemove 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyAo8Uzs4XZHDHTSTfgx59w5h5NlYuGC8s0",
    authDomain: "cloud-computer-4891a.firebaseapp.com",
    projectId: "cloud-computer-4891a",
    storageBucket: "cloud-computer-4891a.firebasestorage.app",
    messagingSenderId: "744203234287",
    appId: "1:744203234287:web:81d943ae9b75fd77dce41a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 2. Active User Resolution
export function getActiveUser(redirectIfMissing = true) {
    let currentUser = null;
    try { 
        currentUser = JSON.parse(localStorage.getItem('active_user')); 
    } catch(e) {}

    if ((!currentUser || !currentUser.Email) && redirectIfMissing) {
        window.location.href = "1.html";
    }
    return currentUser;
}

// 3. Date & Color Helpers
export function formatFirestoreDate() {
    const d = new Date();
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${timeStr} , ${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

export function formatDisplayDate(dateStr) {
    if (!dateStr) return "Recently";
    let dateObj = null;
    try {
        if (dateStr.includes(',')) {
            const parts = dateStr.split(',');
            if (parts.length >= 2) {
                const datePart = parts[1].trim();
                const [d, m, y] = datePart.split('-');
                const months = { JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11 };
                dateObj = new Date(parseInt(y), months[m?.toUpperCase()] ?? 0, parseInt(d));
            }
        } else {
            dateObj = new Date(dateStr);
        }
    } catch(e) {}

    if (!dateObj || isNaN(dateObj.getTime())) return dateStr;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diffTime = today.getTime() - target.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    if (dateObj.getFullYear() === now.getFullYear()) {
        return `${month} ${day}`;
    }
    return `${month} ${day}, ${dateObj.getFullYear()}`;
}

export function getContrastColor(hexColor) {
    if (!hexColor || hexColor === '#FFFFFF' || hexColor.toLowerCase() === '#ffffff') return '#111827';
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 170) ? '#111827' : '#FFFFFF';
}

// 4. Role Resolver
export function getUserRole(item, userEmail, parentDocs = []) {
    if (item.Email === userEmail) return 'Owner';
    const acc = item.Access || {};
    if (acc.Editor?.includes(userEmail)) return 'Editor';
    if (acc.Contributor?.includes(userEmail)) return 'Contributor';
    if (acc.Commenter?.includes(userEmail) || acc.Commentator?.includes(userEmail)) return 'Commenter';
    if (acc.Viewer?.includes(userEmail)) return 'Viewer';

    for (const pDoc of parentDocs) {
        if (pDoc) {
            if (pDoc.Email === userEmail) return 'Owner';
            const pAcc = pDoc.Access || {};
            if (pAcc.Editor?.includes(userEmail)) return 'Editor';
            if (pAcc.Contributor?.includes(userEmail)) return 'Contributor';
            if (pAcc.Commenter?.includes(userEmail) || pAcc.Commentator?.includes(userEmail)) return 'Commenter';
            if (pAcc.Viewer?.includes(userEmail)) return 'Viewer';
        }
    }
    return 'Viewer';
}

// 5. Realtime Workspace Listener
export function subscribeToWorkspace(userEmail, callback, errorCallback) {
    const q = query(
        collection(db, "Cloud Drive"),
        or(
            where("Email", "==", userEmail),
            where("Access.Viewer", "array-contains", userEmail),
            where("Access.Contributor", "array-contains", userEmail),
            where("Access.Commenter", "array-contains", userEmail),
            where("Access.Commentator", "array-contains", userEmail),
            where("Access.Editor", "array-contains", userEmail)
        )
    );

    return onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach(docSnap => {
            items.push({ id: docSnap.id, ...docSnap.data() });
        });
        const folders = items.filter(d => d.Folder === "True");
        callback({ allItems: items, folderItems: folders });
    }, (err) => {
        if (errorCallback) errorCallback(err);
        else console.error("Realtime sync error:", err);
    });
}

// 6. Firestore Write/Mutation Helpers
export async function createFolderRecord({ userEmail, name, password = "", parentFolderId = null, labels = [] }) {
    const newDoc = await addDoc(collection(db, "Cloud Drive"), {
        Email: userEmail,
        Folder: "True",
        Name: name,
        Password: password,
        File: [],
        Label: labels,
        Customize: { Colour: "#FB765B", Icon: "folder" },
        Updated: formatFirestoreDate(),
        Access: { Viewer: [], Contributor: [], Commenter: [], Editor: [] }
    });

    if (parentFolderId) {
        await updateDoc(doc(db, "Cloud Drive", parentFolderId), {
            File: arrayUnion(newDoc.id),
            Updated: formatFirestoreDate()
        });
    }

    return newDoc;
}

export async function createFileRecord({ userEmail, fileUrl, fileName, fileType, parentFolderId = null, labels = [] }) {
    const newDoc = await addDoc(collection(db, "Cloud Drive"), {
        Email: userEmail,
        File: fileUrl,
        Type: fileType,
        Name: fileName,
        Password: "",
        Label: labels,
        LastOpened: new Date().toISOString(),
        LastOpenedBy: userEmail,
        Updated: formatFirestoreDate(),
        Access: { Viewer: [], Contributor: [], Commenter: [], Editor: [] }
    });

    if (parentFolderId) {
        await updateDoc(doc(db, "Cloud Drive", parentFolderId), {
            File: arrayUnion(newDoc.id),
            Updated: formatFirestoreDate()
        });
    }

    return newDoc;
}

export async function renameRecord(id, newName) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Name: newName,
        Updated: formatFirestoreDate()
    });
}

export async function updateRecordLabels(id, labels) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Label: labels,
        Updated: formatFirestoreDate()
    });
}

export async function updateRecordAccess(id, accessMap) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Access: accessMap,
        Updated: formatFirestoreDate()
    });
}

export async function transferRecordOwnership(id, newOwnerEmail) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Email: newOwnerEmail,
        Access: { Viewer: [], Contributor: [], Commenter: [], Editor: [] },
        Updated: formatFirestoreDate()
    });
}

export async function updateFolderCustomize(id, colour, icon) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Customize: { Colour: colour, Icon: icon },
        Updated: formatFirestoreDate()
    });
}

export async function updateFolderPassword(id, password) {
    return await updateDoc(doc(db, "Cloud Drive", id), {
        Password: password,
        Updated: formatFirestoreDate()
    });
}

export async function moveRecords(recordIds, destinationFolderId, allFolders = []) {
    for (const id of recordIds) {
        for (const f of allFolders) {
            if (Array.isArray(f.File) && f.File.includes(id)) {
                await updateDoc(doc(db, "Cloud Drive", f.id), {
                    File: arrayRemove(id),
                    Updated: formatFirestoreDate()
                });
            }
        }
        if (destinationFolderId && destinationFolderId !== "root") {
            await updateDoc(doc(db, "Cloud Drive", destinationFolderId), {
                File: arrayUnion(id),
                Updated: formatFirestoreDate()
            });
        }
    }
}

export async function deleteRecord(id, userEmail, isViewer, allFolders = []) {
    if (isViewer) {
        return await updateDoc(doc(db, "Cloud Drive", id), {
            "Access.Viewer": arrayRemove(userEmail)
        });
    }

    for (const f of allFolders) {
        if (Array.isArray(f.File) && f.File.includes(id)) {
            await updateDoc(doc(db, "Cloud Drive", f.id), {
                File: arrayRemove(id)
            });
        }
    }
    return await deleteDoc(doc(db, "Cloud Drive", id));
}

// Export raw Firestore functions if direct custom query is needed
export { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc };
