import React, { Component } from 'react';
import loading from './loading.svg';
import Auth from '../auth/Auth';
import API from '../../service/index';

const pathAPI = 'member';

class Callback extends Component {
  
  constructor(){
    super();
    this.state = {
      dataColumns: [],
    };
  }


  componentDidMount(){
    this.getData();
  }
  
  getData = () => {
    const auth = new Auth();
    API.getDataApi(pathAPI).then( result => {
      setTimeout(auth.handleAuthentication(result.data),3000);
    })
  }

  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
