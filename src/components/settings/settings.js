import React from 'react';
import Logo from '../headbar/settings.png';
import './settings.css';

function Settings(props) {
    return <div className="settings">
        <form onSubmit={props.onSubmit}>
            <div className="title">
                <img src={Logo} alt="" />
                <div>
                    Paramètres de la playlist
                </div>
            </div>

            <div className="field no-border">
                <div className="label">Nom de la salle</div>
                <input value={props.roomName} onChange={props.onRoomNameChange} />
            </div>

            <div className="field">
                <div className="label">Ordre de lecture</div>
                <select value={props.roomType} onChange={props.onRoomTypeChange}>
                    <option value="simple">Classique</option>
                    <option value="random">Aléatoire</option>
                    <option value="fav">Votes</option>
                </select>
            </div>

            <div className="field checkbox">
                <input checked={props.allowDownVote} type="checkbox" onChange={props.onAllowDownVoteChange} />
                <div className="label">Autoriser les votes négatifs</div>
            </div>

            <div className="field">
                <div className="label">Nombre de votes avant suppression</div>
                <input type="number" step="1" value={props.removeThreshold} onChange={props.onRemoveThresholdChange} />
            </div>

            <div className="rowBottom">
                <input type="submit" value="Valider" />
                <input type="submit" value="Annuler" onClick={props.onClose} />
            </div>
        </form>
    </div>
}

export default Settings