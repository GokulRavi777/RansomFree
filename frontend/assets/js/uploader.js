import { state, updateState } from './state.js';
import { analyzeFile } from './api.js';

export async function handleUpload() {
    if (!state.files || state.files.length === 0) {
        updateState({ error: "Please select files to analyze." });
        return;
    }

    updateState({ isUploading: true, error: null, loadingStep: 0, results: [] });

    const total = state.files.length;
    const results = [];

    for (let i = 0; i < total; i++) {
        const file = state.files[i];
        updateState({ loadingStep: i, currentFileName: file.name });
        
        try {
            const apiResult = await analyzeFile(file);
            results.push(apiResult);
        } catch (error) {
            results.push({
                file_name: file.name,
                status: "ERROR",
                risk_score: 0,
                error: error.message
            });
        }
    }

    updateState({ results: results, isUploading: false });
}

export function handleFileSelect(files) {
    updateState({ files: Array.from(files), error: null });
}

export function resetApp() {
    updateState({ files: [], isUploading: false, loadingStep: 0, results: [], error: null, currentFileName: "" });
}
