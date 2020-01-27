import React from 'react';
import {MdDeleteForever} from 'react-icons/md'
import './styles.css'
//ja realiza a destruturação das propriedades
function DevItem({dev, onDelete}){

    async function handleDeleteDev(github_username){
      console.log('deletando')
      await onDelete(github_username);
    }

    return (
        <li  className="dev-item">
        <header>
          <img src={dev.avatar_url} alt={dev.name}/>
          <div className="user-info">
            <strong> {dev.name}</strong>
            <span>{dev.techs.join(', ')}</span>
          </div>
        </header>
        <p>{dev.bio}</p>
        <a href={`https://github.com/${dev.github_username}`}>Acessar github</a>
        <div>
        <button onClick = {() => handleDeleteDev(dev.github_username)}>
          Deletar
        </button>

        </div>
      </li>
    );
}


export default DevItem;