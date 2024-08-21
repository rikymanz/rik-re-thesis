import styled from "styled-components";
import { useSelector , useDispatch } from 'react-redux';

// funzioni dello slice, gestioni delle variabili di stato "globali"
import {  
    setData,
    setUser,
    setPage,
    selectPage
  } from './../features/data/dataSlice'
  
/*
    Menu laterale applicazione.
*/
const NavBar = () => {       
    // dichiarazione dispatch per cambiare le varabili di stato dell'applicazione
    const dispatch = useDispatch()
    // variabile di stato per la getione della macro visualizzazione della pagina
    const page = useSelector( selectPage )
    // funzione evento per il click del pulsante per la cancellazione dei dati
    const handleDeleteDataClick = () => {
        // cancellazione dal local storage dei dati generati dall'applicazione
        localStorage.removeItem("data");
        // cancellazione della variabile di stato - viene impstata a null
        dispatch( setData(null))
    } // fine handleDeleteDataClick

    // funzione evento di click pulsante di logout
    const handleLogOutClick = () => {
        // cancellazione utente da local storage
        localStorage.removeItem("user");
        // cancellazione utente variabile di stato
        dispatch( setUser(null))
    } // fine handleLogOutClick
    
    
    // in base ai pulsanti cliccati viene settata la variabile che gestisce la visualizzazione dei grafici o delle tabelle. Oppure la cancellazione delle variabili di stato, che a loro volta gestiscono altre visualizzazioni
    return (
        <MyNavBar>
            <NavElement height={'10%'}>
                <img style={{maxWidth:'90px'}} src={'/mineralia_logo_2.png'} />
            </NavElement>
            <NavElement  height={'60%'}>
                <NavButton selected={page === 1} onClick={() => dispatch(setPage(1))} >
                    Dashboard
                </NavButton>  
                <NavButton selected={page === 2} onClick={() => dispatch(setPage(2))}>
                    Tabelle
                </NavButton> 
            </NavElement>

            <NavElement>
                <NavButton onClick={() => handleDeleteDataClick()} >
                    Elimina dati 
                </NavButton>  
                <NavButton onClick={() => handleLogOutClick()}>
                    Log Out
                </NavButton> 
            </NavElement>
 
        </MyNavBar>
    )
}

const MyNavBar = styled.div`
    width:15%;
    height:100vh;
    background:rgb(217,217,217);
    display:inline-block;
    overflow:hidden;
`

const NavElement = styled.div`
    padding:10px;
    height:${props => props.height};
    text-align:center;

`
const NavButton = styled.button`
    margin-top:15px;
    width:100%;
    border:${ props => props.selected ? '1px solid blue' : 'default'}
`



export default NavBar;
