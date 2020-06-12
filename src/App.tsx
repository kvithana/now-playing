import React from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import { AuthProvider } from './contexts/auth';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { PlayerProvider } from './contexts/player';

// initialise Firebase
firebase.initializeApp(JSON.parse(atob(process.env.REACT_APP_FIREBASE_INIT as string)));

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Route exact={true} path="/login" component={Login} />
          <Route path="/" exact={true} component={Home} />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
