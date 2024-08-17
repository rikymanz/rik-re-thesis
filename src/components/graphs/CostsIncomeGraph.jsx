import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
//import styled from 'styled-components'

import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import { selectData } from '../../features/data/dataSlice'

function CostsIncomeGraph() {

    const data = useSelector( selectData )
    // variabile per la selezione del mese e dell'anno da analizzare
    const [selection,setSelection] = useState( 2023 )
    const [status,setStatus] = useState('loading')
    const [graphData, setGraphData] = useState(null)

    // funzione che restituisce la riga vuota dell'array data che verrà utilizzato per il grafico. Viene fatto qui visto che verrà usata in diversi for 
    const getEmptyRow = ( yearMonth ) => {
        return {
            yearMonth,
            operation_cost: 0,
            extracted_value: 0,
            energy_consumption: 0,
            water_usage: 0,
            waste_generated: 0,
            total_cost:0
        }
    }

    const chartSetting = {
        yAxis: [
          {
            label: '(€)',
          },
        ],
        //width: 500,
        height: 500,
        sx: {
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        },
      };

    const handleChangeYear = ( coeff ) => {
        let newYear = selection + coeff
        if( newYear < 2001) newYear = 2001
        if( newYear > 2023 ) newYear = 2023

        setSelection( newYear )
    }
    // funzione per il settaggio dei dati utilizzati dal grafico - Verrà lanciata al caricamento del componente e quando cambiarà la variabile di stato selection
    const initData = async() => {
        setStatus( 'loading' )
        let tempData = []
        for (let index = 0; index < data.operations.length; index++) {
            const operation = data.operations[index]
            const yearMonth = operation.date.slice(0,7)
            const year = new Date(operation.date).getFullYear()
            if( year != selection ) continue

            if( !tempData.find( row => row.yearMonth === yearMonth ) ) tempData.push(getEmptyRow( yearMonth )) 
            const tempRow = tempData.find( row => row.yearMonth === yearMonth)

            const mineral = data.mines.find( row => row.id === operation.mine_id ).type_of_mineral
            const value = data.marketPrices.find( row => row.date === operation.date )[mineral]

            tempRow.operation_cost += operation.operation_cost
            tempRow.total_cost += operation.operation_cost
            tempRow.extracted_value += operation.extracted_quantity * value
            
        } // fine for operations e settaggio info riguardanti le operazioni di estrazione

        // for di resourceManagement - dati relativi alle spese e alle risorse utilizzate
        for (let index = 0; index < data.resourceManagement.length; index++) {
            const resourcesRow = data.resourceManagement[index];
            const year = new Date( resourcesRow.date ).getFullYear()
            const yearMonth = resourcesRow.date.slice(0,7)

            if( year != selection ) continue
            if( !tempData.find( row => row.yearMonth === yearMonth ) ) tempData.push(getEmptyRow( yearMonth )) 
            const tempRow = tempData.find( row => row.yearMonth === yearMonth)

            tempRow.water_usage += resourcesRow.water_usage
            tempRow.total_cost += resourcesRow.water_usage

            tempRow.energy_consumption += resourcesRow.energy_consumption
            tempRow.total_cost += resourcesRow.energy_consumption

            tempRow.waste_generated += resourcesRow.waste_generated
            tempRow.total_cost += resourcesRow.waste_generated

        } // fine for
        // ordinamento per anno
        tempData.sort((a,b) => a.yearMonth - b.yearMonth);

        setGraphData( tempData )

        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 1000));
        // variabile di stato che permetta la visualizzazione del grafico
        setStatus('idle')
    } // fine initData

    useEffect(() => {

        initData()

 }, [ selection ]); // fine useEffect



    return (
        <>
            { status === 'loading' && <div> Loading ... </div>}
            { (status === 'idle' && graphData ) && 
                <div>
                    <div style={{textAlign:'center',fontSize:20}}>
                        <span style={{cursor:'pointer'}} onClick={()=> handleChangeYear( -1 )}>
                            <i className="bi bi-arrow-left-circle"></i>
                        </span>
                        
                        <span> {selection} </span>

                        <span style={{cursor:'pointer'}}  onClick={()=> handleChangeYear( 1 )}>
                            <i className="bi bi-arrow-right-circle"></i>
                        </span>
                        
                    </div>
                    <div>
                        <BarChart
                            style={{padding:50}}
                            dataset={graphData}
                            xAxis={[{ scaleType: 'band', dataKey: 'yearMonth' , valueFormatter: ( value ) => value.toString(),}]}
                            series={[
                                { dataKey: 'operation_cost', label: 'Costo operazioni', valueFormatter:(value) => `${value} €` },
                                { dataKey: 'energy_consumption', label: 'Energia consumata', valueFormatter:(value) => `${value} €` },
                                { dataKey: 'water_usage', label: 'Acqua utilizzata', valueFormatter:(value) => `${value} €` },
                                { dataKey: 'waste_generated', label: 'Rifiuti', valueFormatter:(value) => `${value} €` },
                                { dataKey: 'extracted_value', label: 'Guadagno', color:'green', valueFormatter:(value) => `${value} €` },
                                { dataKey: 'total_cost', label: 'Costo totale', color:'red', valueFormatter:(value) => `${value} €` },
                            ]}
                            {...chartSetting}
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default CostsIncomeGraph