import React, { Component } from 'react';
import './App.css';
import Login from './component/Login';
import Callback from './component/callback/Callback';
import NotFound from './component/NotFound';
import RouterComponent from './component/RouterComponent';
import API from './service';

const pathAPI = 'member';

class App extends Component {
  constructor(){
    super();
    this.state={
      member: [],
      email:'',
      user: '',
    }
  }

  componentDidMount() {
    if(this.props.emailName){
      const emaillName = this.props.emailName
      this.setState({
        email: `${emaillName}@gmail.com`
      })
    } else {
      this.setState({
        email : this.props.email 
      })
    }
    this.getData();
  }

  getData = () => {
    API.getDataApi(pathAPI).then( result => {
      this.setState({
        member: result.data,
      }, () => {
        this.getUser();
      });
    })
  }

  getUser = () => {
    const { email, member } = this.state
    const users = member.find(member => member.email === email)
    this.setState({
      user: users
    })
  }

  render() {
    let mainComponent = ""
    switch(this.props.location) {
      case "login":
        mainComponent =  this.props.auth.isAuthenticated() ? <NotFound /> : <Login {...this.props} />;
        break;
      case "callback":
        mainComponent = <Callback />;
        break;
      case "":  
        mainComponent = this.props.auth.isAuthenticated() ? <RouterComponent {...this.props} user={this.state.user} email={this.state.email}/> : <Login {...this.props} />;
        break;
      default:
        mainComponent =  this.props.auth.isAuthenticated() ? <RouterComponent {...this.props} user={this.state.user} email={this.state.email}/> : <NotFound />;
    }

    return (
      <div>
          {mainComponent}
      </div>
    );
  }
}

export default App;
