export function renderBreakdownPanel(result) {
    const { static_analysis, sandbox_analysis } = result;
    
    // Truncate syscalls safely to prevent UI overflow
    let syscallsText = sandbox_analysis?.syscalls || "None";
    if (syscallsText.length > 500) {
        syscallsText = syscallsText.substring(0, 500) + "... (truncated)";
    }

    return `
        <div class="details-grid">
            <div class="dashboard-card">
                <h3 class="card-title">Static Analysis</h3>
                
                <div class="detail-item">
                    <span class="detail-label">File Type</span>
                    <span class="detail-value">${static_analysis?.file_type || 'Unknown'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Entropy Score</span>
                    <span class="detail-value">${static_analysis?.entropy?.toFixed(2) || 0} / 8.0</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Suspicious Keywords Found</span>
                    <span class="detail-value">${static_analysis?.keywords?.length > 0 ? static_analysis.keywords.join(", ") : "None"}</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3 class="card-title">Dynamic Sandbox Analysis</h3>
                
                <div class="detail-item">
                    <span class="detail-label">Execution Status</span>
                    <span class="detail-value">${sandbox_analysis?.executed ? 'Executed Successfully' : 'Failed or Skipped'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Behavioral Notes</span>
                    <span class="detail-value">${sandbox_analysis?.notes?.length > 0 ? sandbox_analysis.notes.join("<br>") : "None recorded"}</span>
                </div>
                
                <div class="detail-item" style="margin-top: 1rem;">
                    <span class="detail-label" style="margin-bottom: 0.5rem;">System Calls</span>
                    <div class="code-block">${syscallsText}</div>
                </div>
            </div>
        </div>
    `;
}
