//query: "created_at>=2024-09-29T21:29:51.897Z"

export const getOrdersQuery = (query) => `
    orders(query: "${query}") {
      edges {
        node {
          id
          createdAt
          confirmationNumber
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
          lineItems(first:10) {
            edges {
              node {
                name
                quantity
                sku   
                product{
                  id
                }             
                variant {
                  price
                }
              }
            }
          }
        }
      }
    }
`;
