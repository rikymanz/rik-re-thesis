import { useState } from 'react';

import DashboardMenu from '../components/DashboardMenu';
import DashboardGraphs from '../components/DashboardGraphs';

// visualizzazione della dashboard - gestita dal componente padre HomePage
function DashboardPage() {
    // variabile di stato del compenente che indica quale grafico visualizzare, o il menu in caso di valore 0
    const [dashboard,setDashboard] = useState(0)
    /**
     * 
     * @param {number} id - da 0 a 6 - 0 per il menu e da 1 a 6 per il tipo di grafico
     */
    const handleDashboardMenuClick = ( id ) => {
        // modifica vera e pripria della variabile di stato
        setDashboard( id )
    } // fine handleDashboardMenuClick

    return (
      <>
      {
        dashboard === 0 && <DashboardMenu functions={{ handleClick : handleDashboardMenuClick }} />
      }
      {
        dashboard > 0 && <DashboardGraphs functions={{ handleClick : handleDashboardMenuClick }} graph={dashboard} />
      }
        
      </>
    )
  }


  export default DashboardPage
  