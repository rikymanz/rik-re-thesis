import { useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';

import styled from 'styled-components';

import NavBar from '../components/NavBar';
import DashboardPage from './DashboardPage';
import TablesPage from './TablesPage';

import {
  initData,

  setData,

  selectData,
  selectStatus,
  selectPage,
} from './../features/data/dataSlice'

// Componente padre dell'applicazione
function HomePage() {
  // dispatch per chiamare le funzioni di modifica variabili di stato globali dello slice
  const dispatch = useDispatch()
  // Variabili di stato dell'applicazione
  const data = useSelector( selectData ) // dati, generati casualmente
  const status = useSelector( selectStatus ) // indica se si sta effettuando la generazione dei dati (simulazione di fetch)
  const page = useSelector( selectPage ) // pagina da visualizzare (Dashboard o tabelle), i singoli grafici vengono gestiti direttamente dai componenti figli

  // funzione evento di click del pulsante generazione dati
  const handleInit = () => {
    dispatch( initData() )
  } // fine handleInit

  // all'avvio, e solo all'avvio del componente
  useEffect(() => {
      // viene controllato se esistono già i dati nel local storage
      const tempData = JSON.parse(localStorage.getItem("data"));
      // in caso esistano viene settato data con i dati presenti nel local storage
      if( tempData ) dispatch(setData( tempData ))

  }, []); // fine use effect


  return (
    <>
      <NavBar />
      <ContentDiv>

          {/* Compare solo se i dati non sono stati generati, non devono essere presenti nel local storage */}
          {
            ( status === 'idle' && !data ) &&
            <div style={{textAlign:'center',paddingTop:250}}>
                <button onClick={() => handleInit()}>
                  Genera dati
                </button>
            </div>
            
          }

          {/* 
           Se i dati sono presenti, dopo il click del pulsante o perchè già presenti nel local storage,
           mostra la pagina di dashbosard (default) o quella delle tabelle, in base al pulsante cliccato nel menu a sinistra
           
           */}
          {
            ( status === 'idle' && data ) &&
            <>
              { page === 1 && <DashboardPage />}
              { page === 2 && <TablesPage />}

            </>
          }

   

 
      </ContentDiv>
      

    </>
  )
}

const ContentDiv = styled.div`
  display:inline-block;
  height:100vh;
  width:85%;
  vertical-align:top;
  background:#fafafa;
  overflow:hidden;
`

export default HomePage
