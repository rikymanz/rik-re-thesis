// caricamento font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


// Semplice componente con sola icona presa da Font Awesome - Icona di caricamento che ruota

function Loading(  ){  
    
    const style = {
        textAlign:'center',
        paddingTop: 250,
        fontSize:50,
        verticalAlign:'top'
    }

    return (
        <div style={style}>
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    )
}


export default Loading;
