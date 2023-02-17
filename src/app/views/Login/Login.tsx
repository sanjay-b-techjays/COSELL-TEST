/* eslint-disable import/extensions */
import { makeStyles } from '@material-ui/styles';
import { LoginLabels } from 'src/strings';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { loginAction } from './LoginSlice';
import { loginPayload } from './types';

const useStyles = makeStyles(() => ({
  flexBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    height: '100vh',
  },
  container: {
    margin: 'auto',
    width: '100%',
    padding: '0px 20%',
    color: '#02273c',
  },
  field: {
    marginBottom: '15px',
    width: '100%',
  },
  fieldAlignment: {
    display: 'flex !important',
    alignItems: 'stretch',
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogin = (values: loginPayload) => {
    console.log(values);
    dispatch(loginAction(values));
    history.push('/dashboard');
  };

  return (
    <div className={classes.flexBackground}>
      <div className={classes.container}>
        <h2>{LoginLabels.signInlabel}</h2>
        <LoginForm
          onSubmit={({ email, password, rememberMe }) => {
            console.log(email, password, rememberMe);
            const values = { email, password };
            handleLogin(values);
          }}
        />
      </div>
    </div>
  );
};

export default Login;
