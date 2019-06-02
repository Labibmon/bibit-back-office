import React from 'react';
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import ChangeLog from '../src/container/pages/ChangeLog'
import Home from './container/Home';
import Permission from '../src/container/pages/Permission';
// import QRCode from './container/pages/QrCode';

const MainRouter = () => (
    <Router>
        <Home>
            <Switch>
                <Route exact path="/" component={Permission} />
                <Route path="/changelog" component={ChangeLog} />
                {/* <Route path="/qrcode" component={QRCode} /> */}
            </Switch>
        </Home>
    </Router>
);
export default MainRouter;