/* eslint no-restricted-globals:0*/

// import history from '../../history';
import { Component } from 'react';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import jwtDecode from 'jwt-decode';
import API from '../../service/index';

const LOGIN_SUCCESS_PAGE = "/";
const LOGIN_FAILUR_PAGE = "/login";
const pathAPI = 'member';


export default class Auth extends Component {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: "https://labibmon.auth0.com/userinfo",
    responseType: 'token id_token',
    scope: 'openid profile',
    primaryColor: "blue"
  });

  constructor() {
    super();
    this.state = {
      dataColumns: [],
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    API.getDataApi(pathAPI).then( result => {
      this.setState({
        dataColumns: result.data,
      });
    })
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication(members) {
    this.auth0.parseHash((err, authResult) => {
      this.idToken = authResult.idToken;
      let nickname = jwtDecode(authResult.idToken).nickname;
      const email = `${nickname}@gmail.com`;
      const validLogin = members.find(member => member.email === email)
      if(validLogin){
        if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult, members);
          } else if (err) {
          // history.replace('/home');
          location.pathname = LOGIN_FAILUR_PAGE;
          // alert(`Error: ${err.error}. Check the console for further details.`);
          console.log(err);
          }
        }
        else{
          this.logout();
        }
    });
  }

  // getMember = () => {
  //   API.getDataApi(pathAPI).then( result => {
  //      return result;
  //   })
  // }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult, members) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    let member = JSON.stringify(members)
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;


    // Set isLoggedIn flag in localStorage
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expiress_at', expiresAt);
    // localStorage.setItem('members', member);

    //hash
    location.hash = "";

    // navigate to the home route
    // history.replace('/secret');

    // pathname
    location.pathname = LOGIN_SUCCESS_PAGE;
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
        //  alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expiress_at');

    location.pathname = LOGIN_FAILUR_PAGE;

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    // history.replace('/home');
  }

  getProfile() {
    if(localStorage.getItem('id_token')){
      return jwtDecode(localStorage.getItem('id_token'));
    } else {
      return {};
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    // let expiresAt = this.expiresAt;
    let expiresAt = JSON.parse(localStorage.getItem("expiress_at"))
    return new Date().getTime() < expiresAt;
  }
}
