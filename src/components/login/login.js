import React from 'react';
import './login.css';

function Login(props) {
    return <div className="loginForm box">
        <form onSubmit={props.onLogin}>
            <input onChange={props.onLoginChange} value={props.login === null ? '' : props.login} placeholder="Nom d'utilisateur" />

            <input type="submit" value="Entrer dans ma salle" />
        </form>
    </div>;
}

export default Login;