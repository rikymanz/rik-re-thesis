import styled from "styled-components";
import { useSelector , useDispatch } from 'react-redux';

import {  
    setData,
    setUser,
  
    selectData,

  } from './../features/data/dataSlice'
  

const NavBar = () => {       
    
    const dispatch = useDispatch()

    const handleDeleteDataClick = () => {
        localStorage.removeItem("data");
        dispatch( setData(null))
    }

    const handleLogOutClick = () => {
        localStorage.removeItem("user");
        dispatch( setUser(null))
    }
    
    return (
        <MyNavBar>
            <NavElement style={{textAlign:'center'}}>
                <img style={{maxWidth:'90px'}} src={'/mineralia_logo_2.png'} />
            </NavElement>
            <NavElement>
                <NavButton onClick={() => handleDeleteDataClick()}>
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
`

const NavElement = styled.div`
    padding:10px;

`
const NavButton = styled.button`
    margin-top:15px;
    width:100%;
`



export default NavBar;
