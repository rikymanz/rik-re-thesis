import { useSelector , useDispatch } from 'react-redux';

import Loading from './../components/Loading';

import {
  initData,
  selectData,
  selectStatus,
} from './../features/data/dataSlice'

function HomePage() {

  const dispatch = useDispatch()
  const data = useSelector( selectData )
  const status = useSelector( selectStatus )

  const handleInit = () => {
    dispatch( initData() )
  }

  return (
    <>
      <div>

          {
            ( status === 'idle' && !data ) &&
            <button onClick={() => handleInit()}>
              Init
          </button>
          }

          {
            ( status === 'idle' && data ) &&
            <div>Dati valorizzati</div>
          }

          {
            ( status === 'loading' ) &&
            <Loading />
          }
          
      </div>

    </>
  )
}

export default HomePage
