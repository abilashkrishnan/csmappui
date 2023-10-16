import { GlobalStyles } from '@bigcommerce/big-design';
import { theme } from '@bigcommerce/big-design-theme';
import React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { App } from './App';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const AppGlobalStyles = createGlobalStyle`
  body {
    height: 100%;
    // max-width: 1080px;
    margin: 4rem;
    background-color: ${({ theme }) => theme.colors.secondary10};
    min-height:100vh
  }
`;

render(
  <ThemeProvider theme={theme}>
    <>
      <AppGlobalStyles />
      <GlobalStyles />
      <App />
    </>
  </ThemeProvider>,
  document.getElementById('root'),
);
