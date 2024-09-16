import { ShopifyConfig } from "../shopify-connector.service"
import { initializeShopify } from "./initialize-shopify"


export const  cancelBulkOperation =async(operationId: string, shopifyConfig: ShopifyConfig) => {
    const mutation = `mutation {
        bulkOperationCancel(id: "gid://shopify/BulkOperation/${operationId}") {
          bulkOperation {
            status
          }
          userErrors {
            field
            message
          }
        }
      }
      `
    const shopify = await initializeShopify(shopifyConfig)  
    const response = await shopify.graphql(mutation)
    return response
}