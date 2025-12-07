import { renderToString } from 'react-dom/server';
import React from 'react';

/**
 * Renders a React component to a full HTML page
 * @param {React.Component} Component - The React component to render
 * @param {Object} props - Props to pass to the component
 * @param {Object} options - Rendering options
 * @returns {string} Complete HTML string
 */
export function render(Component, props = {}, options = {}) {
  const {
    title = 'FlexiReact App',
    scripts = [],
    styles = []
  } = options;

  // Render the component to string
  const content = renderToString(React.createElement(Component, props));

  // Build the HTML document
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${styles.map(href => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n  ')}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
    }
  </style>
</head>
<body>
  <div id="root">${content}</div>
  <script>
    // FlexiReact client-side runtime
    window.__FLEXIREACT_PROPS__ = ${JSON.stringify(props)};
  </script>
  ${scripts.map(src => `<script src="${escapeHtml(src)}"></script>`).join('\n  ')}
</body>
</html>`;

  return html;
}

/**
 * Renders an error page
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {string} HTML error page
 */
export function renderError(statusCode, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${statusCode} - FlexiReact</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .error-container {
      text-align: center;
      padding: 2rem;
    }
    .error-code {
      font-size: 6rem;
      font-weight: bold;
      opacity: 0.8;
    }
    .error-message {
      font-size: 1.5rem;
      margin-top: 1rem;
      opacity: 0.9;
    }
    .back-link {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background 0.3s;
    }
    .back-link:hover {
      background: rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-code">${statusCode}</div>
    <div class="error-message">${escapeHtml(message)}</div>
    <a href="/" class="back-link">← Back to Home</a>
  </div>
</body>
</html>`;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(str) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(str).replace(/[&<>"']/g, char => htmlEntities[char]);
}
