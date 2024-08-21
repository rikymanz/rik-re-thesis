import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
// import nei componenti necessari per il grafico
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
// import dello slice per avere tutti i dati
import { selectData } from '../../features/data/dataSlice'
// Componente per la schermata di caricamento
import Loading from '../Loading';

// inizio componente
function CostsIncomeGraph() {
    // data contiene tutte le tabelle generate casualmente
    const data = useSelector( selectData )
    // variabile di stati per la selezione dell'anno
    const [selection,setSelection] = useState( 2023 )
    // variabile si stato per visualizzare la schermata di caricamento mentre viene preparato il grafico
    const [status,setStatus] = useState('loading')
    // variabile si stato con i dati usati dal grafico, verrà valorizzata all'avvio del componente e al cambio dell'anno
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
    } // fine getEmptyRow

    // settaggi del grafico
    const chartSetting = {
        yAxis: [
            {
                label: '(€)',
            },
        ],
        height: 500,
        // posizionamento della label dell'asse Y
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-50px, 0)',
            },
        },
    } // fine oggetto con settaggi grafico

    /**
     * 
     * @param {number} coeff - Variazione dell'anno. Essendo una selezione tramite due frecce, una per diminuire e una per aumentare l'anno, sarà -1 o 1
     */
    const handleChangeYear = ( coeff ) => {
        // nuovo anno, in nase al tipo di selezione
        let newYear = selection + coeff
        // l'anno non può scendere sotto il 2001
        if( newYear < 2001) newYear = 2001
        // l'anno non può essere maggiore del 2023
        if( newYear > 2023 ) newYear = 2023
        // impostazione della variabile di stato selection
        setSelection( newYear )
    } // fine funzione handleChangeYear

    /**
     * Funzione per il settaggio dei dati utilizzati dal grafico - Verrà lanciata al caricamento del componente e quando cambiarà la variabile di stato selection
     * E' stata creata per permettere await new Promise, per simulare un'attesa. useEffect non permette l'async 
     */
    const initData = async() => {
        // settaggio delle stato loading, questo nasconderà il grafico e farà comparire un'icona di caricamento
        setStatus( 'loading' )
        // array che conterrà, ciclo dopo ciclo, tutti i dati utili per il grafico
        let tempData = []
        // vengono prese solo re estrazioni fatte nell'anno selezionato
        const filteredOperations = data.operations.filter( row => new Date( row.date ).getFullYear() === selection )
        // per ogni riga di data.operations con l'anno selezionato
        for (let index = 0; index < filteredOperations.length; index++) {
            // i-esima operazione
            const operation = filteredOperations[index]
            // anno-mese, identifichera la riga dell'array
            const yearMonth = operation.date.slice(0,7)
            // Possono esistere più estrazioni per lo stesso mese. Se non esiste ancora una riga nell'array finale di questo mese, viene aggiunta con tutti valori 0
            if( !tempData.find( row => row.yearMonth === yearMonth ) ) tempData.push(getEmptyRow( yearMonth )) 
            // Ora che sicuramente esiste, vuota o già parzialmente valorizzata, viene cercata e presa dall'array finale
            const tempRow = tempData.find( row => row.yearMonth === yearMonth)
            // minerale estratto dall'operaziont, preso in base alla miniera (join tra operations.mine_id con mine.id)
            const mineral = data.mines.find( row => row.id === operation.mine_id ).type_of_mineral
            // costo del minerale preso dallo storico dei prezzi
            const value = data.marketPrices.find( row => row.date === operation.date )[mineral]
            // aggiunta del costo dell'operazione e del ricavo alla riga comulativo anno-mese dell'array finale
            tempRow.operation_cost += operation.operation_cost
            tempRow.total_cost += operation.operation_cost // total_cost avrà poi anche tutti gli altri costi, vedere ciclo di resources successivo
            tempRow.extracted_value += operation.extracted_quantity * value
            
        } // fine for operations e settaggio info riguardanti le operazioni di estrazione

        // fitlraggio array gestione risorse, allo stesso modo del precedente
        const filteredResources = data.resourceManagement.filter( row => new Date( row.date ).getFullYear() === selection )
        // for di resourceManagement - dati relativi alle spese e alle risorse utilizzate
        for (let index = 0; index < filteredResources.length; index++) {
            // i -esima risorsa
            const resourcesRow = filteredResources[index]
            // anno-mese, chiave dell'array
            const yearMonth = resourcesRow.date.slice(0,7)
            // deve per forza già esistere una riga dell'array - nella generazione iniziale dei dati non puà esistere una riga di rsourceManagement se non era attiva la miniera in quel periodo
            const tempRow = tempData.find( row => row.yearMonth === yearMonth)
            // valorizzazione dei costi (acqua, energia e scarti)
            tempRow.water_usage += resourcesRow.water_usage
            tempRow.total_cost += resourcesRow.water_usage

            tempRow.energy_consumption += resourcesRow.energy_consumption
            tempRow.total_cost += resourcesRow.energy_consumption

            tempRow.waste_generated += resourcesRow.waste_generated
            tempRow.total_cost += resourcesRow.waste_generated

        } // fine secondo for
        // ordinamento per anno - mese
        tempData.sort((a,b) => a.yearMonth - b.yearMonth);
        // settaggio della varibile graphData
        setGraphData( tempData )
        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 1000));
        // variabile di stato che permetta la visualizzazione del grafico
        setStatus('idle')
    } // fine initData

    useEffect(() => {
        // lancio della rivalorizzazione della varibile da cui prende i dati il grafico
        initData()
    // viene lanciato all'inizio del caricamento del componente e alla modifica della variabile selection
 }, [ selection ]); // fine useEffect



    return (
        <>
            {/* Componente con icona di caricamento */}
            { status === 'loading' && <Loading />}
            {/* Componente con grafico */}
            { (status === 'idle' && graphData ) && 
                <>
                    {/* Scelta dell'anno - il click delle due icone lancerà l'evento handleChageYear  */}
                    <div style={{textAlign:'center',fontSize:20}}>
                        <span style={{cursor:'pointer'}} onClick={()=> handleChangeYear( -1 )}>
                            <i className="bi bi-arrow-left-circle"></i>
                        </span>
                        <span> {selection} </span>
                        <span style={{cursor:'pointer'}}  onClick={()=> handleChangeYear( 1 )}>
                            <i className="bi bi-arrow-right-circle"></i>
                        </span>
                    </div>
                    {/* Grafico */}
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
                </>
            }
        </>
    )
}

export default CostsIncomeGraph