
import { useDispatch } from 'react-redux';
import {
    login
  } from './../features/data/dataSlice'

import styled from 'styled-components';

function LoginPage() {

    const dispatch = useDispatch()    

    const handleLogin = () => {
        dispatch( login() )
    }

    return (
        <>
        <Content>
            <LoginBox background={'rgb(217,217,217)'} >
        
                    
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
