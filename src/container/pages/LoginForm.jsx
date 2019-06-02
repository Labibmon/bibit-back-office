import React from 'react';
import auth from './auth';
import logoGoogle from '../../images/googlelogo.png';

export const LoginForm = props => {
    return(
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
    )
}