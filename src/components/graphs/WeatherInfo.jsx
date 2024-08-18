import { useState , useEffect } from "react"
import { useSelector } from "react-redux"
import { selectData } from "../../features/data/dataSlice"

import styled from "styled-components"



function WeatherInfo(){

    const data = useSelector(selectData)

    const [tableData,setTableData] = useState(null)
    const [selectedYear,setSelectedYear] = useState(2023)
    const [status, setStatus] = useState('idle')

    const getDataRow = (location,month) => (
        tableData.find( row => row.location === location && row.month === month )
    )

    const getWarning = ( location, month ) => {
        let temperature = {level:0,message:''}
        let precipitation = {level:0,message:''}

        const row = tableData.find( row => row.location === location && row.month === month )
        if( !row ) return {temperature,precipitation}
        if( row.precipitation > 130 ){
            precipitation.level = 2
            precipitation.message = 'Le abbondanti precipitazioni hanno influito sulla produzione del mese. Efficienza 50% '
        }else if( row.precipitation > 80 ){
            precipitation.level = 1
            precipitation.message = 'Le abbondanti precipitazioni hanno influito sulla produzione del mese. Efficienza 70% '
        }
        if( row.temperature < 0 ){
            temperature.level = 1
            temperature.message = 'Le temperatura sotto 0 gradi ha causato un consumo energetico maggiore'
        }
        if( row.temperature > 35){
            temperature.level = 2
            temperature.message = 'Le temperatura sopra 35 gradi ha causato un consumo di acqua maggiore'
        }

        return {temperature,precipitation}

    } // fine getWarning

    const handleChangeYear = ( coeff ) => {
        let newYear = selectedYear + coeff
        if( newYear < 2001) newYear = 2001
        if( newYear > 2023 ) newYear = 2023

        setSelectedYear( newYear )
    }


    const initData = async() => {

        setStatus('loading')
        const tempData = data.weatherData.filter( row => new Date(row.date).getFullYear() === selectedYear ).map( row => ({ ...row, month : new Date(row.date).getMonth() + 1}) )
        setTableData( tempData )

        // aspetto 1 secondo per dare il tempo al grafico di aggiornarsi senza bug
        await new Promise(resolve => setTimeout(resolve, 1000));
        // variabile di stato che permetta la visualizzazione del grafico
        setStatus('idle')

    } // fine initData

    useEffect(()=> {
        initData()
    },[ selectedYear ])

    return(
        <>
   
   {
        ( status === 'idle' && tableData ) && 
        <div style={{paddingTop:30,textAlign:'center'}}>

            <MyDesc>
                La tabella mostra lo storico delle temperature e delle precipitazioni di tutte le location delle miniere nei mesi dell{"'"} anno.<br />
                Valori alti di precipitazioni e di temperature possono portare ad una minore efficienza nella produzione o ad un maggior consumo di risorse.<br /><br />
            </MyDesc>
            <div style={{textAlign:'center',fontSize:20}}>
                        <span style={{cursor:'pointer'}} onClick={()=> handleChangeYear( -1 )}>
                            <i className="bi bi-arrow-left-circle"></i>
                        </span>
                        
                        <span> {selectedYear} </span>

                        <span style={{cursor:'pointer'}}  onClick={()=> handleChangeYear( 1 )}>
                            <i className="bi bi-arrow-right-circle"></i>
                        </span>
                        
                    </div>
            <div >

                <MyTitleCol width={8}>
                    
                </MyTitleCol>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map( month  => (
                    <MyTitleCol width={7} key={month}>
                        {month}
                    </MyTitleCol>
                ))}
             </div>

             <div>
                {
                    [...new Set(tableData.map(item => item.location))].map( (location ) => (
                        <MyTableRow key={location}>
                            <MyValueCol width={8} style={{paddingTop:7}}>
                                { location }
                            </MyValueCol>
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map( month  => (
                                <MyValueCol width={7} key={month}>
                                    <MyWeatherInfoDiv >
                                        <MyTemperatureSpan temperature={getDataRow( location,month ) ? getDataRow( location,month ).temperature : 0 }>
                                            { getDataRow( location,month ) && `${getDataRow( location,month ).temperature}°`  }
                                            { (getWarning( location, month ).temperature.level > 0  ) && 
                                            <i style={{color:'black',float:'right'}} className="bi bi-exclamation-triangle" data-toggle="tooltip" data-placement="top" title={getWarning( location, month ).temperature.message}></i>  
                                            }    
                                        </MyTemperatureSpan> {''}
                                        <MyPrecipitationSpan precipitation={getDataRow( location,month ) ? getDataRow( location,month ).precipitation : 0 }>
                                            { getDataRow( location,month ) && `${getDataRow( location,month ).precipitation}mm` }
                                            { (getWarning( location, month ).precipitation.level > 0  ) && 
                                            <i style={{color:'black',float:'right'}} className="bi bi-exclamation-triangle" data-toggle="tooltip" data-placement="top" title={getWarning( location, month ).precipitation.message}></i>  
                                            }    
                                        </MyPrecipitationSpan> {''}
                                                                           
                                    </MyWeatherInfoDiv>
                                </MyValueCol>
                            ))}
                            
                        </MyTableRow>
                    ))
                }
             </div>

        </div>
   }

   {
        ( status === 'loading') && <div>
            Loading ....
        </div>
   }
           
        </>
    )
}

const MyTitleCol = styled.div`
    display:inline-block;
    vertical-align:top;
    width: ${ props => props.width }%;
    font-weight:bold;
`

const MyValueCol = styled.div`
    display:inline-block;
    vertical-align:top;
    width: ${ props => props.width }%;
    height:100%;
    padding:2px;

`
const MyWeatherInfoDiv = styled.div`
    height:100%;
    width:100%;
    border:1px solid lightgrey;
    padding:2px;
    padding-right:7px;
    font-size:10px;
`
const MyTableRow = styled.div`
    height:40px;
`

const MyTemperatureSpan = styled.div`
    color:${ props => props.temperature > 35 ? 'red' : props.temperature < 0 ? 'blue' : 'black' }
`

const MyPrecipitationSpan = styled.div`
    color:${ props => props.precipitation > 130 ? 'red' : props.precipitation > 80 ? 'orange' : 'black' }
`

const MyDesc = styled.div`
    
`

export default WeatherInfo