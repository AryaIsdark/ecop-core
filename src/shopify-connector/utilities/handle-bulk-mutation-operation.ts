import { ShopifyConfig } from '../shopify-connector.service';
import { createJSONLFile } from './create-jsonl-file';
import { pollBulkOperationStatus } from './poll-bulk-operation-status';
import { runBulkMutation } from './run-bulk-mutation';
import { uploadFileToShopify } from './upload-file-to-shopify';

export const handleBulkMutationOperation = async (
  shopifyConfig: ShopifyConfig,
  mutationQuery: string,
  input: any[],
) => {
  try {
    const { fileName, fileSize } = createJSONLFile('bulk-mutation', input);
    console.info(
      'File created for bulk mutation operation:',
      fileName,
      'Size:',
      fileSize,
    );

    const { uploadUrl } = await uploadFileToShopify(
      shopifyConfig,
      fileName,
      fileSize,
    );
    console.info('File uploaded to Shopify. Upload URL:', uploadUrl);

    const bulkOperationId = await runBulkMutation(
      shopifyConfig,
      mutationQuery,
      uploadUrl,
    );

    console.info(
      'Bulk mutation operation initiated. Operation ID:',
      bulkOperationId,
    );

    const url = await pollBulkOperationStatus(shopifyConfig, bulkOperationId);

    console.info('Bulk mutation operation completed. Result URL:', url);

    return url;
  } catch (error) {
    console.error('Error processing bulk operation:', error);
    throw error;
  }
};
