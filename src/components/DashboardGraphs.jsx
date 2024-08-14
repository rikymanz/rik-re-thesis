
import PropTypes from 'prop-types';
import styled from "styled-components"
// caricamento dei grafici
import PriceGraph from './graphs/PriceGraph';
import ExtractionsGraph from './graphs/ExtractionsGraph';
import MinesInfo from './graphs/MinesInfo';

function DashboardGraphs({graph,functions}) {

    const handleClick = ( id ) => {
        functions.handleClick( id )
    }

    return (
      <>
        <div style={{padding:50}}>
            <MyTitle onClick={()=>handleClick(0)}>
                <i className="bi bi-arrow-left"></i> &nbsp;&nbsp;
                Indietro
            </MyTitle>
        </div> 

        <div>
        { graph === 1 && <PriceGraph /> }
        { graph === 2 && <ExtractionsGraph/> }
        { graph === 3 && <MinesInfo/> }
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
  