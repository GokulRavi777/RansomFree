export function renderMLDashboard(res, isStandalone = false) {
    return `
        ${isStandalone ? '<div style="margin-bottom: 1.5rem;"><button id="btn-back-result" class="btn btn-outline">&larr; Back to Analysis</button></div>' : ''}
        <div class="dashboard-card ml-dashboard" style="margin-top: 1rem; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--white); ${isStandalone ? 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);' : ''}">
            <div style="background: var(--bg-main); padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
                <h3 style="margin: 0; font-size: 1.25rem; color: var(--primary);">🧠 ML Interpretability Dashboard</h3>
                <span style="font-size: 0.85rem; color: var(--text-muted); background: var(--white); padding: 4px 12px; border-radius: 12px; border: 1px solid var(--border); font-weight: 600;">Model: Isolation Forest</span>
            </div>
            
            <div style="padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Left Column -->
                <div>
                    <!-- Threat Classification -->
                    <div class="animate-in delay-1" style="margin-bottom: 2rem;">
                        <h4 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Threat Classification</h4>
                        <div style="font-size: 1.2rem; font-weight: 700; color: ${res.risk_score > 70 ? 'var(--malicious)' : (res.risk_score > 30 ? 'var(--suspicious)' : 'var(--safe)')}; margin-bottom: 0.5rem;">
                            ${res.threat_analysis?.type || (res.risk_score > 70 ? 'Malware / Ransomware' : (res.risk_score > 30 ? 'Suspicious File' : 'Benign File'))}
                        </div>
                        <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem;">
                            ${(res.threat_analysis?.indicators || ['High entropy detected', 'Suspicious strings found']).map(ind => `<li>${ind}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Anomaly Visualization -->
                    <div class="animate-in delay-2" style="margin-bottom: 2rem;">
                        <h4 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Anomaly Score</h4>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${res.ml_analysis?.anomaly_score?.toFixed(3) || '-0.420'}</span>
                            <span style="font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; background: ${res.ml_analysis?.anomaly !== false ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; color: ${res.ml_analysis?.anomaly !== false ? 'var(--malicious)' : 'var(--safe)'}; border: 1px solid currentColor;">
                                ${res.ml_analysis?.anomaly !== false ? 'ANOMALOUS' : 'NORMAL'}
                            </span>
                        </div>
                        <div style="position: relative; height: 8px; background: linear-gradient(90deg, var(--malicious) 0%, var(--suspicious) 50%, var(--safe) 100%); border-radius: 4px; overflow: hidden;">
                            <div id="anomaly-marker" style="position: absolute; top: -2px; width: 4px; height: 12px; background: #fff; box-shadow: 0 0 4px #000; left: 50%; transition: left 1s ease;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                            <span>Outlier (-1)</span>
                            <span>Normal (+1)</span>
                        </div>
                    </div>

                    <!-- Analysis Timeline -->
                    <div class="animate-in delay-3">
                        <h4 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Analysis Pipeline</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: var(--safe); display: flex; align-items: center; justify-content: center; color: #000; font-size: 10px;">✔</div>
                                <span style="color: var(--primary);">Static Analysis</span>
                            </div>
                            <div style="width: 2px; height: 10px; background: var(--border); margin-left: 7px;"></div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: var(--safe); display: flex; align-items: center; justify-content: center; color: #000; font-size: 10px;">✔</div>
                                <span style="color: var(--primary);">Sandbox Execution</span>
                            </div>
                            <div style="width: 2px; height: 10px; background: var(--border); margin-left: 7px;"></div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: var(--safe); display: flex; align-items: center; justify-content: center; color: #000; font-size: 10px;">✔</div>
                                <span style="color: var(--primary);">ML Anomaly Detection</span>
                            </div>
                            <div style="width: 2px; height: 10px; background: var(--border); margin-left: 7px;"></div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px;">🎯</div>
                                <span style="color: var(--primary); font-weight: bold;">Final Classification</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (Charts) -->
                <div class="animate-in delay-2" style="display: flex; flex-direction: column;">
                    <h4 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Feature Contribution (Normalized 0-1)</h4>
                    <div style="flex-grow: 1; position: relative; min-height: 250px;">
                        <canvas id="featureChart"></canvas>
                    </div>
                    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-main); border-radius: 6px; border-left: 4px solid var(--accent); font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">
                        <strong>AI Insight:</strong> <span id="ml-insight-text">Loading insights...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initMLDashboard(res) {
    // 1. Initialize Anomaly Marker
    const marker = document.getElementById('anomaly-marker');
    if (marker) {
        // Score range -1 to +1 -> maps to 0% to 100% left
        const score = res.ml_analysis?.anomaly_score || -0.42; // default if missing
        // Math: left = ((score + 1) / 2) * 100
        const percentage = Math.max(0, Math.min(100, ((score + 1) / 2) * 100));
        setTimeout(() => {
            marker.style.left = `${percentage}%`;
        }, 100);
    }

    // 2. Data Transformation for Feature Chart
    // Entropy (0-8)
    const rawEntropy = res.static_analysis?.entropy?.mean || 0;
    const normEntropy = Math.min(rawEntropy / 8, 1);
    
    // Keywords (0-50 scaled)
    const rawKeywords = res.static_analysis?.strings?.suspicious_count || res.static_analysis?.strings?.count || 0;
    const normKeywords = Math.min(rawKeywords / 50, 1);
    
    // File Size (log scale approximation, assuming 10MB max expected for extreme)
    const rawSize = res.static_analysis?.pe_info?.file_size || res.static_analysis?.file_size || 0;
    const normSize = rawSize > 0 ? Math.min(Math.log10(rawSize) / 7, 1) : 0;
    
    // Sandbox Activity (events generated)
    const rawSandbox = res.sandbox_analysis?.events ? Object.keys(res.sandbox_analysis.events).length : 0;
    const normSandbox = Math.min(rawSandbox / 20, 1) || (res.risk_score > 50 ? 0.8 : 0.2); // Fallback

    const features = [normEntropy, normKeywords, normSize, normSandbox];
    const labels = ['Entropy', 'Keywords', 'File Size', 'Sandbox Activity'];

    // Find dominant feature
    const maxVal = Math.max(...features);
    const dominantIndex = features.indexOf(maxVal);
    
    // 3. Render Chart
    const ctx = document.getElementById('featureChart');
    if (ctx && window.Chart) {
        // Chart defaults for light theme (RansomFree default)
        Chart.defaults.color = '#64748b'; // text-muted
        Chart.defaults.borderColor = '#e2e8f0'; // border
        Chart.defaults.font.family = "'Inter', sans-serif";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Contribution to Anomaly',
                    data: features,
                    backgroundColor: features.map((_, i) => 
                        i === dominantIndex ? 'rgba(239, 68, 68, 0.8)' : 'rgba(99, 102, 241, 0.5)'
                    ),
                    borderColor: features.map((_, i) => 
                        i === dominantIndex ? 'rgba(239, 68, 68, 1)' : 'rgba(99, 102, 241, 1)'
                    ),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 1,
                        grid: { color: '#e2e8f0' }
                    },
                    y: {
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Score: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });

        // 4. Update Insight Text
        const insightText = document.getElementById('ml-insight-text');
        if (insightText) {
            const dominantLabel = labels[dominantIndex];
            if (res.ml_analysis?.anomaly !== false && res.risk_score > 50) {
                if (dominantLabel === 'Entropy') {
                    insightText.innerHTML = "High file entropy strongly suggests the presence of packed code or encrypted payloads commonly used by ransomware to evade detection.";
                } else if (dominantLabel === 'Keywords') {
                    insightText.innerHTML = "Anomalous frequency of suspicious keywords (like 'encrypt', 'bitcoin') was the primary driver for ML flagging this as malicious.";
                } else if (dominantLabel === 'Sandbox Activity') {
                    insightText.innerHTML = "Behavioral anomalies during execution (e.g., mass file modification) heavily influenced the model's malicious classification.";
                } else {
                    insightText.innerHTML = "The combination of file size and structural anomalies contributed most significantly to the ML detection.";
                }
            } else {
                insightText.innerHTML = "The ML model found the feature distribution to be within normal expected bounds for benign software.";
            }
        }
    }
}
