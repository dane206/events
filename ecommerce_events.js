<script id="ecommerce_events">
  (function () {
    // Helper Functions
    const pushEvent = (eventName, ecommerceData) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ecommerce: ecommerceData });
      console.log(`GA4 ${eventName} event pushed:`, { event: eventName, ecommerce: ecommerceData });
    };

    const parsePrice = (priceString) => parseFloat(priceString.replace(",", ""));

    const buildItemObject = (id, name, brand, price, quantity, listName = null) => {
      const item = {
        item_id: id,
        item_name: name,
        item_brand: brand,
        price: price,
        quantity: quantity,
      };
      if (listName) item.item_list_name = listName; // Add optional list name
      return item;
    };

    // View Item Event
    {% if product %}
    (() => {
      const items = [
        buildItemObject(
          "{{ product.id }}",
          "{{ product.title | escape }}",
          "{{ product.vendor | escape }}",
          parsePrice("{{ product.price | money_without_currency }}"),
          1 // Quantity for single product view
        )
      ];

      pushEvent("view_item", {
        currency: "USD", // Replace with dynamic currency if applicable
        value: items[0].price, // Single item's price
        items: items
      });
    })();
    {% endif %}

    // View Item List Event
    {% if collection %}
    (() => {
      const items = [
        {% for product in collection.products %}
        buildItemObject(
          "{{ product.id }}",
          "{{ product.title | escape }}",
          "{{ product.vendor | escape }}",
          parsePrice("{{ product.price | money_without_currency }}"),
          1, // Quantity for collection view
          "{{ collection.title | escape }}" // Collection name
        ){% unless forloop.last %},{% endunless %}
        {% endfor %}
      ];

      pushEvent("view_item_list", {
        currency: "USD", // Replace with dynamic currency if applicable
        items: items
      });
    })();
    {% endif %}

    // Add to Cart Event
    {% if cart %}
    (() => {
      const items = [
        buildItemObject(
          "{{ cart.items[0].variant_id }}",
          "{{ cart.items[0].title | escape }}",
          "{{ cart.items[0].vendor | escape }}",
          parsePrice("{{ cart.items[0].price | money_without_currency }}"),
          {{ cart.items[0].quantity }} // Dynamic quantity from cart
        )
      ];

      pushEvent("add_to_cart", {
        currency: "USD", // Replace with dynamic currency if applicable
        value: (items[0].price * items[0].quantity).toFixed(2), // Total value (price * quantity)
        items: items
      });
    })();
    {% endif %}
  })();
</script>
