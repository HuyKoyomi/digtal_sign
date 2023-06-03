// import React from 'react'
// import ReactDOM from 'react-dom/client'

// import r1 from 'react'
// import r2 from 'react-dom/client'
// import c from './App'

// const React = r1;
// const ReactDOM = r2;
// const App = c; 


// window.renderPdfApp = function(props, domRef) {
//     ReactDOM.render(<App {...props}/>, domRef);
//   }


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


window.renderPdfApp = (rootId) => {
  const root = ReactDOM.createRoot(document.getElementById(rootId));
  const signInComponent = {}
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );


  return signInComponent;
}

if (process.env.NODE_ENV !== 'production') {
  console.log("HANT Render Root")
window.renderPdfApp("root")
}