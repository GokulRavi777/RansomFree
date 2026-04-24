export function generateExplanation(data) {
    const { status, static_analysis, sandbox_analysis } = data;
    
    let explanation = "";
    
    if (status === "MALICIOUS") {
        explanation += "This file exhibits strong indicators of being ransomware or malware. ";
    } else if (status === "SUSPICIOUS") {
        explanation += "This file has some abnormal characteristics that warrant caution. ";
    } else {
        explanation += "This file appears benign based on our current analysis parameters. ";
    }
    
    if (static_analysis?.entropy > 7.5) {
        explanation += "It is highly obfuscated or packed, which is typical for malicious payloads. ";
    }
    
    if (static_analysis?.keywords?.length > 0) {
        explanation += `It contains suspicious keywords (${static_analysis.keywords.join(", ")}). `;
    }
    
    if (sandbox_analysis?.executed) {
        explanation += "During sandbox execution, we monitored its behavior and captured system-level activity. ";
    }
    
    return explanation;
}

export function initChatbot(result, container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="dashboard-card ai-panel" style="margin-top: 1.5rem; display: flex; flex-direction: column; height: 380px;">
            <h3 class="card-title" style="margin-bottom: 0; border-bottom: none; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Threat Intelligence Chatbot
            </h3>
            <div id="chat-history" style="flex: 1; overflow-y: auto; padding: 1rem 0.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 1rem;">
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="chat-input" placeholder="Ask about entropy, syscalls, or risk..." style="flex: 1; padding: 0.75rem; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; font-size: 0.95rem;">
                <button id="btn-send-chat" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">Send</button>
            </div>
        </div>
    `;

    const history = document.getElementById('chat-history');
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('btn-send-chat');

    const appendMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.style.padding = '0.75rem 1rem';
        msg.style.borderRadius = '12px';
        msg.style.maxWidth = '85%';
        msg.style.lineHeight = '1.5';
        msg.style.fontSize = '0.95rem';
        
        if (sender === 'bot') {
            msg.style.backgroundColor = '#f1f5f9';
            msg.style.alignSelf = 'flex-start';
            msg.style.color = 'var(--primary)';
            msg.style.borderBottomLeftRadius = '2px';
        } else {
            msg.style.backgroundColor = 'var(--accent)';
            msg.style.color = '#fff';
            msg.style.alignSelf = 'flex-end';
            msg.style.borderBottomRightRadius = '2px';
        }
        
        msg.innerHTML = text;
        history.appendChild(msg);
        history.scrollTop = history.scrollHeight;
    };

    // Initial greeting
    const initialText = generateExplanation(result);
    appendMessage(`<strong>Analysis Summary:</strong><br>${initialText}<br><br><em>I am your AI assistant. Ask me anything about this file's threat profile!</em>`, 'bot');

    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        
        appendMessage(text, 'user');
        input.value = '';
        
        // Add a typing indicator
        const typingId = 'typing-' + Date.now();
        const typingMsg = document.createElement('div');
        typingMsg.id = typingId;
        typingMsg.style.alignSelf = 'flex-start';
        typingMsg.style.color = 'var(--text-muted)';
        typingMsg.style.fontSize = '0.85rem';
        typingMsg.style.padding = '0.5rem';
        typingMsg.innerText = 'AI is typing...';
        history.appendChild(typingMsg);
        history.scrollTop = history.scrollHeight;

        setTimeout(() => {
            const typingElem = document.getElementById(typingId);
            if(typingElem) typingElem.remove();
            const response = generateBotResponse(text, result);
            appendMessage(response, 'bot');
        }, 800);
    };

    btn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

function generateBotResponse(query, data) {
    const q = query.toLowerCase();
    
    if (q.includes('entropy')) {
        const ent = data.static_analysis?.entropy?.toFixed(2) || 0;
        return `<strong>Entropy</strong> measures the randomness of the file data. This file has an entropy of <strong>${ent}</strong>. High entropy (above 7.0) usually means the file is packed or encrypted—a common tactic used by ransomware to evade antivirus scanners.`;
    }
    
    if (q.includes('syscall') || q.includes('system call') || q.includes('dynamic') || q.includes('behavior')) {
        const calls = data.sandbox_analysis?.syscalls || "none";
        if (calls === "none" || calls.trim() === "") {
            return `I didn't detect any significant system calls during the sandbox execution. This might mean the malware detected the sandbox and refused to run, or it's a benign file.`;
        }
        return `<strong>System calls</strong> are requests the program makes to the OS. During execution, this file generated system calls that match common ransomware patterns (like deleting shadow copies or iterating through files).`;
    }
    
    if (q.includes('keyword') || q.includes('string') || q.includes('static')) {
        const kw = data.static_analysis?.keywords || [];
        if (kw.length > 0) {
            return `I found the following suspicious strings inside the file's binary code: <strong>${kw.join(", ")}</strong>. These words are frequently found in ransomware notes or cryptographic routines.`;
        }
        return `I didn't find any obviously suspicious keywords like 'encrypt' or 'bitcoin' in this file's static strings.`;
    }

    if (q.includes('safe') || q.includes('fix') || q.includes('what should i do') || q.includes('recommend')) {
        if (data.status === 'MALICIOUS') {
            return `🚨 <strong>DO NOT RUN THIS FILE!</strong> It exhibits strong ransomware traits. You should delete it immediately and run a full system antivirus scan.`;
        } else if (data.status === 'SUSPICIOUS') {
            return `⚠️ <strong>Exercise caution.</strong> While it doesn't have all the hallmarks of a known threat, its behavior is abnormal. Do not execute it on your host machine.`;
        } else {
            return `✅ Based on my analysis, this file appears safe. However, always ensure you download files from trusted sources.`;
        }
    }
    
    return `I'm an AI assistant focused on this malware analysis. You can ask me to explain its "entropy", "syscalls", "keywords", or ask "what should I do?".`;
}
