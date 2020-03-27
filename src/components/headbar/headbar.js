import React, { useState } from 'react';
import logo from './logo.png';
import settings from './settings.png';
import './headbar.css';


function HeadBar(props) {
    const [showUsers, setShowUsers] = useState(false);

    return <div className="headbar">
        <img src={logo} alt="" className="logo" onMouseEnter={() => setShowUsers(true)} onMouseLeave={() => setShowUsers(false)} />
        {showUsers && <div className="users">
            <div className="count">
                <strong>{props.users.length}</strong> personne{props.users.length > 1 ? 's' : ''} en ligne
            </div>
            <ul>
                {props.users.map(user => <li key={user}>{user}</li>)}
            </ul>
        </div>}
        <div className="title">{props.title}</div>
        <form onSubmit={props.onSearch}>
            <input placeholder="Recherche" value={props.search} onChange={props.onSearchChange} />
        </form>
        {props.isAdmin && <img src={settings} alt="Settings" className="logo clickable" onClick={props.onSettings} />}
    </div>;
}

export default HeadBar;