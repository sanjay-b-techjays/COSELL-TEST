import './App.css';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createTheme from '@material-ui/core/styles/createTheme';
import Routes from './Routes';

const browserHistory = createBrowserHistory();
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
