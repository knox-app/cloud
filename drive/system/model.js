Here is model.js. It dynamically injects all the modals directly into the DOM
and exports helper functions that import your folder icons from
https://knox-app.github.io/cloud/drive/folder/icon-sys.js.

Save this file as model.js:

/**
 * model.js
 * Injects and manages all Cloud Drive modals dynamically.
 * Integrates directly with https://knox-app.github.io/cloud/drive/folder/icon-sys.js
 */

import { FOLDER_COLORS, FOLDER_BADGE_ICONS } from "https://knox-app.github.io/cloud/drive/folder/icon-sys.js";

// 1. Injects all modal HTML into the DOM automatically upon import
export function initModals() {
    if (document.getElementById('cloud-drive-modals-container')) return;

    const container = document.createElement('div');
    container.id = 'cloud-drive-modals-container';
    container.innerHTML = `
        <!-- Modal: Enhanced Customize -->
        <div class="modal-shade" id="customizeModal">
            <div class="modal-box">
                <div class="modal-header">
                    <div class="modal-title">Customize Folder</div>
                    <button class="modal-close" id="closeCustomizeModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="customize-top-preview">
                    <div class="customize-top-preview-icon" id="customizePreviewIcon"></div>
                </div>
                <div class="color-carousel-wrap" id="colorCarouselWrap"></div>
                <div class="icon-palette-grid" id="iconPaletteGrid"></div>
                <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
                    <button class="btn-pill" id="btnSaveCustomize" style="padding: 10px 28px; font-weight: 600;">OK</button>
                </div>
            </div>
        </div>

        <!-- Modal: Manage Access -->
        <div class="modal-shade" id="accessModal">
            <div class="modal-box">
                <div class="modal-header">
                    <div class="modal-title">Manage Access</div>
                    <button class="modal-close" id="closeAccessModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group" id="inviteSection">
                    <label>Invite User</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="email" id="inviteEmailInput" class="clean-input" placeholder="user@example.com">
                        <select id="inviteRoleSelect" class="clean-input" style="width: 170px;">
                            <option value="Editor">Editor</option>
                            <option value="Contributor">Contributor</option>
                            <option value="Viewer">Viewer</option>
                            <option value="Commenter">Commenter</option>
                            <option value="Transfer">Transfer Ownership</option>
                        </select>
                        <button class="btn-pill" id="btnAddAccess" style="padding: 0 16px;">Add</button>
                    </div>
                </div>
                <div class="input-group">
                    <label>Collaborators with Access</label>
                    <div id="accessListContainer" style="max-height: 180px; overflow-y: auto;"></div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 18px;">
                    <button class="btn-pill" id="btnSaveAccess">Save Changes</button>
                </div>
            </div>
        </div>

        <!-- Modal: Folder Security -->
        <div class="modal-shade" id="securityModal">
            <div class="modal-box" style="max-width: 380px;">
                <div class="modal-header">
                    <div class="modal-title">Folder Security</div>
                    <button class="modal-close" id="closeSecurityModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div id="securityModalBody"></div>
            </div>
        </div>

        <!-- Modal: Manage Labels -->
        <div class="modal-shade" id="labelModal">
            <div class="modal-box" style="max-width: 400px;">
                <div class="modal-header">
                    <div class="modal-title">Manage Labels</div>
                    <button class="modal-close" id="closeLabelModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <label>Add New Label</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="newLabelInput" class="clean-input" placeholder="e.g. MN Admin, Finance">
                        <button class="btn-pill" id="btnAddLabel">Add</button>
                    </div>
                </div>
                <div class="input-group">
                    <label>Current Labels</label>
                    <div id="currentLabelsList" style="display: flex; flex-wrap: wrap; gap: 6px; min-height: 40px;"></div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 18px;">
                    <button class="btn-pill" id="btnSaveLabels">Done</button>
                </div>
            </div>
        </div>

        <!-- Modal: Share Item -->
        <div class="modal-shade" id="shareModal">
            <div class="modal-box">
                <div class="modal-header">
                    <div class="modal-title">Share Item</div>
                    <button class="modal-close" id="closeShareModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <label>Choose Share Format</label>
                    <select id="shareFormatChoice" class="clean-input">
                        <option value="url">Share as Web Link (URL)</option>
                        <option value="image">Share as Image File</option>
                        <option value="pdf">Convert Image to PDF & Share (.pdf)</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-pill" id="btnExecuteShare" style="flex: 1; justify-content: center;">Share via Device</button>
                    <button class="btn-pill" id="btnCopyShareLink" style="background: var(--hover-bg); color: var(--text-primary); border: 1px solid var(--border-color);">Copy Link</button>
                </div>
            </div>
        </div>

        <!-- Modal: Item Details -->
        <div class="modal-shade" id="detailsModal">
            <div class="modal-box" style="max-width: 420px;">
                <div class="modal-header">
                    <div class="modal-title">Item Details</div>
                    <button class="modal-close" id="closeDetailsModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="details-grid" id="detailsContent"></div>
            </div>
        </div>

        <!-- Modal: Move Item -->
        <div class="modal-shade" id="moveModal">
            <div class="modal-box" style="max-width: 420px;">
                <div class="modal-header">
                    <div class="modal-title" id="moveModalTitle">Move Item</div>
                    <button class="modal-close" id="closeMoveModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <label>Select Destination Folder</label>
                    <select id="moveDestinationSelect" class="clean-input"></select>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
                    <button class="btn-pill" id="btnConfirmMove">Move Here</button>
                </div>
            </div>
        </div>

        <!-- Modal: Rename -->
        <div class="modal-shade" id="renameModal">
            <div class="modal-box" style="max-width: 400px;">
                <div class="modal-header">
                    <div class="modal-title">Rename</div>
                    <button class="modal-close" id="closeRenameModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <label>New Name</label>
                    <input type="text" id="renameInput" class="clean-input">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn-pill" id="btnSubmitRename">Rename</button>
                </div>
            </div>
        </div>

        <!-- Modal: Create Folder -->
        <div class="modal-shade" id="folderModal">
            <div class="modal-box" style="max-width: 400px;">
                <div class="modal-header">
                    <div class="modal-title">New Folder</div>
                    <button class="modal-close" id="closeFolderModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <label>Folder Name</label>
                    <input type="text" id="newFolderName" class="clean-input" placeholder="e.g. My Folder">
                </div>
                <div class="input-group">
                    <label>Folder Password (Optional)</label>
                    <input type="text" id="newFolderPassword" class="clean-input" placeholder="Optional password lock">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn-pill" id="btnCreateFolder">Create</button>
                </div>
            </div>
        </div>

        <!-- Modal: Password Auth -->
        <div class="modal-shade" id="passwordAuthModal">
            <div class="modal-box" style="max-width: 360px;">
                <div class="modal-header">
                    <div class="modal-title">Password Required</div>
                    <button class="modal-close" id="closePassModal">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="input-group">
                    <input type="password" id="authPasswordInput" class="clean-input" placeholder="Enter password to continue">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn-pill" id="btnSubmitAuth">Unlock</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);
}

// 2. Helper to render the color & icon picker in the customize modal
export function renderCustomizePicker(selectedColor, selectedIcon, onColorSelect, onIconSelect) {
    const previewIconContainer = document.getElementById('customizePreviewIcon');
    if (previewIconContainer) {
        previewIconContainer.style.color = selectedColor;
        previewIconContainer.innerHTML = FOLDER_BADGE_ICONS[selectedIcon] || FOLDER_BADGE_ICONS.folder;
    }

    const carousel = document.getElementById('colorCarouselWrap');
    if (carousel) {
        carousel.innerHTML = '';
        FOLDER_COLORS.forEach(c => {
            const circle = document.createElement('div');
            circle.className = `color-swatch-circle ${c.hex.toLowerCase() === selectedColor.toLowerCase() ? 'active' : ''}`;
            circle.style.backgroundColor = c.hex;
            circle.title = c.name;
            circle.addEventListener('click', () => onColorSelect(c.hex));
            carousel.appendChild(circle);
        });
    }

    const iconGrid = document.getElementById('iconPaletteGrid');
    if (iconGrid) {
        iconGrid.innerHTML = '';
        Object.keys(FOLDER_BADGE_ICONS).forEach(key => {
            const swatch = document.createElement('div');
            swatch.className = `icon-swatch ${key === selectedIcon ? 'active' : ''}`;
            swatch.innerHTML = FOLDER_BADGE_ICONS[key];
            swatch.title = key;
            swatch.addEventListener('click', () => onIconSelect(key));
            iconGrid.appendChild(swatch);
        });
    }
}

// Automatically mount modals if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
} else {
    initModals();
}

How to use model.js in your HTML:

Inside the <script type="module"> block of 1 (12).html or folder.html, import it
directly:

import { initModals, renderCustomizePicker } from "./model.js";
import { FOLDER_COLORS, FOLDER_BADGE_ICONS } from "https://knox-app.github.io/cloud/drive/folder/icon-sys.js";

All 10 modal elements will be injected into the DOM automatically upon import,
allowing all hardcoded modal HTML blocks to be removed from your HTML page.
