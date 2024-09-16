export const fetchBulkOperationResults = async (resultUrl: string) => {
    try {
        const response = await fetch(resultUrl);
        const resultText = await response.text();
        const jsonLines = resultText.trim().split('\n');
        const resultData = jsonLines.map(line => JSON.parse(line));
        return resultData;

    } catch (error) {
        console.error('Error fetching bulk operation results:', error);
        throw error;
    }
}