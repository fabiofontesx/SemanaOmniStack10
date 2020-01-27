import React, { useState, useEffect} from 'react';
/** ANOTAÇÕES VALIDAS E LEMBRETES
 * 
 * function App() {
  //toda função de um componente deve ser escrita dentro da propria função do componente
  //Nao monitora as variaveis, precisamos usar os estados

  //Desestrutura o retorno do useState
  //retorna a variavel e a função que altera essa variavel
  const [counter, setCounter] = useState(0);
  return (
    //Nao pode ter mais de um componente sem um container
    //Pode usar o fragment
    <> 
      <h1>Contador: { counter }</h1>
      <button onClick={ () => setCounter(counter+1) }>Incrementar</button>
    </>
  );
}
 * 
 */
// Três conceitos principais:
// Componente: Bloco isolado de HTML, CSS e JS, o qual nao interfere no restante da aplicação
// Propriedade:  Informações que um componente Pai passa para o componente filho
// Estado: Informações mantidas paleo componente (Lembrar de imutabilidade)



import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import api from './services/api';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App(){
  const [devs, setDevs] = useState([]);
  const [formFunction, setFormFunction] = useState({});

 
  useEffect(()=>{
    loadDevs();
  }, []);
  
  async function loadDevs(){
    const response = await api.get('/devs');
    setDevs(response.data);
  }
  async function handleAddDev( data ){

    const response = await api.post('/devs', data);

    
    setDevs([...devs, response.data]) //imutabilidade (criar um array do zero)
  }
    
  async function handleDeleteDev( github_username ){
    console.log('Handle with delete')
    const responseDelete = await api.delete(`/devs/${github_username}`);
    if(responseDelete.data.ok === true){
      alert('Dev removido com sucesso!');

      await loadDevs();
      return;
    }
    alert('Erro ao remover o dev');
  }

    return(
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        {/**Um componente pai pode enviar uma função para um componente filho */}
        <DevForm onSubmit={handleAddDev}/>
      </aside>

      <main>
        <ul>
           {/*NAO COLOCAR CHAVES NA FUNÇÃO DO MAP E SIM PARENTESE*/}
           {devs.map(dev => ( <DevItem  onDelete = {handleDeleteDev} key={ dev._id } dev={ dev } />)) }
        </ul>
      </main>
    </div>
  );
}

export default App;
