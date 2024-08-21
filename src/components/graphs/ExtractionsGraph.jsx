import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectData } from "../../features/data/dataSlice"
import Loading from '../Loading';

import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

function ExtractionsGraph(){

    const data = useSelector( selectData )
    const [ graphData, setGraphData ] = useState([])
    // varibiale di stato per la visualizzazione del loading e, quando "idle", del grafico
    const [status,setStatus] = useState( 'loading' )

    // lista miniere, viene aggiunto l'attributo selected a true
    // verrà usato per la selezione delle miniere e quindi i dati presi da grafico
    const [ mines, setMines] = useState(
        data.mines.map( row => ({...row,selected:true}))
    ) // fine settaggio mines

    const chartSetting = {
        yAxis: [
          {
            label: 'Estratto (Kg)',
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

       /**
     * Funzione di click (in realtà scatta quanto viene modificata) della checbox relativa alla selezione delle serie
     * @param {*} mine_id : ID della miniera cliccata
     * @param {*} checkBoxElement : elemento cliccato
     */    
    const handleCheckChange = ( mine_id , checkBoxElement ) => {
        // stato dopo il click della checkbox
        const isChecked = checkBoxElement.checked
        // copia dell'array selected, verrà modificata la copia e poi verrò chiamato setSelection, per modificare la variabile di stato
        let tempData = JSON.parse( JSON.stringify( mines ) )
        // scorrimento array, se la serie è quella cliccata cambia l'attributo selected
        tempData = tempData.map( row => {
            // modifica attributo selected solo per il minerale clicclato
            if( row.id === mine_id ) row.selected = isChecked
            return row
        }) // fine map
        // modifica dell'array di stato selection
        setMines( tempData )
    } // fine handleCheckChange

    // funzione per il settaggio dei dati per il grafico, chiamato all'inizio e alla selezione delle miniere
    const initGraphData = async() => {
        setStatus( 'loading' )
        // minerali presenti nelle miniere
        const minerals = [...new Set(mines.map(item => item.type_of_mineral))]
        // array vuoto che conterrà tutti i dati
        let tempData = []
        // per ogni operations
        for (let index = 0; index < data.operations.length; index++) {
            // riga di un'operazione di estrazione
            const operation = data.operations[index];
            // miniera dell'estrazione
            const mine = mines.filter( temp => temp.selected ).find( temp => temp.id === operation.mine_id )
            if( !mine ) continue;
            // minerale estratto dalla miniera
            const mineral = mine.type_of_mineral
            // anno di etrazione
            const year = new Date( operation.date ).getFullYear()
            // quantità estratta
            const kg = operation.extracted_quantity
            // cerca se esiste già una riga per l'anno di estrazione
            const tempRow = tempData.find( row => row.year === year )
            // se non esiste la aggiunge e imposta i kg relativi al minerale estratti dall'oiperazione, gli altri minerali vengono messi a 0
            if( !tempRow ){
                //costruzione oggetto temporaneo
                let temp = { year }
                // per ogni minerale
                for (let index = 0; index < minerals.length; index++) {
                    temp[minerals[index]] = minerals[index] === mineral ? kg : 0
                } // fine for scorrimento minerale
                // aggiunta riga all'array
                tempData.push( temp )

            // altrimenti viene aggiunto solamente il kg dei valori estratti
            }else{
                tempRow[mineral] += kg
            } // fine if else

        } // fine for scorrimento operations
        
        setGraphData( tempData )

        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 1000));
        // variabile di stato che permetta la visualizzazione del grafico
        setStatus('idle')

    } // fine initGraphData

     // chiamato all'aprisi dell'applicazione e ogni volta che viene cliccata una checkbox (modifica dell'array selection)
     useEffect(() => {

            initGraphData()
   
     }, [ mines ]); // fine useEffect

    const valueFormatter = (value) => `${value}Kg`;



    return(
        <>
        
            {/** Schermata di caricamento */}
            { status === 'loading' && <Loading />}
            {/** Grafico preso dal LineChart di MUI */}
            {
                status === 'idle' && 
                <div>
                    <div style={{display:'inline-block',width:'20%',verticalAlign:'top',padding:20,paddingTop:100}}>
                        
                        {
                        mines.map( ( mine , index) => (
                            <div key={index}>
                                <input type="checkbox" 
                                    checked={ mine.selected } 
                                    onChange={ ( e ) => handleCheckChange( mine.id,e.currentTarget )} 
                                /> 
                                {' '}
                                <span>
                                    {mine.name} ( {mine.dimension === 1 ? 'piccola' : mine.dimension === 2 ? 'media' : 'grande'} ) - {mine.type_of_mineral}
                                </span>
                                
                            </div>
                     
                            ))
                        }

                    </div> 
                    <div style={{display:'inline-block',width:'80%',verticalAlign:'top'}}>
                        
                        <BarChart
                            style={{padding:50}}
                            dataset={graphData}
                            xAxis={[{ scaleType: 'band', dataKey: 'year' , valueFormatter: ( value ) => value.toString(),}]}
                            series={[
                                { dataKey: 'Oro', label: 'Oro', valueFormatter },
                                { dataKey: 'Argento', label: 'Argento', valueFormatter },
                                { dataKey: 'Platino', label: 'Platino', valueFormatter },
                                { dataKey: 'Iridio', label: 'Iridio', valueFormatter },
                            ]}
                            {...chartSetting}
                        />

                    </div> 
                </div>
                
                
            }
        </>
    )
}

export default ExtractionsGraph