import { useState } from 'react';

import DashboardMenu from '../components/DashboardMenu';
import DashboardGraphs from '../components/DashboardGraphs';

function DashboardPage() {

    const [dashboard,setDashboard] = useState(0)

    const handleDashboardMenuClick = ( id ) => {
        setDashboard( id )
    }

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
  