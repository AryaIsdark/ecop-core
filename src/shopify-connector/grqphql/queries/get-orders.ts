export const GET_ORDERS = `
  query($query: String!) {
    orders(first: 10, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 5) {
            edges {
              node {
                name
                quantity
                variant {
                  price
                }
              }
            }
          }
        }
      }
    }
  }
`;
