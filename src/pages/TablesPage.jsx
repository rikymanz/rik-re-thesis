import Form from 'react-bootstrap/Form';
import { useState } from 'react';

import styled from 'styled-components';

import Table from './../components/Table';

function TablesPage() {

  const [selectedTable,setSelectedTable] = useState(null)

  const handleTabledChange = (selectInput) =>{
    setSelectedTable( selectInput.value === '-' ? null : selectInput.value )
  }

  return (
    <>
    <div style={{display:'inlin-block',width:300,margin:'0 auto',paddingTop:20}}> 
        <Form.Select size='sm' onChange={(event) => handleTabledChange( event.currentTarget )}>
            <option value="-">-</option>
            <option value="mines">Miniere</option>
            <option value="operations">Operazioni</option>
            <option value="marketPrices">Prezzi</option>
            <option value="weatherData">Dati metereologici</option>
            <option value="resourceManagement">Gestione risorse</option>

        </Form.Select>

        
    </div>
    <TableDiv>
          { !selectedTable  && <NoDataDiv>Selezionare tabella</NoDataDiv>}
          { selectedTable  && <Table table={selectedTable} />}
    </TableDiv>
    </>
  )

}

const TableDiv = styled.div`
  margin:0 auto;
  margin-top:10px;
  width:95%;
  border:1px solid lightgrey;
  height:80%;
  overflow-x:scroll;
`

const NoDataDiv = styled.div`
  text-align:center;
  padding-top:50px;
  font-size:35px;
  color:grey;
`


export default TablesPage
