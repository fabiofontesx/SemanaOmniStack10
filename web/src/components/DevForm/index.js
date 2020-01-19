import React, {useState, useEffect} from 'react';
import './styles.css';

function DevForm({ onSubmit }){
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [github_username, setGithubUserName] = useState('');
    const [techs, setTechs] = useState('');

    useEffect(() =>{
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
          },
          (error)=>{
            console.log(error);
          },
          {
            timeout: 30000
          }
        );
      }, []) // Serve para disparar uma função toda vez que uma info alterar ou uma unica vez durante a render
          //Se o vetor estiver vazio vai executar apenas uma vez
    
    async function handleSubmit( e ){
        e.preventDefault();
        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude
        });
        setGithubUserName('');
        setTechs('');
    }

    return (
        <form onSubmit={handleSubmit}>
        <div className="input-block">
          <label htmlFor="Longitude">Usuário do Github</label>
          <input 
            name="github_username" 
            id="github_username" 
            required
            value = {github_username}
            onChange = { e => setGithubUserName(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label htmlFor="techs">Tecnologias</label>
          <input 
            name="techs"
            id="techs" 
            required
            value = {techs}
            onChange = { e => setTechs(e.target.value)}
          />
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="latitude">Latitude</label>
            <input 
              type="number" 
              name="latitude" 
              id="latitude" 
              required 
              value={latitude}
              onChange = {e => setLatitude(e.target.value)}/>
          </div>
          <div className="input-block">
            <label htmlFor="Longitude">Longitude</label>
            <input 
              type="number"
              name="Longitude"
              id="Longitude"
              required 
              value={longitude}
              onChange={e => setLongitude(e.target.value)}/>
          </div>
        </div>

        <button type="submit">Salvar</button>
      </form>
    );
}

export default DevForm;