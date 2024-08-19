// In your Shopify admin, go to Online Store > Themes > Actions > Edit Code.
// Add this script to the <head> section of your theme.liquid or directly through Shopify's Script Tag API.

(function() {
  var script = document.createElement('script');
  script.src = 'https://your-cdn-url/custom_events_pixel.js'; // Replace with your actual CDN URL or path
  script.async = true;
  document.head.appendChild(script);
})();
