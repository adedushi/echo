import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, fetchEchos, selectAllEchosArray } from '../../../store/echos';
import EchoBox from '../EchoBox/EchoBox';
import './Echos.css';
import { fetchCurrentUser } from '../../../store/users';

function Echos() {
    const dispatch = useDispatch();
    const echos = useSelector(selectAllEchosArray);
    const userId = useSelector(state => state.session.user._id)

    useEffect(() => {
        dispatch(fetchEchos());
        return () => dispatch(clearEchoErrors());
    }, [dispatch])

    useEffect(() => {
        const showMyTheEchos = () => {
            let mainEchos = document.getElementById('mainEchoContainer')
            mainEchos.style.visibility = 'visible';
        }

        const delayTime =   1000;
        const delayTimeID = setTimeout(showMyTheEchos, delayTime);

        return () => clearTimeout(delayTimeID);
    })

    const current = useSelector(state => state.users.currentUser);
    useEffect(() => {
        if (userId) {
            dispatch(fetchCurrentUser(userId));
        }
    }, [userId, dispatch]);


    if (echos.length === 0) return <div>There are no Echos</div>;

    return (
        <>
        <div id='mainEchoContainer' style={{ visibility: 'hidden' }}>
        <div className="echos-container">
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