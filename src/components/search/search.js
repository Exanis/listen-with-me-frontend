import React from 'react';
import Add from './add.png';
import './search.css';

function Search(props) {
    if (props.results === null) {
        return <h1 className="noresult">Utilisez la barre de recherche pour ajouter une vidéo !</h1>
    }
    if (props.results.length === 0) {
        return <h1 className="noresult">Aucun résultat - modifiez vos mots-clefs ou copiez-collez l'adresse de la vidéo !</h1>
    }
    return <>{
        props.results.map(result => <div className="result" key={result.id}>
            <img src={result.thumbnail} alt={result.title} />
            <div className="subheader">
                {props.canAddSong && <img src={Add} alt="Ajouter à la playlist" onClick={() => props.onAddSong(result.id, result.title)} />}
                <div className="title" dangerouslySetInnerHTML={{__html: result.title}} />
            </div>
        </div>)
    }
    </>
}

export default Search;