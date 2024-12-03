<script id="ecommerce_events">
  (function () {
    // Helper Functions
    const getCategoryFromPath = () => {
      const pathParts = window.location.pathname.split('/').filter(Boolean); // Split and remove empty parts
      return pathParts[1] || "Uncategorized"; // Assume second segment is the category, fallback to "Uncategorized"
    };

    const pushEvent = (eventName, ecommerceData) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ecommerce: ecommerceData });
      console.log(`GA4 ${eventName} event pushed:`, { event: eventName, ecommerce: ecommerceData });
    };

    const parsePrice = (priceString) => parseFloat(priceString.replace(",", ""));

    const buildGA4ItemObject = ({
      id,
      name,
      brand,
      category,
      category2 = null,
      category3 = null,
      category4 = null,
      category5 = null,
      listId = null,
      listName = null,
      variant = null,
      locationId = null,
      price,
      quantity,
      affiliation = null,
      coupon = null,
      discount = 0,
      index = null
    }) => ({
      item_id: id,
      item_name: name,
      item_brand: brand,
      item_category: category,
      ...(category2 && { item_category2: category2 }),
      ...(category3 && { item_category3: category3 }),
      ...(category4 && { item_category4: category4 }),
      ...(category5 && { item_category5: category5 }),
      ...(listId && { item_list_id: listId }),
      ...(listName && { item_list_name: listName }),
      ...(variant && { item_variant: variant }),
      ...(locationId && { location_id: locationId }),
      price: price,
      quantity: quantity,
      ...(affiliation && { affiliation: affiliation }),
      ...(coupon && { coupon: coupon }),
      discount: discount,
      ...(index !== null && { index: index })
    });

    // View Item Event
    {% if product %}
    (() => {
      const category = getCategoryFromPath();

      const items = [
        buildGA4ItemObject({
          id: "{{ product.id }}",
          name: "{{ product.title | escape }}",
          brand: "{{ product.vendor | escape }}",
          category: category,
          price: parsePrice("{{ product.price | money_without_currency }}"),
          quantity: 1,
          variant: "{{ product.variants.first.title | escape }}"
        })
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
      const category = getCategoryFromPath();

      const items = [
        {% for product in collection.products %}
        buildGA4ItemObject({
          id: "{{ product.id }}",
          name: "{{ product.title | escape }}",
          brand: "{{ product.vendor | escape }}",
          category: category,
          price: parsePrice("{{ product.price | money_without_currency }}"),
          quantity: 1,
          variant: "{{ product.variants.first.title | escape }}",
          listName: "{{ collection.title | escape }}",
          listId: "{{ collection.id }}"
        }){% unless forloop.last %},{% endunless %}
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
      const category = getCategoryFromPath();

      const items = [
        {% for item in cart.items %}
        buildGA4ItemObject({
          id: "{{ item.variant_id }}",
          name: "{{ item.title | escape }}",
          brand: "{{ item.vendor | escape }}",
          category: category,
          price: parsePrice("{{ item.price | money_without_currency }}"),
          quantity: {{ item.quantity }},
          variant: "{{ item.variant_title | escape }}"
        }){% unless forloop.last %},{% endunless %}
        {% endfor %}
      ];

      pushEvent("add_to_cart", {
        currency: "USD", // Replace with dynamic currency if applicable
        value: items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2), // Total value
        items: items
      });
    })();
    {% endif %}
  })();
</script>
