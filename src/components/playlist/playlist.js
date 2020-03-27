import React from 'react';
import Share from './share.png';
import Remove from './remove.png';
import Vote from './vote.png';
import Play from './play.png';
import Stop from './stop.png';
import Next from './next.png';
import './playlist.css';

function Playlist(props) {
    const [displayLink, setDisplayLink] = React.useState(false);
    const url = `${window.location.protocol}//${window.location.host}/${props.roomKey}`

    return <div className="playlist">
        <div className="header">
            <div className="title">Playlist</div>
            {props.isAdmin && props.playing && <img src={Stop} alt="Arrêter" onClick={props.stop} />}
            {props.isAdmin && props.playing && <img src={Next} alt="Passer" onClick={props.next} />}
            {props.isAdmin && !props.playing && <img src={Play} alt="Jouer" onClick={props.start} />}
            <img src={Share} alt="Partager la playlist" onClick={() => setDisplayLink(!displayLink)} />
        </div>

        { displayLink && <div className="share-link">
            <div>
                Partager
            </div>
            <input value={url} readOnly />
        </div>}

        <ul className="songs">
            {props.songs.map(song => <li key={song.id}>
                {props.isAdmin && <img src={Remove} onClick={() => props.onDeleteSong(song.id)} alt="Remove song" />}
                <div className="title" dangerouslySetInnerHTML={{__html: song.title}} />
                {props.allowDownVote && <div className={song.downed ? 'downvote vote downed' : 'downvote vote'}>{song.downvotes} <img src={Vote} alt="Votes négatifs" onClick={() => props.onDownVote(song.id)} /></div>}
                <div className={song.voted ? 'upvote vote voted' : 'upvote vote'}>{song.upvotes} <img src={Vote} alt="Votes positifs" onClick={() => props.onUpVote(song.id)} /></div>
                <div className="added_by">Ajouté par {song.by}</div>
            </li>)}
        </ul>
    </div>
}

export default Playlist;