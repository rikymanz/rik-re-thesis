import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import styled from 'styled-components';



import { selectData } from '../../features/data/dataSlice'

// componente per la visualizzazione delle informazioni sulle miniere
function MinesInfo() {
    // tutti i dati dell'applicazione
    const data = useSelector( selectData )
    // varibile di stato che conterrà la miniera selezionata, inzizialmente sarà a 0
    const [selectedMine,setSelectedMine] = useState( null )
    // mineData avr- tutte le info utilizzate dal grafico e dalla schermata delle informazioni. 
    // Conterrà le due cose separaamente: info avrà informazioni generiche. data avrà le serie visualizzabili per il grafico
    const [mineData,setMineData] = useState({info:null, data:null})
    // variabile di stato per la gestione della schermata di caricamento 
    const[ status, setStatus ] = useState('idle')

    const chartSetting = {
      yAxis: [
        {
          label: 'Spesa (€)',
        },
      ],
      //width: 500,
      height: 600,
      sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translate(-20px, 0)',
        },
      },
    };

    // metodo che scatta alla modifica della select di selezione della miniera
    const handleSelectChange = ( element ) => {
        // acquisisizione miniera dall'array relativo in base alla selezione effettuata
        const mine = data.mines.find( temp => temp.id == element.value )
        // settaggio variabile di stato - conterrà la miniera selezionata
        setSelectedMine( mine )
    } // fine handleSelectChange

    // funzione che restituisce la riga vuota dell'array data che verrà utilizzato per il grafico. Viene fatto qui visto che verrà usata in diversi for 
    const getEmptyRow = ( year ) => {
        return {
          year,
          operation_cost:0,
          //extracted_quantity:0,
          energy_consumption:0,
          water_usage:0,
          waste_generated:0,
        }
    }

    // inizializzazione di tutti i dati riguardanti le spese e le estrazioni della miniera
    const initData = async() => {
        setStatus( 'loading' )
        // variabili che conterranno tutte le informazioni da visualizzare e i dati presi dal grafico, verranno usate per poi valorizzare la viariabile di stato mineData
        let tempData = []
        let tempInfo = {}
        // estrazione quantità estratta per anno
        // for di operations
        const operations = data.operations.filter( row => row.mine_id === selectedMine.id )
        // for di operations
        for (let index = 0; index < operations.length; index++) {
            // n -esima oprazione estratta
            const operation = operations[index]
            // anno 
            const year = new Date( operation.date ).getFullYear()
            // estrazione da tempData, controlla se è già stato inserita una riga per l'anno. A seconda di questa o aggiunge la riga con relativi attributi valorizzati (quantità estrtatta e costo operazione) oppure somma gli attributi a quelli già presenti
          
            if( !tempData.find( row => row.year === year ) ) tempData.push(getEmptyRow( year )) 
            const tempRow = tempData.find( row => row.year === year)

            tempRow.operation_cost += operation.operation_cost
            //tempRow.extracted_quantity += operation.extracted_quantity
            
        } // fine for operations e settaggio info riguardanti le operazioni di estrazione

        // array filtrato con solo le risorse utilizzate della miniera selezionata
        const resourceManagement = data.resourceManagement.filter( row => row.mine_id === selectedMine.id )
        // for di resourceManagement - dati relativi alle spese e alle risorse utilizzate
        for (let index = 0; index < resourceManagement.length; index++) {
            const resourcesRow = resourceManagement[index];
            const year = new Date( resourcesRow.date ).getFullYear()

            if( !tempData.find( row => row.year === year ) ) tempData.push(getEmptyRow( year )) 
            const tempRow = tempData.find( row => row.year === year)

            tempRow.water_usage += resourcesRow.water_usage
            tempRow.energy_consumption += resourcesRow.energy_consumption
            tempRow.waste_generated += resourcesRow.waste_generated

        } // fine for
        // ordinamento per anno
        tempData.sort((a,b) => a.year - b.year);

        setMineData({info:tempInfo, data:tempData})

        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 1000));
        // variabile di stato che permetta la visualizzazione del grafico
        setStatus('idle')

    } // fine initData

     // chiamato all'aprisi dell'applicazione e ogni volta che viene cambiata una miniera dalla select in alto
    useEffect(() => {
        // viene effettuato solo se selectedMine è valorizzato.
        // non verrà quindi eseguito al caricamento iniziale del componente
        if( selectedMine ) initData()

    }, [ selectedMine ]); // fine useEffect

    return (
    <>
    {/* Riga con la select per la selezione della miniera */}
    <div style={{textAlign:'center'}}>
        <div style={{display:"inline-block",width:500,margin:'0 auto'}}>
            <select className="form-select form-select-sm" onChange={( e ) => handleSelectChange( e.currentTarget ) }>
                <option key={0} value={0}> - </option>
                {
                    data.mines.map( tempMine => (
                        <option key={tempMine.id} value={tempMine.id}> {tempMine.name} </option>
                    ))
                }
            </select>
        </div>
    </div>
    
    <div>
        { (!selectedMine && status === 'idle') && <div>Selezionare miniera dal menu in alto</div> }
        { (status === 'loading') && <div>Loading..</div> }
        { (selectedMine && mineData.data && status==='idle') && <div>

          <div style={{display:'inline-block',width:"30%",verticalAlign:'top',padding:100}}>
              <InfoRow>
                  <span>ID:</span>&nbsp;&nbsp;
                  <span>{selectedMine.id}</span>
              </InfoRow>
              <InfoRow>
                  <span>Nome:</span>&nbsp;&nbsp;
                  <span>{selectedMine.name}</span>
              </InfoRow>
              <InfoRow>
                  <span>Dimensioni:</span>&nbsp;&nbsp;
                  <span>{selectedMine.dimension === 1 ? 'Piccola' : selectedMine.dimension === 2 ? 'Media' : 'Grande'}</span>
              </InfoRow>
              <InfoRow>
                  <span>Minerale:</span>&nbsp;&nbsp;
                  <span>{selectedMine.type_of_mineral}</span>
              </InfoRow>
              <InfoRow>
                  <span>Fondazione:</span>&nbsp;&nbsp;
                  <span>{selectedMine.start_date}</span>
              </InfoRow>
              <InfoRow>
                  <span>Zona:</span>&nbsp;&nbsp;
                  <span>{selectedMine.zone === 1 ? 'Arida (1)' : selectedMine.dimension === 2 ? 'Temperata (2)' : 'Fredda (3)'}</span>
              </InfoRow>

          </div>
          <div style={{display:'inline-block',width:"70%",verticalAlign:'top'}}>
                        
              <BarChart
                  style={{padding:50}}
                  dataset={mineData.data}
                  xAxis={[{ scaleType: 'band', dataKey: 'year' , valueFormatter: ( value ) => value.toString(),}]}
                  series={[
                      { dataKey: 'operation_cost', label: 'Costo operazioni', valueFormatter:(value) => `${value} €` },
                      { dataKey: 'energy_consumption', label: 'Energia consumata', valueFormatter:(value) => `${value} €` },
                      { dataKey: 'water_usage', label: 'Acqua utilizzata', valueFormatter:(value) => `${value} €` },
                      { dataKey: 'waste_generated', label: 'Rifiuti', valueFormatter:(value) => `${value} €` },
                  ]}
                  {...chartSetting}
              />

          </div>

        </div> }
    </div>
        
    </>
    )
}

const InfoRow = styled.div`
    margin-top:10px;
`



  export default MinesInfo
  