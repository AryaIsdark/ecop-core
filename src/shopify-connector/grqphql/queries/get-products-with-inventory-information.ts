export const GET_PRODUCT_VARIANTS_WITH_INVENTORY_INFOR = `productVariants {
    edges {
        node {
            id
            sku
            inventoryQuantity
            inventoryItem {
                id
            }
            metafield(namespace: "custom", key: "delivery_estimation") {
                id
            }
        }
    }
}`