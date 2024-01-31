import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEchos, clearEchoErrors, selectUserEchosArray } from '../../store/echos';
import EchoBox from '../Echos/EchoBox/EchoBox';
import "./Profile.css"
import { useParams } from 'react-router-dom';

function Profile() {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    let {profileUserId} = useParams();
    const userEchos = useSelector(selectUserEchosArray);
    const [feed, setFeed] = useState("profileFeed")

    useEffect(() => {
        dispatch(fetchUserEchos(currentUser._id, feed));
        return () => dispatch(clearEchoErrors());
    }, [currentUser, feed, dispatch]);

    const handleMenuClick = e => {
        e.preventDefault()
        setFeed(e.target.getAttribute('data-value'))
    }

    if (userEchos.length === 0) {
        return <div>{currentUser.username} has no Echos</div>;
        
    } else {
        return (
            <div className="profile-page">
                <div className="profile-header">
                    <img src={currentUser.profileImageUrl} className="profile-image-large"/>
                    <h1>{currentUser.username}</h1>
                </div>
                <menu className="profile-feed-links">
                    <h1 onClick={handleMenuClick} data-value="profileFeed">Echos</h1>
                    <h1 onClick={handleMenuClick} data-value="likes">Likes</h1>
                    <h1 onClick={handleMenuClick} data-value="reverbs">Reverbs</h1>
                </menu>
                {userEchos.map((echo, index) => (
                    <EchoBox
                        key={`${echo._id}-${feed}-${index}-${echo.wasReverb}`}
                        echo={echo}
                        feed={feed}
                    />
                ))}
            </div>
        );
    }
}

export default Profile;