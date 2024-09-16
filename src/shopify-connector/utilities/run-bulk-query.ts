import { ShopifyConfig } from "../shopify-connector.service";
import { initializeShopify } from "./initialize-shopify";

export const runBulkQuery = async(shopifyConfig: ShopifyConfig, query: string) => {
    const shopify = await initializeShopify(shopifyConfig)
    
    const mutation = `mutation {
        bulkOperationRunQuery(
            query: """
            {
                ${query}
            }
            """
        ) {
            bulkOperation {
                id
                status
            }
            userErrors {
                field
                message
            }
        }
    }`;

    try {
        const response = await shopify.graphql(mutation);
        const operation = response.bulkOperationRunQuery.bulkOperation;
        if (operation.userErrors && operation.userErrors.length > 0) {
            throw new Error(`Error initiating bulk operation: ${operation.userErrors[0].message}`);
        }
        return operation.id;
    } catch (error) {
        console.error('Error initiating bulk operation:', error);
        throw error;
    }
}