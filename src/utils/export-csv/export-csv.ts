import * as fs from 'fs';
import * as path from 'path';
import * as converter from 'json-2-csv';

const ensureDirectoryExistence = async (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  await fs.promises.mkdir(dirname, { recursive: true });
};

export interface CsvKeyMapping<T> {
  field: keyof T | string;
  title: string;
}

export const exportToCsv = async <T>(
  data: T[],
  keys: CsvKeyMapping<T>[],
  fileName: string,
  csvOptions: converter.Json2CsvOptions = {},
  rootFolder: string = process.cwd(),
  exportsFolder: string = 'exports',
): Promise<string | void> => {
  try {
    const csv = await converter.json2csv(data as any, { keys: keys as any[], ...csvOptions });

    // Remove headers
    const csvWithoutHeaders = csv.split('\n').slice(1).join('\n');

    const filePath = path.join(rootFolder, exportsFolder, fileName);

    await ensureDirectoryExistence(filePath);

    await fs.promises.writeFile(filePath, csvWithoutHeaders);
    return filePath;
  } catch (e) {
    console.error(e);
  }
};
