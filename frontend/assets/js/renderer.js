import { renderUploadBox } from '../../components/uploadBox.js';
import { renderResultCard } from '../../components/resultCard.js';
import { renderRiskMeter } from '../../components/riskMeter.js';
import { renderBreakdownPanel } from '../../components/breakdownPanel.js';
import { renderMLDashboard, initMLDashboard } from '../../components/mlDashboard.js';
import { generateExplanation, initChatbot } from './ai_explainer.js';

export function render(state, container) {
    if (state.isUploading) {
        container.innerHTML = renderLoading(state);
        return;
    }

    if (state.results && state.results.length > 0) {
        if (state.results.length === 1) {
            // Render single result
            const res = state.results[0];
            if (state.view === 'ml_dashboard') {
                container.innerHTML = `
                    <div class="dashboard-layout animate-in">
                        <div class="dashboard-main">
                            <div class="animate-in">
                                ${renderMLDashboard(res, true)}
                            </div>
                        </div>
                        <div class="dashboard-sidebar animate-slide delay-4">
                            <div id="chatbot-container"></div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    initMLDashboard(res);
                    initChatbot(res, document.getElementById('chatbot-container'));
                }, 50);
            } else {
                container.innerHTML = `
                    <div class="dashboard-layout animate-in">
                        <div class="dashboard-main">
                            <div class="animate-in">${renderResultCard(res)}</div>
                            <div class="animate-in delay-1">${renderRiskMeter(res)}</div>
                            <button id="btn-view-ml" class="btn animate-in delay-2" style="width: 100%; margin: 1rem 0; background: rgba(99, 102, 241, 0.1); color: rgb(99, 102, 241); border: 1px solid rgb(99, 102, 241); font-weight: 700; box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.2);">📊 View ML Interpretability Dashboard</button>
                            <div class="animate-in delay-3">${renderBreakdownPanel(res)}</div>
                            <div class="animate-in delay-4" style="text-align: center; margin-top: 1.5rem;">
                                <button id="btn-new-scan" class="btn btn-outline">Analyze More Files</button>
                            </div>
                        </div>
                        <div class="dashboard-sidebar animate-slide delay-4">
                            <div id="chatbot-container"></div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    const fill = document.getElementById('risk-fill');
                    if (fill) fill.style.width = `${res.risk_score || 0}%`;
                    initChatbot(res, document.getElementById('chatbot-container'));
                }, 50);
            }
        } else {
            // Render multiple results summary
            let html = `<div class="dashboard-card"><h3 class="card-title">Batch Scan Results</h3>`;
            html += `<div style="overflow-x: auto;"><table style="width:100%; border-collapse: collapse; text-align: left; color: var(--primary);">
                <tr style="border-bottom: 2px solid var(--border);"><th style="padding: 12px 10px; font-weight: 700;">File</th><th style="padding: 12px 10px; font-weight: 700;">Status</th><th style="padding: 12px 10px; font-weight: 700;">Score</th></tr>`;
            
            state.results.forEach(res => {
                const colorClass = res.status === 'SAFE' ? 'color: var(--safe);' : (res.status === 'SUSPICIOUS' ? 'color: var(--suspicious);' : 'color: var(--malicious);');
                html += `<tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px 10px; word-break: break-all; font-weight: 500;">${res.file_name}</td>
                    <td style="padding: 12px 10px; ${colorClass} font-weight: 700;">${res.status}</td>
                    <td style="padding: 12px 10px; font-weight: 600;">${res.risk_score || 0}</td>
                </tr>`;
            });
            html += `</table></div></div>
                <div style="text-align: center; margin-top: 1.5rem;">
                    <button id="btn-new-scan" class="btn btn-primary">Start New Scan</button>
                </div>`;
            container.innerHTML = html;
        }
        return;
    }

    container.innerHTML = renderUploadBox(state);
}

function renderLoading(state) {
    const total = state.files.length;
    const current = state.loadingStep + 1;
    const percent = Math.round(((current - 1) / total) * 100);

    return `
        <div class="loading-panel" style="max-width: 800px; margin: 0 auto;">
            <div class="spinner"></div>
            <div class="loading-text" id="loading-msg">Analyzing ${current} of ${total}...</div>
            <div style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem; word-break: break-all;">${state.currentFileName}</div>
            <div style="margin-top: 1.5rem; background: var(--border); border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: var(--accent); height: 100%; width: ${percent}%; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;
}
