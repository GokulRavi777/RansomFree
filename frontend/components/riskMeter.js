export function renderRiskMeter(result) {
    const { risk_score, status } = result;
    
    return `
        <div class="dashboard-card risk-meter-container">
            <h3 class="card-title" style="display: flex; justify-content: space-between;">
                <span>Risk Score</span>
                <span class="status-${status}" style="font-weight: 800;">${risk_score}/100</span>
            </h3>
            <div class="risk-bar-bg">
                <div id="risk-fill" class="risk-bar-fill bg-${status}"></div>
            </div>
        </div>
    `;
}
