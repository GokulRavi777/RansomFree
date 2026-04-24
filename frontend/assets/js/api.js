export async function analyzeFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // According to requirements, STRICTLY use port 5001
        const response = await fetch('http://localhost:5001/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
}

export async function sendChatMessage(query, analysisData) {
    try {
        const response = await fetch('http://localhost:5001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                analysis_data: analysisData
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Chat failed:', error);
        return "I'm having trouble connecting to the AI server right now. Please check if the API keys are configured correctly on the backend.";
    }
}
