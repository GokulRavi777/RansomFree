export function renderResultCard(result) {
    const { file_name, status } = result;
    
    return `
        <div class="dashboard-card">
            <h2 class="card-title">Analysis Result: <span class="highlight">${file_name}</span></h2>
            <div class="status-badge status-${status}">
                ${status}
            </div>
        </div>
    `;
}
