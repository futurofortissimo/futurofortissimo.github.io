import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

// Bind React.createElement to htm for JSX-like templating without a build step.
export const html = htm.bind(React.createElement);
export { React, ReactDOM };
