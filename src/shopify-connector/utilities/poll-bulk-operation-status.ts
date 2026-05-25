import { ShopifyConfig } from '../shopify-connector.service';
import { initializeShopify } from './initialize-shopify';

export const pollBulkOperationStatus = async (
  shopifyConfig: ShopifyConfig,
  operationId: string,
) => {
  const shopify = await initializeShopify(shopifyConfig);

  const query = `query {
        node(id: "${operationId}") {
            ... on BulkOperation {
                id
                status
                url
                partialDataUrl
            }
        }
    }`;

  try {
    let status = 'RUNNING';
    let resultUrl = null;

    while (status === 'RUNNING' || status === 'CREATED') {
      const response = await shopify.graphql(query);
      const operation = response.node;

      status = operation.status;
      resultUrl = operation.url;

      if (status === 'RUNNING' || status === 'CREATED') {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }
    }

    if (status !== 'COMPLETED') {
      throw new Error(`Bulk operation failed with status: ${status}`);
    }

    return resultUrl;
  } catch (error) {
    console.error(
      'Error polling bulk operation status for shop:',
      'operationId:',
      operationId,
      'error:',
      JSON.stringify(error, null, 2),
    );
    console.error('Error polling bulk operation status:', error);
    throw error;
  }
};
