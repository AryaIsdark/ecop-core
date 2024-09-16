import fs from 'fs'

export const createJSONLFile = (filenamePrefix: string, data: any) => {
    const fileName = `${filenamePrefix}-${new Date().getTime()}.jsonl`;

    const jsonlContent = data.map((item: any) => {
        const structuredItem = {
            input: item
        };
        return JSON.stringify(structuredItem);
    }).join('\n');

    fs.writeFileSync(fileName, jsonlContent);

    // Get the file size in bytes
    const stats = fs.statSync(fileName);
    return { fileName: fileName, fileSize: stats.size };
};