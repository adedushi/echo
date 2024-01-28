import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, fetchEchos, selectAllEchosArray } from '../../store/echos';
import EchoBox from './EchoBox';

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
            <h2>All Echos</h2>
            {echos.map(echo => (
                <EchoBox key={echo._id} echo={echo} />
            ))}
        </>
    );
}

export default Echos;