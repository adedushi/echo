import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEchos, clearEchoErrors, selectUserEchosArray } from '../../store/echos';
import EchoBox from '../Echos/EchoBox';

function Profile() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    const userEchos = useSelector(selectUserEchosArray);

    useEffect(() => {
        dispatch(fetchUserEchos(currentUser._id));
        return () => dispatch(clearEchoErrors());
    }, [currentUser, dispatch]);

    if (userEchos.length === 0) {
        return <div>{currentUser.username} has no Echos</div>;
    } else {
        return (
            <>
                <h2>All of {currentUser.username}&apos;s Echos</h2>
                {userEchos.map(echo => (
                    <EchoBox
                        key={echo._id}
                        echo={echo}
                    />
                ))}
            </>
        );
    }
}

export default Profile;