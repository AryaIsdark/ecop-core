export const updateInventoryUpdateMutation = () => `
mutation call($id: ID!, $input: InventoryItemInput!) {
  inventoryItemUpdate(id: $id, input: $input) {
    inventoryItem {
      id
      unitCost {
        amount
      }
    }
    userErrors {
      message
      field
    }
  }
}
`;
