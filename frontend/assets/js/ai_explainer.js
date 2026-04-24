import { sendChatMessage } from './api.js';

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
        <div class="dashboard-card ai-panel" style="margin-top: 0; display: flex; flex-direction: column; height: calc(100vh - 120px); min-height: 500px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
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
        
        // Use marked.js if available, otherwise fallback
        let formattedText = text;
        if (typeof marked !== 'undefined') {
            formattedText = DOMPurify.sanitize(marked.parse(text));
        } else {
            formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedText = formattedText.replace(/\n/g, '<br>');
        }

        msg.innerHTML = formattedText;
        history.appendChild(msg);
        history.scrollTop = history.scrollHeight;
    };

    // Initial greeting
    const initialText = generateExplanation(result);
    appendMessage(`<strong>Analysis Summary:</strong><br>${initialText}<br><br><em>I am your AI assistant. Ask me anything about this file's threat profile!</em>`, 'bot');

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;
        
        appendMessage(text, 'user');
        input.value = '';
        btn.disabled = true;
        
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

        try {
            // Call the backend to talk to the real LLM
            const response = await sendChatMessage(text, result);
            
            const typingElem = document.getElementById(typingId);
            if(typingElem) typingElem.remove();
            
            appendMessage(response, 'bot');
        } catch(e) {
            const typingElem = document.getElementById(typingId);
            if(typingElem) typingElem.remove();
            appendMessage("Error communicating with AI server.", 'bot');
        } finally {
            btn.disabled = false;
        }
    };

    btn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !btn.disabled) handleSend();
    });
}
