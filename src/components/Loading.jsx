
// caricamento font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loading = () => {      
    return (
        <div style={style}>
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    )
}

const style = {
    textAlign:'center'
}

export default Loading;
