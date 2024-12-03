window.dataLayer.push({
      event: "view_item",
      ecommerce: {
          currency: "USD", // Ensure this matches the currency of the event
          value: item.Value, // The total value of the items (price * quantity)
          items: [
              {
                  item_id: item.ProductID, // Unique ID for the item
                  item_name: item.Name, // Name of the item
                  item_brand: item.Brand, // Brand of the item
                  price: item.Price, // Price of the item
                  quantity: 1 // Quantity of the item
              }
          ]
      }
  });
// true; end

window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
        currency: "USD", // Ensure this matches the currency of the event
        item_list_name: item.Categories,
        items: [
            {
                item_id: item.ProductID, // Unique ID for the item
                item_name: item.Name, // Name of the item
                item_brand: item.Brand, // Brand of the item
                price: item.Price, // Price of the item
                quantity: 1 // Quantity of the item
            }
        ]
    }
});
// true; end

window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
          currency: "USD", // Ensure this matches the currency of the event
          value: item.Value, // The total value of the items (price * quantity)
          items: [
              {
                  item_id: item.ProductID, // Unique ID for the item
                  item_name: item.Name, // Name of the item
                  item_brand: item.Brand, // Brand of the item
                  price: item.Price, // Price of the item
                  quantity: 1 // Quantity of the item
              }
          ]
      }
  });


