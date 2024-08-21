
import PropTypes from 'prop-types';
import styled from "styled-components"


function DashboardMenu({ functions }) {

    const handleClick = ( id ) => {
        functions.handleClick( id )
    }

    return (
      <>
        <div style={{padding:50}}>
          <MenuButton onClick={ () => handleClick(1) }>
              <MyTitle>Storico prezzi</MyTitle>
              <MyDesc>Andamento dei prezzi di Iridio, Platino, Oro, Argento</MyDesc>
          </MenuButton>

          <MenuButton onClick={ () => handleClick(2) }>
              <MyTitle>Storico estrazioni</MyTitle>
              <MyDesc>Estrazione dei vari minerali nel tempo</MyDesc>
          </MenuButton>

          <MenuButton onClick={ () => handleClick(3) }>
              <MyTitle>Info miniere</MyTitle>
              <MyDesc>Informazioni dettagliate sulle singole miniere</MyDesc>
          </MenuButton>

          <MenuButton onClick={ () => handleClick(4) }>
              <MyTitle>Costi e ricavi</MyTitle>
              <MyDesc>Grafico costi e ricavi negli anni</MyDesc>
          </MenuButton>

          <MenuButton onClick={ () => handleClick(5) }>
              <MyTitle>Impatto ambientale</MyTitle>
              <MyDesc>Informazioni su temperature e precipitazioni nei mesi dell{"'"}anno</MyDesc>
          </MenuButton>

          <MenuButton onClick={ () => handleClick(6) }>
              <MyTitle>Dettaglio costi e ricavi</MyTitle>
              <MyDesc>
                Analisi mensile costi e ricavi e confronto con l{"'"} anno precedente
              </MyDesc>
          </MenuButton>
  
        </div> 
      </>
    )
  }

  const MenuButton = styled.div`
    display:inline-block;
    border:1px solid lightgrey;
    width:20%;
    height:150px;
    padding:20px;
    margin:5px;
    vertical-align:top;

    &:hover{
      border:1px solid black;
      cursor:pointer;
    }
  `
  const MyTitle = styled.div`
    font-weight:bold;
  `

  const MyDesc = styled.div`
    font-size:10px;
  `

  DashboardMenu.propTypes = {
    functions: PropTypes.object
  };

  export default DashboardMenu
  