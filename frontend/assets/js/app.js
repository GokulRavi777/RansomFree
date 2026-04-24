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
