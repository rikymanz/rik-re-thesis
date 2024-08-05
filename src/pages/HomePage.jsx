import { useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';

import styled from 'styled-components';

import Loading from './../components/Loading';
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


function HomePage() {

  const dispatch = useDispatch()
  const data = useSelector( selectData )
  const status = useSelector( selectStatus )
  const page = useSelector( selectPage )

  const handleInit = () => {
    dispatch( initData() )
  }

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


          {
            ( status === 'idle' && !data ) &&
            <div style={{textAlign:'center',paddingTop:250}}>
                <button onClick={() => handleInit()}>
                  Genera dati
                </button>
            </div>
            
          }

          {
            ( status === 'idle' && data ) &&
            <>
              { page === 1 && <DashboardPage />}
              { page === 2 && <TablesPage />}

            </>
          }

          {
            ( status === 'loading' ) &&
            <Loading />
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
`

export default HomePage
