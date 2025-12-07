import React from 'react';
import { renderToString } from 'react-dom/server';

// Simple test component
function TestComponent(props) {
  return React.createElement('div', null, 
    React.createElement('h1', null, 'Hello'),
    React.createElement('p', null, 'Test')
  );
}

// Test rendering
try {
  const element = React.createElement(TestComponent, {});
  const html = renderToString(element);
  console.log('Success:', html);
} catch (error) {
  console.error('Error:', error.message);
}
