(function() {
  // Utility function to push events to the dataLayer
  function pushToDataLayer(eventData) {
    if (window.dataLayer) {
      window.dataLayer.push(eventData);
    } else {
      console.error('dataLayer not found');
    }
  }

  // Page View Event (fired on every page)
  document.addEventListener('DOMContentLoaded', function() {
    pushToDataLayer({
      event: 'page_view',
      pageTitle: document.title,
      pageUrl: window.location.href,
      userId: ShopifyAnalytics.meta.page.customerId || null,
      sessionId: ShopifyAnalytics.meta.page.visit_token
    });
  });

  // Product View Event (fires on product pages)
  if (window.ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.product) {
    pushToDataLayer({
      event: 'product_impression',
      productId: ShopifyAnalytics.meta.product.id,
      productName: ShopifyAnalytics.meta.product.title,
      productCategory: ShopifyAnalytics.meta.product.product_type,
      productPrice: ShopifyAnalytics.meta.product.price / 100
    });
  }

  // Add to Cart Event (generic implementation)
  document.body.addEventListener('click', function(event) {
    if (event.target.matches('.add-to-cart-button')) {
      fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
          pushToDataLayer({
            event: 'add_to_cart',
            productId: event.target.dataset.productId,
            quantity: 1, // Customize as needed
            cartValue: cart.total_price / 100
          });
        });
    }
  });

  // Checkout Events (detects when user progresses through checkout steps)
  document.addEventListener('DOMContentLoaded', function() {
    const pagePath = window.location.pathname;

    if (pagePath.includes('/checkout')) {
      pushToDataLayer({
        event: 'begin_checkout',
        cartValue: Shopify.checkout.total_price / 100,
        checkoutStep: 1
      });

      // Listening for shipping info submission
      document.addEventListener('shipping_info_submitted', function(event) {
        pushToDataLayer({
          event: 'shipping_info',
          shippingMethod: event.detail.shippingMethod,
          checkoutStep: 2
        });
      });

      // Listening for payment info submission
      document.addEventListener('payment_info_submitted', function(event) {
        pushToDataLayer({
          event: 'payment_info',
          paymentMethod: event.detail.paymentMethod,
          checkoutStep: 3
        });
      });

      // Listening for order review completion
      document.addEventListener('review_order', function() {
        pushToDataLayer({
          event: 'review_order',
          checkoutStep: 4
        });
      });
    }
  });

  // Purchase Event (fires on the thank you page)
  if (window.location.pathname.includes('/thank_you')) {
    pushToDataLayer({
      event: 'purchase',
      transactionId: Shopify.checkout.order_id,
      orderValue: Shopify.checkout.total_price / 100,
      shippingCost: Shopify.checkout.shipping_price / 100,
      tax: Shopify.checkout.total_tax / 100
    });
  }

  // Refund Event (handle via webhook or other backend trigger)
  document.addEventListener('refund_processed', function(event) {
    pushToDataLayer({
      event: 'refund',
      transactionId: event.detail.transactionId,
      refundValue: event.detail.refundValue
    });
  });
})();
