import React from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import FreeScrollBar from 'react-free-scrollbar';
import Sidebar from './container/sidebar/Sidebar';
import Header  from "./container/header/Header";
import ChangeLog from './pages/change-log/ChangeLog';
import Investor from './pages/investor/Investor';
import Member from './pages/permission/Permission';
import Role from "./pages/permission/role/Role";
import AcivityRole from './pages/permission/activity/Activity';
import Verification from './pages/investor/Verification';
// import {routes} from './core/Routes';


function RouterComponent(props) {
  const routes = [
    {
      path: "/",
      exact: true,
      main: () => <ChangeLog {...props} />
    },
    {
      path: "/investor",
      exact: true,
      main: () => <Investor {...props} />
    },
    {
      path: "/investor/user",
      main: () => <Verification {...props} />
    },
    {
      path: "/member",
      main: () => <Member {...props} />
    },
    {
      path: "/role",
      main: () => <Role {...props} />
    },
    {
      path: "/activity",
      main: () => <AcivityRole {...props} />
    }
  ];
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Header 
          name={props.name}
          picture={props.picture}
          emailName = {props.emailName}
          email = {props.email} 
          auth={props.auth}
          user={props}/>
        <Sidebar routes={routes} />
        <div style={{
          marginTop: "4%", 
          marginLeft: "-3%",
          width: "100%",
          backgroundColor: "#f2f2f2"
          }}>
            <FreeScrollBar autohide={true}>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.main}
                />
              ))}
            </FreeScrollBar>
        </div>
      </div>
    </Router>
  );
}

export default RouterComponent;