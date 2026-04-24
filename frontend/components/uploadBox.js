export function renderUploadBox(state) {
    const fileCount = state.files ? state.files.length : 0;
    let fileText = "Upload a file or folder";
    if (fileCount === 1) {
        fileText = state.files[0].name;
    } else if (fileCount > 1) {
        fileText = `${fileCount} items selected`;
    }

    const errorHtml = state.error ? `<div style="color: var(--malicious); margin-top: 1rem; font-size: 0.9rem; font-weight: 600;">${state.error}</div>` : '';
    
    return `
        <div class="upload-panel">
            <div id="upload-dropzone" class="upload-box-inner" style="transition: all 0.2s ease;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="margin-bottom:1rem;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <div style="font-weight: 500; color: var(--primary); margin-bottom: 0.5rem;">Drag and drop to analyze</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">Or click to browse — executables, scripts, archives, documents</div>
                <div style="font-weight: 600; color: var(--accent); margin-top: 1rem; word-break: break-all;">${fileText}</div>
            </div>
            
            <div class="upload-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <label for="file-input" class="btn btn-outline" style="flex: 1; min-width: 150px; max-width: 250px; cursor: pointer;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    Choose File(s)
                </label>
                <input type="file" id="file-input" multiple style="display: none;" />
                
                <label for="folder-input" class="btn btn-outline" style="flex: 1; min-width: 150px; max-width: 250px; cursor: pointer;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Choose Folder
                </label>
                <input type="file" id="folder-input" webkitdirectory directory multiple style="display: none;" />
                
                <button id="btn-analyze" class="btn btn-primary" ${fileCount === 0 ? 'disabled' : ''} style="flex: 1; min-width: 150px; max-width: 250px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Analyze
                </button>
            </div>
            ${errorHtml}
            
            <div class="upload-footer" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                File runs in a secure isolated sandbox — never on your device.
            </div>
        </div>
    `;
}
