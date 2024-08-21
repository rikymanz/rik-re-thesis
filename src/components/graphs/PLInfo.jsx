import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { selectData } from './../../features/data/dataSlice'
import { getFormattedNumber } from '../../utils/generalHelper'

import Loading from '../Loading'

function PLInfo(){
    const data = useSelector( selectData )

    const [selection,setSelection] = useState({year:2023,month:12})
    // variabile di stato per gestire il caricamento
    const [status,setStatus] = useState('idle')
    // valori gestiti dalle select
    const [selectedYear,setSelectedYear] = useState(2023)
    const [selectedMonth,setSelectedMonth] = useState(12)
    // array di tutti gli anni in cui è stata effettuata un'operazione
    const years = [...new Set(data.operations.map( row => row.date.slice(0,4)))]
    // dati che verranno presi dal grafico
    const [tableData,setTableData] = useState(null)



    // funzione che scatta quando di preme il pulsante di conferma per il cambio data
    const handleDateChange = () => {
        setSelection( {year:selectedYear*1,month:selectedMonth*1} )
    } // fine handleDateChange

    // riga vuota dell'array per la tabella
    const getEmptyRow = ( year , month , mine_id ) => {
        // creazione oggetto da restutuire
        let obj = { 
            year , month , mine_id ,
            extracted_quantity:0,
            extracted_value:0,
            operation_cost:0,
            energy_consumption:0,
            waste_generated:0,
            water_usage:0,
            total_cost:0
        }
        // estrazione dei possibili minarali
        const minerals = [...new Set(data.mines.map(item => item.type_of_mineral))]

        // verrà aggiunta un'attrributo per ogni minerale, avrà il profitto. Servirà per il raggruppamento sotto ricavi con il materiale estratto
        for (let index = 0; index < minerals.length; index++) {
            const mineral = minerals[index];
            obj[mineral] = 0;
            
        } // fine for

        return obj 
    } // fine getEmptyRow

    /**
     * A differenza di getValue, questa funzione ritorna il valore numerico.
     * 
     * @param {number} year - Anno
     * @param {number} month - Mese, da 1 a 12
     * @param {string} column - Attributo della quale fare la somma delle righe
     * @param {number} mine - id della miniera, se è 0 vengono prese tutte
     * @returns - Valore numerico della somma di tutte le righe dell'attributo column
     */
    const getRawValue = (year, month , column , mine) => {

        let data = JSON.parse( JSON.stringify( tableData.data ) )
        data = data.filter( row => row.year === year && row.month <=  month )
        // se è presente l'id della miniera estrae solo i valori per quella miniera, altrimenti (se è 0) estrate quelli relativi a tutte le miniere
        if( mine > 0 ) data = data.filter( row => row.mine_id === mine )
        // vengono sommati tutti i valori di uno specifico attributo
        const value = data.reduce( ( a , b) => a + b[column] , 0 )

        return value
        
    } // fine getRawValue

    const getMineProperty = ( mine_id ) => {
        const mine = data.mines.find( row => row.id === mine_id )
        const dimension = mine.dimension === 1 ? 'piccola' : mine.dimension === 2 ? 'media' : 'grande'
        const zone = mine.zone === 1 ? 'arida' : mine.zone === 2 ? 'temperata' : 'fredda'
        const mineral =  mine.type_of_mineral.toLowerCase()

        const str =  `(${mineral}/${dimension}/${zone})`

        return str
    }

    /**
     * Ritorna il valore formattato con separatore migliaia della somma di uno specifico attributo di un array filtrato secondo i parametri
     * 
     * @param {number} year - Anno
     * @param {number} month - Mese, da 1 a 12
     * @param {string} column - Attributo della quale fare la somma delle righe
     * @param {number} mine - id della miniera, se è 0 vengono prese tutte
     * @returns - Valore formattato xx'xxx'xxx,xx € della somma di tutte le righe dell'attributo column
     */
    const getValue = (year, month , column , mine) => {


        let data = JSON.parse( JSON.stringify( tableData.data ) )
        data = data.filter( row => row.year === year && row.month <=  month )
        if( mine > 0 ) data = data.filter( row => row.mine_id === mine )

        const value = data.reduce( ( a , b) => a + b[column] , 0 )

        if( value === 0 ) return '-'

        return getFormattedNumber(value) + ' €'
         
    } // fine getValue

    // Calcolo della riga iniziale, viene fatta una funzione visto che, al contrario delle altre righe, non basta sommare un attributo delle righe
    const getProfit = ( year , month ) => {
        // riga di Income totale
        const income = getRawValue( year,month, 'extracted_value', 0 )
        // riga costi totali
        const cost = getRawValue( year,month, 'total_cost', 0 )
        // Differenza dei due valori
        const value = income - cost
        // ritorna numero formattato
        return getFormattedNumber(value) + ' €'
    } // fine getProfit

    // come i metodi precedenti, ma restituisce il valore formattato rispetto all'income totale
    const getPerc = (year, month , column , mine) => {

        const income = getRawValue( year,month, 'extracted_value', 0 )
        const value = getRawValue( year,month, column, mine )

        const perc = value / income * 100

        if( value === 0 ) return '-'

        return getFormattedNumber(perc) + ' %'
        
    } // fine getPerc

    // oggetto da passare al componente filgio per poter usare le funzioni definite nell'oggetto padre
    const functions = {
        getPerc:(year, month , column , mine) => getPerc(year, month , column , mine),
        getValue:(year, month , column , mine) => getValue(year, month , column , mine),
        getMineProperty: ( mine_id ) => getMineProperty( mine_id )
    } // fine oggetto functions

   
    // settaggio data per visualizzazione tabella
    const initData = async () => {
        // visualizzazione compoentnte di loading - icona di caricamento
        setStatus('loading')

        let tempData = []
         // data di riferimento
        const tempDate = new Date( `${selection.year}-${selection.month}-01` )
         // miniere attive nel mese-anno scelti
        const tempMines = data.mines.filter( row => new Date(row.start_date) < tempDate ).map( row => ({...row,month:new Date( row.start_date ).getMonth() + 1}))
        // per ogni operations che abbian una data dell'anno attuale o del precedente
        let tempArray = data.operations.filter( row => new Date( row.date ).getFullYear() === selection.year || new Date( row.date ).getFullYear() === selection.year - 1)
     

        for (let index = 0; index < tempArray.length; index++) {
            const rowOperation = tempArray[index];
           
            const dataRow = getEmptyRow( new Date(rowOperation.date).getFullYear(), new Date(rowOperation.date).getMonth() + 1 , rowOperation.mine_id ) 
          
            // minerale della miniera
            const tempMineral = data.mines.find( row => row.id === rowOperation.mine_id  ).type_of_mineral
            const tempPrice = data.marketPrices.find( row => row.date === rowOperation.date )[tempMineral]
            
            dataRow.extracted_quantity += rowOperation.extracted_quantity
            dataRow.extracted_value += ( rowOperation.extracted_quantity * tempPrice )
            dataRow[tempMineral] += ( rowOperation.extracted_quantity * tempPrice )
            dataRow.operation_cost += rowOperation.operation_cost

            tempData.push( dataRow )

        
        } // fine for operations

        // per ogni operations che abbian una data dell'anno attuale o del precedente
        tempArray = data.resourceManagement.filter( row => new Date( row.date ).getFullYear() === selection.year || new Date( row.date ).getFullYear() === selection.year - 1 )
        for (let index = 0; index < tempArray.length; index++) {
            const rowResource = tempArray[index];
            let dataRow = tempData.find( row => row.year === new Date(rowResource.date).getFullYear() && row.month === new Date(rowResource.date).getMonth() + 1 && row.mine_id === rowResource.mine_id  )

            dataRow.energy_consumption += rowResource.energy_consumption
            dataRow.waste_generated += rowResource.waste_generated
            dataRow.water_usage += rowResource.water_usage

        } // fine for operations

        tempData = tempData.map( row => ( {...row,total_cost:row.operation_cost + row.energy_consumption + row.water_usage + row.waste_generated}  ))
        
        setTableData( {data: tempData , mines: tempMines} )
        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('idle')
    }

    useEffect(()=>{

        // funzione settaggi dati presi dalla tabella del grafico
        initData()
       
    },[selection])

    return(
        <>
        {/* Schermata di caricamento */}
        { status === 'loading' && 
            <Loading />
        }

        {/* Riga con la selezione di mese e anno */}
        { status === 'idle' && <div style={{textAlign:'center'}}>
            {/* Selezione anno */}
            <div style={{display:'inline-block',width:200}}>
                <span>Anno </span>{''}
                <select className="form-select form-select-sm" defaultValue={selection.year} onChange={( e )=> setSelectedYear( e.currentTarget.value )}>
                    {
                        years.map( year => (
                            <option value={year} key={year}> {year} </option>
                        ))
                    }
                </select>
            </div>
            {' '}
            {/* Selezione mese */}
            <div style={{display:'inline-block',width:200}}>
                <span>Mese </span>{''}
                <select className="form-select form-select-sm" defaultValue={selection.month} onChange={( e )=> setSelectedMonth( e.currentTarget.value )}>
                    {
                        [1,2,3,4,5,6,7,8,9,10,11,12].map( month => (
                            <option value={month} key={month}> { month } </option>
                        ))
                    }
                </select>
            </div>
            {' '}
            <div style={{display:'inline-block',fontSize:25,width:100,paddingTop:10}}>
                <i onClick={() => handleDateChange() } style={{cursor:'pointer'}} className="bi bi-arrow-right-circle"></i>
            </div>

        </div>}{/* Fine riga selezione data */}
        
        {/* Tabella con i dati */}
        { (tableData && status === 'idle') && 
            <div style={{textAlign:'center',padding:'5px 150px'}}>
                <div style={{paddingTop:10,fontWeight:'bold'}}>
                    <MyColumns width={25}>
                    </MyColumns>
                    <MyColumns width={25} $textalign={'right'}>
                        Bilancio {selection.year}-{selection.month}
                    </MyColumns>
                    <MyColumns width={10} $textalign={'right'}>
                        %
                    </MyColumns>
                    <MyColumns width={25} $textalign={'right'}>
                        Bilancio {selection.year-1}-{selection.month}
                    </MyColumns>
                    <MyColumns width={10} $textalign={'right'}>
                        %
                    </MyColumns>
                </div>

                <MyDataTable>

                <MyRowStyle style={{background:'#9933ff', color:'white', fontWeight:'bold'} }>
                    <MyColumns width={25} $textalign={'left'} fontStyle={'none'} >PROFITTO</MyColumns>
                    <MyColumns width={25} $textalign={'right'}>{getProfit(selection.year,selection.month)}</MyColumns>
                    <MyColumns width={10} $textalign={'right'}>-</MyColumns>
                    <MyColumns width={25} $textalign={'right'}>{getProfit(selection.year-1,selection.month)}</MyColumns>
                    <MyColumns width={10} $textalign={'right'}>-</MyColumns>
                </MyRowStyle>

                    <MyRow title={'1 - Ricavi'} background={'#9933ff'} color={'white'} selection={selection} functions={functions} column={'extracted_value'} mine={0} />
                    {  
                        [...new Set(tableData.mines.map(item => item.type_of_mineral))].map( temp  => (
                            <>
                            <MyRow key={temp} title={temp} background={'#E5CCFF'} color={'black'} selection={selection} functions={functions}  column={temp} mine={0} />

                            {tableData.mines.filter( row => temp === row.type_of_mineral ).map( (row) => (
                                <MyRow key={`${temp}_${row.name}`} title={row.name} background={'white'} color={'black'} selection={selection} functions={functions}  column={'extracted_value'} mine={row.id} />
                            ))}
                            </>
                        ))
                        
                    }
                    <MyRow title={'2 - Costi'} background={'#9933FF'} color={'white'} selection={selection} functions={functions}  column={'total_cost'} mine={0} />
                    
                    <MyRow title={'2.1 - Costo operazioni'} background={'#E5CCFF'} color={'black'} selection={selection} functions={functions}  column={'operation_cost'} mine={0} />
                    {  
                        tableData.mines.map( (row) => (
                            <MyRow key={`op_${row.name}`} title={row.name} background={'white'} color={'black'} selection={selection} functions={functions}  column={'operation_cost'} mine={row.id} />
                        ))
                    }
                    <MyRow title={'2.2 - Consumo energetico'} background={'#E5CCFF'} color={'black'} selection={selection} functions={functions}  column={'energy_consumption'} mine={0} />
                    {  
                        tableData.mines.map( (row) => (
                            <MyRow key={`en_${row.name}`} title={row.name} background={'white'} color={'black'} selection={selection} functions={functions}  column={'energy_consumption'} mine={row.id} />
                        ))
                    }
                    <MyRow title={'2.3 - Consumo acqua'} background={'#E5CCFF'} color={'black'} selection={selection} functions={functions}  column={'water_usage'} mine={0} />
                    {  
                        tableData.mines.map( (row) => (
                            <MyRow key={`wt_${row.name}`} title={row.name} background={'white'} color={'black'} selection={selection} functions={functions}  column={'water_usage'} mine={row.id} />
                        ))
                    }

                    <MyRow title={'2.4 - Smaltimento scarti'} background={'#E5CCFF'} color={'black'} selection={selection} functions={functions}  column={'waste_generated'} mine={0} />
                    {  
                        tableData.mines.map( (row) => (
                            <MyRow key={`wa_${row.name}`} title={row.name} background={'white'} color={'black'} selection={selection} functions={functions}  column={'waste_generated'} mine={row.id} />
                        ))
                    }

                </MyDataTable>

            </div>
        }  
        </>
    )

}

