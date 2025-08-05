import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';

const GlobalStyled = createGlobalStyle`
:root {
  --yellow-color: #F0D801;
  --cor-primaria: #F04A00;
  --red-color: #C70101;
  --pink-color: #ED0562;
  --light-pink-color: #EF949F;
  --purple-color: #CD8DF0;
  --light-blue-color: #A6D8EF;
  --dark-blue-color: #014166;
}

@font-face {
  font-family: 'FontePadrao';
  src: url('GoldmanSansCd_Bd.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

body,html {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}

code {
  font-family: Goldman Sans;
}

li {
  list-style: none;
}
`
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyled />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
