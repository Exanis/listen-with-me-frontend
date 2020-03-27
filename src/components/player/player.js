import React, { useEffect } from 'react';
import './player.css';

function Player(props) {
    useEffect(() => {
        const player = new window.YT.Player(
            'player',
            {
                'height': '464',
                'width': '781',
                'videoId': '',
                'playerVars': {
                    'autoplay': 1,
                    'controls': 0,
                    'disablekb': 1
                },
                'events': {
                    'onReady': () => {
                        props.setPlayer(player);
                    }
                }
            }
        );
    });

    return <div className="player" id="player"></div>;
}

export default Player;