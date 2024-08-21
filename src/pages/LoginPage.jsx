import { useDispatch } from 'react-redux';
import {
    login
  } from './../features/data/dataSlice'

import styled from 'styled-components';

// pagina di login fittizia, non permette input ma solo il click del pulsante di login
function LoginPage() {

    const dispatch = useDispatch()    
    // evento click del pulsante di login
    const handleLogin = () => {
        // funzione nel dataSlice - Gestire la valorizzazione dell'utente (fittizzio) e salverà una sessione nel localStorage
        dispatch( login() )
    }

    return (
        <>
        <Content>
            <LoginBox >
        
                    
                    <ImageDiv>
                        <img style={{maxHeight:'100%',maxWidth:'100%'}} src='/mineralia_logo.png' />
                    </ImageDiv>

                    <LabelDiv>
                        Username
                    </LabelDiv>
                    <Input value={'Test'} readOnly={true}>
                    </Input>
                    
                    <LabelDiv>
                        Password
                    </LabelDiv>
                    <Input type={'password'} value={'Password'} readOnly={true}>
                    </Input>

                    <LoginButton onClick={()=> handleLogin() }>
                        Sign In
                    </LoginButton>

                    
           
            </LoginBox>
        </Content>
        
        </>
    )
}

const Content = styled.div`
    background-image:url("/background.webp");
    background-repeat: no-repeat;
    background-size: cover; 
    height: 100vh;
    width: 100vw;
    overflow: auto;
    
`

const LoginBox = styled.div`
    background:white;
    height:500px;
    width:500px;
    text-align:center;
    margin:0 auto;
    margin-top:100px;
    padding:30px;
    background:${ props => props.background ? props.background : 'white'};
    
`

const ImageDiv = styled.div`
    height:200px;
    width:200px;
    margin:0 auto;
`

const Input = styled.input`
    width:100%;
    height:50px;
    padding-left:10px;

`
const LabelDiv = styled.div`
    text-align:left;
    margin-top:10px;
`

const LoginButton = styled.button`
    width:100%;
    margin-top:20px;
  
`

export default LoginPage
