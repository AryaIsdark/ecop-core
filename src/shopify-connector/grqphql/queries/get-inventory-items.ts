export const GET_INVENTORY_ITEMS = `inventoryItems {
    edges {
        node {
            id
            sku
            inventoryLevels(first:10){
                edges {
                    node {
                        location {
                            id
                        }
                    }
                }
            }
        }
    }
}`