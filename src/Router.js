import React from 'react';
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import ChangeLog from '../src/container/pages/ChangeLog'
import Home from './container/Home';
import Permission from '../src/container/pages/Permission';
import { ProtectedRoute }from './container/pages/Protected';
import Login from './container/pages/Login';
// import QRCode from './container/pages/QrCode';

const MainRouter = () => (
    <Router>
        <Home>
            <Switch>
                <ProtectedRoute exact path="/permission" component={Permission} />
                <ProtectedRoute path="/changelog" component={ChangeLog} />
                <Route path="/" component={Login} />
                {/* <Route path="/qrcode" component={QRCode} /> */}
            </Switch>
        </Home>
    </Router>
);
export default MainRouter;