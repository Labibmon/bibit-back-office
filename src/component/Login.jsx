import React, { Component } from 'react';
import './css/login.css';


export default class Login extends Component{
    render(){
        return(
            <div>
            {!this.props.auth.isAuthenticated() &&
            <div>
                <svg className="backgroundLogin" viewBox="0 0 1440 627" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H1440V466C1440 466 1102.5 626.5 717 626.5C331.5 626.5 0 466 0 466V0Z" fill="#333"/>
                    </svg>
                    <div className="boxLogin">
                        <center>
                            <div>
                                <h3 className='textBibit'>Bibit Back Office</h3>
                                    <button 
                                        className='btnLogin'
                                        onClick={this.props.auth.login}
                                        >
                                        Login
                                    </button>
                            </div>
                        </center>
                    </div>
                </div>
                }
            </div>
        )
    }
}