import React, { useContext } from 'react';
import qs from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { getLoginRedirect, authoriseUserCode } from '../../api';
import { AuthContext } from '../../contexts/auth';

let actionRunning = false;

const Login = (): JSX.Element | null => {
  const location = useLocation();
  const history = useHistory();
  const query = qs.parse(location.search);
  const { checkLoginStatus } = useContext(AuthContext);
  if (!query.code && !actionRunning) {
    actionRunning = true;
    localStorage.removeItem('userStatus');
    console.log(query);
    getLoginRedirect().then((url) => window.location.replace(url));
  }
  if (query.code && !actionRunning) {
    actionRunning = true;
    console.log('reached.');
    authoriseUserCode(query.code as string)
      .then((res) => {
        const data: LoginStatus = {
          accessToken: res.access_token,
          authCode: query.code as string,
          accessTokenRefreshedAt: new Date().toISOString(),
          refreshToken: res.refresh_token,
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem('userStatus', JSON.stringify(data));
        checkLoginStatus();
        history.push('/');
      })
      .catch(() => history.push('/login'));
  }
  return <div>Logging in...</div>;
};

export default Login;
