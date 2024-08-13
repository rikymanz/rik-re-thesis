
import { LineChart } from "@mui/x-charts"
import { useState , useEffect } from "react"
import { useSelector } from 'react-redux';
import { selectData } from "../../features/data/dataSlice";

// componente per la visualizzazione dei grafici dei prezzi - Usato per fare dei test sulla libreria dei grafici
function PriceGraph() {
    // Tutti i dati generati dall'applicazione
    const data = useSelector( selectData)
    // varibiale di stato per la visualizzazione del loading e, quando "idle", del grafico
    const [status,setStatus] = useState( 'loading' )
    // varibile di stato per la visualizzazione delle serie. Ogni riga rapprensenta una serie visualizzabile. Di default tutto a true
    const [selection,setSelection] = useState([
      {id:'Argento',selected:true, color:'lightgray'},
      {id:'Platino',selected:true, color:'blue'},
      {id:'Oro',selected:true, color:'purple'},
      {id:'Iridio',selected:true, color:'black'},
    ])

    // dati utilizzati dal grafico
    const [graphData, setGraphData] = useState( null )

    // oggetto per i settaggi del grafico
    const customize = {
        height: 500,
        legend: { hidden: false },
        margin: { top: 5 },
    };


    /**
     * Funzione di click (in realtà scatta quanto viene modificata) della checbox relativa alla selezione delle serie
     * @param {*} mineral : Nome nel minerale della quale va modificata la presenza o meno nella serie
     * @param {*} checkBoxElement : elemento cliccato
     */    
    const handleCheckChange = ( mineral , checkBoxElement ) => {
        // stato dopo il click della checkbox
        const isChecked = checkBoxElement.checked
        // copia dell'array selected, verrà modificata la copia e poi verrò chiamato setSelection, per modificare la variabile di stato
        let tempData = JSON.parse( JSON.stringify( selection ) )
        // scorrimento array, se la serie è quella cliccata cambia l'attributo selected
        tempData = tempData.map( row => {
            // modifica attributo selected solo per il minerale clicclato
            if( row.id === mineral ) row.selected = isChecked
            return row
        }) // fine map
        // modifica dell'array di stato selection
        setSelection( tempData )
    } // fine handleCheckChange

    // Funzione lanciata dall'useEffect dopo la modifica dell'array di stato per la selezione delle serie, ad ogni click verrà lanciata
    // Necessario farla fuori dall'useEffect, che non accetta l'async direttamente
    const asyncSetGraphData = async () => {
          // varibiale di stato per la visualizzazione del grafico. Necessaria per evitare bug del grafico (serie che non aggiornano i valori al cambiare delle scala sull'asse y)
          setStatus( 'loading' )
          let tempData =  [] // array che conterrà le serie e varrà usato per aggiornare la variabile si stato finale
          // per ogni riga dei prezzi (ogni mese dal 2000 al 2023)
          for (let index = 0; index < data.marketPrices.length; index++) {
              // copia dell'elemento
              let element = JSON.parse(JSON.stringify(data.marketPrices[index]))
              // aggiunta data in formato unix, necessario per dare valore numerico all'asse x
              element.unix = new Date(element.date).valueOf()
              // per ogni serie(minerale)
              selection.map(( obj )=>{
                // check se l'nesima serie e selezionata come visualizzabile
                const isSelected = selection.find( row => row.id === obj.id ).selected
                // se selected == true viene inserito l'attributo nell'oggetto
                if( isSelected ) element[obj.id] = element[obj.id] * 1
                
                  
              }) // fine map serie
              // aggiunta della riga con solo gli attributi (serie) selezionate
              tempData.push( element )
          } // fine for elementi (date)
          // settaggio dati 
          setGraphData( tempData )
          // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
          await new Promise(resolve => setTimeout(resolve, 1000));
          // variabile di stato che permetta la visualizzazione del grafico
          setStatus('idle')
    } // fine asyncSetGraphData

      // chiamato all'aprisi dell'applicazione e ogni volta che viene cliccata una checkbox (modifica dell'array selection)
      useEffect(() => {
          
         asyncSetGraphData()

      }, [ selection ]); // fine useEffect


      return (
      <>
      {/** Div con le checkbox - Daranno il via alla modifica dell'array selection, quindi dell'array graphData e quindi del grafico */}
      <div style={{textAlign:"center"}}>
        <input type="checkbox" checked={ selection.find( row => row.id === "Argento" ).selected} onChange={ ( e ) => handleCheckChange("Argento",e.currentTarget)} /> Argento &nbsp;&nbsp;
        <input type="checkbox" checked={ selection.find( row => row.id === "Platino" ).selected} onChange={ ( e ) => handleCheckChange("Platino",e.currentTarget)}  /> Platino &nbsp;&nbsp;
        <input type="checkbox" checked={ selection.find( row => row.id === "Oro" ).selected} onChange={ ( e ) => handleCheckChange("Oro",e.currentTarget)}  /> Oro &nbsp;&nbsp;
        <input type="checkbox" checked={ selection.find( row => row.id === "Iridio" ).selected} onChange={ ( e ) => handleCheckChange("Iridio",e.currentTarget)}  /> Iridio &nbsp;&nbsp;
      </div>
      {/** Schermata di caricamento */}
      { status === 'loading' && <div>Loading ...</div>}
      {/** Grafico preso dal LineChart di MUI */}
      {
        status === 'idle' && 
            <div>
                <LineChart
                  xAxis={[
                      {
                      dataKey: 'unix',
                      valueFormatter: ( value ) => new Date(value).toISOString().slice(0,4),
                      min:new Date('2000-01-01').valueOf(),
                      max:new Date('2023-01-01').valueOf(),
                      },
                  ]}
                  series={selection.filter(row => row.selected ).map((row) => ({
                      dataKey: row.id,
                      label: row.id,
                      color: row.color,
                      showMark: false,
                  }))}

                  dataset={graphData}
                  {...customize}
                />
          </div>
        
      }
      
            
      </>
    )
  }


  export default PriceGraph
  