import React from 'react';
import '../css/login.css';
import auth from './auth';
import logoGoogle from '../../images/googlelogo.png';

// import bibitIcon from '../../images/bibit-robo-white.ico';

export const Login = props => {
        return(
            <div>
                <svg className="backgroundLogin" viewBox="0 0 1440 627" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H1440V466C1440 466 1102.5 626.5 717 626.5C331.5 626.5 0 466 0 466V0Z" fill="#00ab6b"/>
                </svg>
                <div className="boxLogin">
                    <center>
                        <div>
                            <h3 className='textBibit'>Bibit Back Office</h3>
                                <button 
                                    className='btnLogin'
                                    onClick={() => { 
                                    auth.login(() => {
                                        props.history.push("/permission");
                                        });
                                    }}
                                >
                                    <img src={logoGoogle} className="googleLogo" alt="" /> Sign in with Google
                                </button>
                        </div>
                    </center>
                </div>
            </div>
        )
}

export default Login;