// componente riga, verrà usato nel cmoponente padre per non appesantirlo
function MyRow({selection,functions,background,color,title, column, mine}){
    return(
        <MyRowStyle style={{background, color} }>
            <MyColumns width={25} $textalign={ mine > 0 ? 'right' : 'left'} fontStyle={ mine > 0 ? 'italic' : 'none' } >{title} {mine > 0 && functions.getMineProperty(mine)}</MyColumns>
            <MyColumns style={{fontWeight:'bold'}} width={25} $textalign={'right'}>{functions.getValue(selection.year,selection.month,column,mine)}</MyColumns>
            <MyColumns style={{fontWeight:'bold'}} width={10} $textalign={'right'}>{functions.getPerc(selection.year,selection.month,column,mine)}</MyColumns>
            <MyColumns width={25} $textalign={'right'}>{functions.getValue(selection.year - 1,selection.month,column,mine)}</MyColumns>
            <MyColumns width={10} $textalign={'right'}>{functions.getPerc(selection.year - 1,selection.month,column,mine)}</MyColumns>
        </MyRowStyle>
    )
}

MyRow.propTypes = {
    background: PropTypes.string,
    color: PropTypes.string,
    title: PropTypes.string,
    functions:PropTypes.object,
    selection:PropTypes.object,
    column:PropTypes.string,
    mine:PropTypes.number
  }


const MyColumns = styled.div`
    display:inline-block;
    vertical-align:top;
    width:${props=>props.width + '%'};
    text-align:${props=>props.$textalign};
    font-size:11px;
    font-style:${props=>props.fontStyle};
    overflow:hidden;
    height:100%;
`
const MyRowStyle = styled.div`
    padding-top:3px;
    height:25px;
    border-bottom:1px solid lightgrey;

`

const MyDataTable = styled.div`
    padding:3px;
    border:1px solid lightgrey;
    height:600px;
    overflow-y:scroll;
`


export default PLInfo