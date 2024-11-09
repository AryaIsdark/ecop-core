import { ShopifyConfig } from "../shopify-connector.service";
import { fetchBulkOperationResults } from "./fetch-bulk-operation-results";
import { pollBulkOperationStatus } from "./poll-bulk-operation-status";
import { runBulkQuery } from "./run-bulk-query";

export const handleBulkQueryOperation = async (shopifyConfig: ShopifyConfig, query: string) =>  {
    try {
      const operationId = await runBulkQuery(shopifyConfig, query);
      const resultUrl = await pollBulkOperationStatus(shopifyConfig, operationId);
      const results = await fetchBulkOperationResults(resultUrl);

      return results;
    } catch (error) {
      console.error('Error fetching processing bulk operation:', error);
      throw error;
    }
  }