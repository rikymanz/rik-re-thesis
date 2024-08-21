import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectData } from './../features/data/dataSlice'

import styled from 'styled-components';

// Componente di visualizzazioine di una singola tabella, visualizza semplicemente la tabella passata come parametro
function Table({table}) {
    // tutti i dati generati dall'applicazione
    const data = useSelector( selectData )
    // solo i dati che interessa visualizzare
    const tableData = data[table]
    let titles = []
    // array con i soli titoli
    for (const [key] of Object.entries( tableData[0] )) {
        titles.push( key )
    } // fine for


    return (
        <>
            <MyTableDiv>
                <MyTitlesDiv>
                    {
                        titles.map( ( title,index ) => (
                            <MyTitleCol key={index}>
                                {title}
                            </MyTitleCol>
                        ) )
                    }
                </MyTitlesDiv>

                <MyTableContent>
                    {   
                        tableData.map( ( row,indexRow ) => (
                            <MyValueRow key={indexRow}>
                                {
                                    titles.map( ( title,indexCol ) => (
                                        <MyValueCol key={`${indexRow}_${indexCol}`}>
                                            {row[title]}
                                        </MyValueCol>
                                    ) )
                                }
                            </MyValueRow>
                        ) )
                    }
                </MyTableContent>

            </MyTableDiv>
        </>
    )

}

Table.propTypes = {
    table: PropTypes.string
};

const MyTableDiv = styled.div`
    height:100%;
`
const MyTitlesDiv = styled.div`
    height:5%;
    background:grey;
    color:white;
`

const MyTitleCol = styled.div`
    display:inline-block;
    width:14%;
    padding:2px 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
`

const MyTableContent = styled.div`
    height:95%;
    overflow-y:scroll;
`

const MyValueRow = styled.div`
    border-bottom:1px solid lightgrey;
`

const MyValueCol = styled.div`
    display:inline-block;
    width:14%;
    padding:2px 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
`

export default Table
