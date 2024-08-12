
import { LineChart } from "@mui/x-charts"
import { useSelector } from 'react-redux';
import { selectData } from "../../features/data/dataSlice";

function PriceGraph() {

    const data = useSelector( selectData)

    let graphData = JSON.parse(JSON.stringify(data.marketPrices))

    const colors = {
        Argento: 'lightgray',
        Platino: 'blue',
        Oro: 'purple',
        Rame: 'orange',
        Iridio: 'black',
    };

      const customize = {
        height: 500,
        legend: { hidden: false },
        margin: { top: 5 },
      };

      // stringhe in numeri
      for (let index = 0; index < graphData.length; index++) {
        const element = graphData[index];
        graphData[index].unix = new Date(element.date).valueOf()
        Object.keys(colors).map((key)=>{
            graphData[index][key] = element[key] * 1
        })
      }

      const a = graphData.find( row => row.id === 5 ).date
      console.log( a )
      return (
      <>
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
            series={Object.keys(colors).map((key) => ({
                dataKey: key,
                label: key,

                color: colors[key],
                showMark: false,
            }))}

            dataset={graphData}
            {...customize}
            />
      </div>
            
      </>
    )
  }


  export default PriceGraph
  