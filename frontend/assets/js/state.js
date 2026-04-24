export const state = {
    files: [],
    isUploading: false,
    loadingStep: 0,
    results: [],
    view: 'upload', // 'upload', 'result', 'ml_dashboard'
    error: null,
    currentFileName: ""
};

const listeners = [];

export function subscribe(listener) {
    listeners.push(listener);
}

export function updateState(newState) {
    Object.assign(state, newState);
    listeners.forEach(listener => listener(state));
}
