
import PropTypes from 'prop-types';
import styled from "styled-components"
// caricamento dei grafici
import PriceGraph from './graphs/PriceGraph';
import ExtractionsGraph from './graphs/ExtractionsGraph';
import MinesInfo from './graphs/MinesInfo';
import CostsIncomeGraph from './graphs/CostsIncomeGraph';
import WeatherInfo from './graphs/WeatherInfo';
import PLInfo from './graphs/PLInfo';

/* 

Componente che gestisce la visualizzazione del grafico.
In base alla variabile di stato in DashboardPage visualizza il corrispondente grafico.
La funzione per il cambio click e la varibile di stato graph vengono definite in DashboardPage e passate come parametro

*/
function DashboardGraphs({graph,functions}) {


    return (
      <>
        <div style={{paddingTop:35,paddingBottom:15,paddingLeft:30}}>
            { /* Pulsante indietro - imposta graph a 0 - non gestito in questo componente */ }
            <MyTitle onClick={() => functions.handleClick( 0 )}>
                <i className="bi bi-arrow-left"></i> &nbsp;&nbsp;
                Indietro
            </MyTitle>
        </div> 

        {/* In base alla variabile graph verrà visualizzato un componente */}
        <div>
        { graph === 1 && <PriceGraph /> }
        { graph === 2 && <ExtractionsGraph/> }
        { graph === 3 && <MinesInfo/> }
        { graph === 4 && <CostsIncomeGraph/> }
        { graph === 5 && <WeatherInfo/> }
        { graph === 6 && <PLInfo/> }
        </div>
      </>
    )
  }


  const MyTitle = styled.div`
    font-weight:bold;
    font-size:20px;
    &:hover{
        cursor:pointer;
    }
  `

  DashboardGraphs.propTypes = {
      functions: PropTypes.object,
      graph: PropTypes.number
,  };

  export default DashboardGraphs
  