import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './styles/App.sass';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faPlus, faXmark, faMagnifyingGlass, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'


function App() {

  const [data, setData] = useState(null);
  const [errores, setError] = useState("");
  const [btnDisable, setBtnDisable] = useState(true)
  const [searchPokemon, setSearchPokemon] = useState("");
  const [namepokemon, setNamepokemon] = useState("");
  const [editPokemon, setEditPokemon] = useState("");
  const [urlimg, setUrlimg] = useState("");
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [stateAxios, setStateAxios] = useState("");

  function setBtnPlus(state) {
    setBtnDisable(false)
    window.scrollTo(0, document.body.scrollHeight);
    setStateAxios(state)
  }

  function resetDataPokemon() {
    setNamepokemon("")
    setUrlimg("")
    setAttack(0)
    setDefense(0)
  }

  function getPokemons() {
    axios
      .get("https://bp-pokemons.herokuapp.com/?idAuthor=1")
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {setError(error.message); console.log(errores)})
  }

  function createPokemon(event) {
    event.preventDefault()

    const payload = {
      name: namepokemon,
      image: urlimg,
      attack: attack,
      defense: defense,
      hp:1000,
      type: "n/a",
      idAuthor: 1
    }

    axios.post("https://bp-pokemons.herokuapp.com/?idAuthor=1", payload)
      .then((response) => {
        console.log(response)
        setData(...data, response.data)
      })
      .catch((error) => setError(error.message))
  }

  function detelePokemon(idPokemon) {
    axios.delete(`https://bp-pokemons.herokuapp.com/${idPokemon}`)
    .then(res => {console.log('Delete pokemon: ' + idPokemon); getPokemons() })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }

  function updatePokemon(event) {
    event.preventDefault()

    const payload = {
      name: namepokemon,
      image: urlimg,
      attack: attack,
      defense: defense,
      hp:1000,
      type: "n/a",
      idAuthor: 1
    }

    axios.put(`https://bp-pokemons.herokuapp.com/${editPokemon.id}`, payload)
    .then((res) => {console.log('Update pokemon: ' + editPokemon.id); window.scrollTo(0, 1000); getPokemons();})
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  function consultarPokemonByID(idPokemon) {
    axios.get(`https://bp-pokemons.herokuapp.com/${idPokemon}`)
      .then((response) => {
        setEditPokemon(response.data)
      })
      .catch((error) => {setError(error.message); console.log(errores)})

    setTimeout(() => {
      setNamepokemon(editPokemon.name)
      setUrlimg(editPokemon.image)
      setAttack(editPokemon.attack)
      setDefense(editPokemon.defense)
      setBtnPlus("Update");
    }, 500);

    
  }

  useEffect(() => {
    getPokemons()
  }, []);

  return (
    <div className="wp">
      <header className="wp-search">
        <h4>
          Listado de Pokemon
        </h4>
        <div className='between'>
          <div className='search'>
            <FontAwesomeIcon icon={faMagnifyingGlass} id="search" />
            <input type="search" placeholder="Buscar" onChange={e => setSearchPokemon(e.target.value)} value={searchPokemon}/>
          </div>
          <button className='btn' onClick={() => setBtnPlus("Crear")}><FontAwesomeIcon icon={faPlus} />Nuevo</button>
        </div>
      </header>

      <div className='wp-list'>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Ataque</th>
              <th>Defensa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            { data != null ?
                data.map((item, index) => 
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td><img src={item.image} alt="img" className='image-pokemon' /></td>
                    <td>{item.attack}</td>
                    <td>{item.defense}</td>
                    <td>
                      <div className='center-icons'>
                        <FontAwesomeIcon icon={faPen} className="purple" onClick={() => consultarPokemonByID(item.id)}/>
                        <FontAwesomeIcon icon={faTrash} className="purple" onClick={() => detelePokemon(item.id)}/>
                      </div>
                    </td>
                  </tr>) 
                :<tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr> 
              }
          </tbody>
        </table>
      </div>

      <div className='wp-addpokemons'>
        <h4>Nuevo Pokemon</h4>
        <form onSubmit={stateAxios === "Crear" ? () => createPokemon() : (e) => updatePokemon(e)}>
          <div className='inputs-top'>
            <div className='input-group'>
              <label htmlFor="name">Nombre: </label>
              <input type="text" placeholder="pikachu" name='name' id='name' onChange={(e) => setNamepokemon(e.target.value)} value={namepokemon || ''}/>
            </div>
            <div className='input-group right'>
              <label htmlFor="ataque">Ataque: </label>
              <span>{attack}</span>
              <input type="range" min="0" max="100" name='ataque' id='ataque' onChange={(e) => {setAttack(e.target.value)}} value={attack || 0}/>
              <span>100</span>
            </div>
          </div>
          <div className='inputs-bottom'>
            <div className='input-group'>
              <label htmlFor="imagen">Imagen: </label>
              <input type="text" placeholder="url" name='imagen' id='imagen' onChange={(e) => setUrlimg(e.target.value)} value={urlimg || ''}/>
            </div>
            <div className='input-group right'>
              <label htmlFor="defensa">Defensa: </label>
              <span>{defense}</span>
              <input type="range" min="0" max="100" name='defensa' id='defensa' onChange={(e) => {setDefense(e.target.value)}} value={defense || 0}/>
              <span>100</span>
            </div>
          </div>
          <div className='inputs-btn'>
            <button className={`btn btn-save ${btnDisable ? 'opacy' : ''}`} type="submit" disabled={btnDisable}> <FontAwesomeIcon icon={faFloppyDisk}/> Guardar</button>
            <button className='btn btn-reset' type="reset" onClick={() => resetDataPokemon()}> <FontAwesomeIcon icon={faXmark}/> Cancelar </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
