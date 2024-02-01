import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEchos, clearEchoErrors, selectUserEchosArray } from '../../store/echos';
import EchoBox from '../Echos/EchoBox/EchoBox';
import "./Profile.css"
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { fetchProfileUser } from '../../store/users';

export const Feed = ({ feedType }) => {
    const dispatch = useDispatch();
    const { userId } = useParams(); 
    const userEchos = useSelector(selectUserEchosArray);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserEchos(userId, feedType));
        }
        return () => dispatch(clearEchoErrors());
    }, [userId, feedType, dispatch]);

    if (!userEchos.length) {
        return <div>No content available.</div>;
    }

    return (
        <div>
            {userEchos.map((echo, index) => (
                <EchoBox
                    key={`${echo._id}-${index}-${echo.wasReverb}`}
                    echo={echo}
                />
            ))}
        </div>
    );
}


const Profile = () => {
    // const currentUser = useSelector(state => state.session.user);
    const profileUser = useSelector(state => state.users.profileUser);
    const { userId } = useParams(); 
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            dispatch(fetchProfileUser(userId));
        }
    }, [userId, dispatch]);

    return (
        <div className="profile-page">
            <div className="profile-header">
                {profileUser? <img src={profileUser.profileImageUrl} className="profile-image-large"/> : null}
                {profileUser? <h1>{profileUser.username}</h1> : null}
            </div>
            <div className="profile-nav">
                <NavLink
                    to={`echos`}
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Echos
                </NavLink>

                <NavLink
                    to={`likes`}
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Likes
                </NavLink>

                <NavLink
                    to={`reverbs`}
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Reverbs
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default Profile;