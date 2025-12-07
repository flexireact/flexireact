/** @type {import('flexireact').Config} */
export default {
  // Styles to include in every page
  styles: [
    '/styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
  ],
  
  // Favicon
  favicon: '/favicon.png',
  
  // Server options
  server: {
    port: 3000
  },
  
  // Islands (partial hydration)
  islands: {
    enabled: true
  }
};
