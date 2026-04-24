export async function analyzeFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // According to requirements, STRICTLY use port 5000
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
