import { ShopifyConfig } from "../shopify-connector.service";
import { initializeShopify } from "./initialize-shopify";

export const runBulkMutation = async(shopifyConfig: ShopifyConfig, mutation: string, resourceUrl: string) => {
    const shopify = await initializeShopify(shopifyConfig)

    const query = `
    mutation {
        bulkOperationRunMutation(
            mutation: """
            ${mutation}
            """
            stagedUploadPath: "${resourceUrl}"
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
    }
`;

    try {
        const response = await shopify.graphql(query);
        return response.bulkOperationRunMutation.bulkOperation.id;
    } catch (e) {
        console.error(e);
    }
};