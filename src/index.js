import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './component/auth/Auth';
import * as serviceWorker from './serviceWorker';

const auth = new Auth();

let state = {};
window.setState = (changes) => {
    state = Object.assign({}, state, changes);
    ReactDOM.render(<App {...state} />, document.getElementById('root'));
};


/* eslint no-restricted-globals:0*/
let username = auth.getProfile().name || "user";
let photo = auth.getProfile().picture || "undifined"
let nickname = auth.getProfile().nickname || "undifined"
let emailUser = auth.getProfile().email || "undifined"

let initialState = {
    name: username,
    picture: photo,
    emailName: nickname,
    email: emailUser,
    location: location.pathname.replace(/^\/?|\/$/g,""),
    auth
};

window.setState(initialState);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
