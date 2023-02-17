import './App.css';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createTheme from '@material-ui/core/styles/createTheme';
import CampaignRoutes from './Routes/CampaignRoute';

const browserHistory = createBrowserHistory();
const theme = createTheme();

function Campaign() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <CampaignRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default Campaign;
