import { state, subscribe } from './state.js';
import { handleUpload, handleFileSelect, resetApp } from './uploader.js';
import { render } from './renderer.js';

const appContainer = document.getElementById('app');

function init() {
    console.log("RansomFree App Initialized");
    
    // Global Event Delegation
    appContainer.addEventListener('change', (e) => {
        if (e.target.id === 'file-input' || e.target.id === 'folder-input') {
            console.log("Files selected:", e.target.files);
            if (e.target.files.length > 0) handleFileSelect(e.target.files);
        }
    });

    // Drag and Drop Handling
    appContainer.addEventListener('dragover', (e) => {
        const dropzone = e.target.closest('#upload-dropzone');
        if (dropzone) {
            e.preventDefault();
            dropzone.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            dropzone.style.borderColor = 'var(--primary)';
        }
    });

    appContainer.addEventListener('dragleave', (e) => {
        const dropzone = e.target.closest('#upload-dropzone');
        if (dropzone) {
            e.preventDefault();
            dropzone.style.backgroundColor = '';
            dropzone.style.borderColor = '';
        }
    });

    appContainer.addEventListener('drop', (e) => {
        const dropzone = e.target.closest('#upload-dropzone');
        if (dropzone) {
            e.preventDefault();
            dropzone.style.backgroundColor = '';
            dropzone.style.borderColor = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                console.log("Files dropped:", e.dataTransfer.files);
                handleFileSelect(e.dataTransfer.files);
            }
        }
    });

    appContainer.addEventListener('click', (e) => {
        const analyzeBtn = e.target.closest('#btn-analyze');
        if (analyzeBtn && !analyzeBtn.disabled) {
            console.log("Analyze clicked");
            handleUpload();
        }
        
        const resetBtn = e.target.closest('#btn-new-scan');
        if (resetBtn) {
            console.log("Reset clicked");
            resetApp();
        }

        const viewMlBtn = e.target.closest('#btn-view-ml');
        if (viewMlBtn) {
            import('./state.js').then(m => m.updateState({ view: 'ml_dashboard' }));
        }

        const backResultBtn = e.target.closest('#btn-back-result');
        if (backResultBtn) {
            import('./state.js').then(m => m.updateState({ view: 'result' }));
        }
    });

    // Subscribe to state changes
    subscribe((newState) => {
        console.log("State change detected", newState);
        render(newState, appContainer);
    });
    
    // Initial render
    render(state, appContainer);
}

document.addEventListener('DOMContentLoaded', init);
