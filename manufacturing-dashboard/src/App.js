import { React, useState } from 'react';
import DataComponent from './components/DataComponent';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const App = () => {

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataComponent />
    </ThemeProvider>
  );
};

export default App;
