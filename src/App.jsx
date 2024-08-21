import { useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import Loading from './components/Loading';
import 'bootstrap-icons/font/bootstrap-icons.css'

import {
  selectUser,
  selectStatus,

  setUser,
} from './features/data/dataSlice'



function App() {
  const dispatch = useDispatch()

  const user = useSelector( selectUser)
  const status = useSelector( selectStatus )

  // all'avvio, e solo all'avvio del componente
  useEffect(() => {
      // viene controllato se esistono già i dati nel local storage
      const tempUser = JSON.parse(localStorage.getItem("user"));
      // in caso esistano viene settato user con i dati presenti nel local storage
      if( tempUser ) dispatch(setUser( tempUser ))

  }, []); // fine use effect

  return (
    <>
          {
            ( status === 'idle' && !user) && <LoginPage />
          }

          {
            ( status === 'idle' && user ) && <HomePage />
          }

          {
            ( status === 'loading' ) && 
            <div style={{paddingTop:400}}>
              <Loading />
            </div>
          }
      
    </>
  )
}

export default App
