
import { ShopifyConfig } from "../shopify-connector.service"
import { initializeShopify } from "./initialize-shopify"

export const inventorySetQuantities = async(shopifyConfig: ShopifyConfig, quantities: any[]) => {

    const shopify = await initializeShopify(shopifyConfig)  

    const mutation = `mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
        inventorySetQuantities(input: $input) {
          inventoryAdjustmentGroup {
            reason
            referenceDocumentUri
            changes {
              name
              delta
              quantityAfterChange
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }`

    const variables = {

        input: {
            ignoreCompareQuantity: true,
            name: "available",
            reason: "correction",
            referenceDocumentUri: "logistics://some.warehouse/take/2023-01-23T13:14:15Z",
            quantities: quantities
        }

    }

    try {
        const response = await shopify.graphql(mutation, { ...variables })
        return response
    }
    catch (e) {
        console.error(e)
    }

}