import * as fs from 'fs';

export const createJSONLFile = (filenamePrefix: string, data: any[]) => {
  const fileName = `${filenamePrefix}-${Date.now()}.jsonl`;

  const jsonlContent = data.map((item) => JSON.stringify(item)).join('\n');

  fs.writeFileSync(fileName, jsonlContent);

  const stats = fs.statSync(fileName);
  return { fileName, fileSize: stats.size };
};
