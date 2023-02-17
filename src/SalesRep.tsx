/* eslint-disable linebreak-style */
import './App.css';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import SalesHubRoutes from './Routes/SalesHubRoutes';

const browserHistory = createBrowserHistory();
const theme = createTheme();

function SalesRep() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <SalesHubRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default SalesRep;
