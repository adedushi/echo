import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, fetchEchos, selectAllEchosArray } from '../../store/echos';
import EchoBox from './EchoBox';
import './Echos.css';

function Echos() {
    const dispatch = useDispatch();
    const echos = useSelector(selectAllEchosArray);

    useEffect(() => {
        dispatch(fetchEchos());
        return () => dispatch(clearEchoErrors());
    }, [dispatch])

    if (echos.length === 0) return <div>There are no Echos</div>;

    return (
        <>
        <div id='mainEchoContainer'>
        <div className="echos-container">
            <div className='topEchoNav'>
                    <h1>Your Feed Here</h1>
            </div>
            <div className="echos-list">
                {echos.map(echo => (
                    <EchoBox key={echo._id} echo={echo} />
                ))}
            </div>
        </div>
        </div>
        </>
    );
}

export default Echos;