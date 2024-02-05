import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, fetchEchos, selectAllEchosArray } from '../../../store/echos';
import EchoBox from '../EchoBox/EchoBox';
import './Echos.css';
import { fetchCurrentUser } from '../../../store/users';
import EchoReplies from '../EchoReplies/EchoReplies';

function Echos() {
    const dispatch = useDispatch();
    const echos = useSelector(selectAllEchosArray);
    const userId = useSelector(state => state.session.user._id)
    const [showReplies, setShowReplies] = useState(false)
    const [selectedEcho, setSelectedEcho] = useState()

    useEffect(() => {
        dispatch(fetchEchos());
        return () => dispatch(clearEchoErrors());
    }, [dispatch])

    // useEffect(() => {
    //     const showMyTheEchos = () => {
    //         let mainEchos = document.getElementById('mainEchoContainer')
    //         mainEchos.style.visibility = 'visible';
    //     }
    //     const delayTime =   1000;
    //     const delayTimeID = setTimeout(showMyTheEchos, delayTime);
    //     return () => clearTimeout(delayTimeID);
    // })
    // const currentUser = useSelector(state => state.users.currentUser);
    useEffect(() => {
        if (userId) {
            dispatch(fetchCurrentUser(userId));
        }
    }, [userId, dispatch]);
    if (echos.length === 0) return <div>There are no Echos</div>;

    const echoBoxProps = {
        setSelectedEcho,
        setShowReplies,
        selectedEcho
    }
    
    return (
        <>
        {/* <div id='mainEchoContainer' style={{ visibility: 'hidden' }}> */}
        <div className={showReplies ? 'echos-container-with-replies' : 'echo-container'}>
            <div className={showReplies ? 'echo-list-with-replies' : 'echo-list'}>
                {echos.map(echo => (
                    <EchoBox key={echo._id} echo={echo} echoBoxProps={echoBoxProps} />
                ))}
            </div>
            {showReplies && <EchoReplies echo={selectedEcho} setShowReplies={setShowReplies}/>}
        </div>
        {/* </div> */}
        </>
    );
}


 

export default Echos;