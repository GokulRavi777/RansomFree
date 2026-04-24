import { renderUploadBox } from '../../components/uploadBox.js';
import { renderResultCard } from '../../components/resultCard.js';
import { renderRiskMeter } from '../../components/riskMeter.js';
import { renderBreakdownPanel } from '../../components/breakdownPanel.js';
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
            container.innerHTML = `
                ${renderResultCard(res)}
                ${renderRiskMeter(res)}
                ${renderBreakdownPanel(res)}
                <div id="chatbot-container"></div>
                <div style="text-align: center; margin-top: 1.5rem;">
                    <button id="btn-new-scan" class="btn btn-outline">Analyze More Files</button>
                </div>
            `;
            setTimeout(() => {
                const fill = document.getElementById('risk-fill');
                if (fill) fill.style.width = `${res.risk_score || 0}%`;
                initChatbot(res, document.getElementById('chatbot-container'));
            }, 50);
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
        <div class="loading-panel">
            <div class="spinner"></div>
            <div class="loading-text" id="loading-msg">Analyzing ${current} of ${total}...</div>
            <div style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem; word-break: break-all;">${state.currentFileName}</div>
            <div style="margin-top: 1.5rem; background: var(--border); border-radius: 4px; height: 8px; overflow: hidden;">
                <div style="background: var(--accent); height: 100%; width: ${percent}%; transition: width 0.3s ease;"></div>
            </div>
        </div>
    `;
}
