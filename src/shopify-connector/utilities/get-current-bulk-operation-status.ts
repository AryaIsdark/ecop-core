import { ShopifyConfig } from "../shopify-connector.service"
import { initializeShopify } from "./initialize-shopify"


export const getCurrentBulkOperationStatus = async (shopifyConfig: ShopifyConfig, type: 'MUTATION' | 'QUERY') => {
  const shopify = await initializeShopify(shopifyConfig)
  
    const query = `query {
        currentBulkOperation(type: ${type}) {
          id
          type
          status
        }
      }`

    try {
        
        const response = await shopify.graphql(query)
        return response
    }
    catch (e) {
        console.error(e)
    }
}