import { React, ReactDOM, html } from './runtime.js';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(html`<${React.StrictMode}><${App} /><//>`);
