import React from 'react';
import ReactDOM from 'react-dom';
import { MantineProvider } from '@mantine/core';
import Toolbox from './components/Toolbox';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Toolbox />
  </MantineProvider>
);
