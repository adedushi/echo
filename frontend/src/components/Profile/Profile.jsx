import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEchos, clearEchoErrors, selectUserEchosArray } from '../../store/echos';
import EchoBox from '../Echos/EchoBox/EchoBox';
import "./Profile.css"
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { fetchProfileUser } from '../../store/users';
import ProfileEchoReplies from '../Echos/EchoReplies/ProfileEchoReplies';
import ProfileFollowingList from './ProfileFollows/ProfileFollowingList';
import ProfileFollowerList from './ProfileFollows/ProfileFollowersList';

export const Feed = ({ feedType }) => {
    const dispatch = useDispatch();
    const { userId } = useParams(); 
    const userEchos = useSelector(selectUserEchosArray);
    // eslint-disable-next-line no-unused-vars
    const [showReplies, setShowReplies] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [selectedEcho, setSelectedEcho] = useState()
    
    const echoBoxProps = {
        setSelectedEcho,
        setShowReplies,
        selectedEcho
    }
    
    useEffect(() => {
        setShowReplies(false)
    }, [userId])

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
        <div className={showReplies ? 'profile-echos-container-with-replies' : 'profile-echo-container'}>
            <div className={showReplies ? 'profile-echo-list-with-replies' : 'profile-echo-list'}>
                {userEchos.map((echo, index) => (
                    <EchoBox
                        key={`${echo._id}-${index}-${echo.wasReverb}`}
                        echo={echo}
                        echoBoxProps={echoBoxProps}
                    />
                ))}
            </div>
            <div className='profile-replies'>
                {showReplies && <ProfileEchoReplies echo={selectedEcho} setShowReplies={setShowReplies} feedType={feedType}/>}
            </div>
        </div>
    );
}


const Profile = () => {
    // eslint-disable-next-line no-unused-vars
    const currentUser = useSelector(state => state.session.user);
    const profileUser = useSelector(state => state.users.profileUser);
    const { userId } = useParams(); 
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [activeNavLink, setActiveNavLink] = useState('');
    const [showFollowing, setShowFollowing] = useState(false)
    const [showFollowers, setShowFollowers] = useState(false)


    useEffect(() => {
        if (userId) {
            dispatch(fetchProfileUser(userId));
        }
    }, [userId, dispatch]);

    const handleNavLinkClick = (navLink) => {
        setIsLoading(true);
        setActiveNavLink(navLink);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const openFollowingModal = () => {
        setShowFollowing(true);
    };

    const openFollowersModal = () => {
        setShowFollowers(true);
    };

    const closeFollowingModal = () => {
        setShowFollowing(false);
    };

    const closeFollowersModal = () => {
        setShowFollowers(false);
    };

    

    return (
        <div className="profile-page">
            <div className='profile-header-nav'>
                <div className="profile-header">
                    {profileUser? <img src={profileUser.profileImageUrl} className="profile-image-large"/> : null}
                    {profileUser? <h1 className='profile-username-header'>@{profileUser.username}</h1> : null}
                </div>
                <div className="profile-nav">
                    <NavLink
                        to={!isLoading ? `echos` : '#'}
                        className={`profile-nav-link ${activeNavLink === 'echos' ? 'profile-nav-link-active' : ''}`}
                        onClick={() => !isLoading && handleNavLinkClick('echos')}
                    >
                        Echos
                    </NavLink>

                    <NavLink
                        to={!isLoading ? `likes` : '#'}
                        className={`profile-nav-link ${activeNavLink === 'likes' ? 'profile-nav-link-active' : ''}`}
                        onClick={() => !isLoading && handleNavLinkClick('likes')}
                    >
                        Likes
                    </NavLink>

                    <NavLink
                        to={!isLoading ? `reverbs` : '#'}
                        className={`profile-nav-link ${activeNavLink === 'reverbs' ? 'profile-nav-link-active' : ''}`}
                        onClick={() => !isLoading && handleNavLinkClick('reverbs')}
                    >
                        Reverbs
                    </NavLink>

                    <NavLink
                        to={'#'}
                        className={`profile-nav-link`}
                        onClick={openFollowingModal}
                    >
                        Following
                    </NavLink>

                    <NavLink
                        to={'#'}
                        className={`profile-nav-link`}
                        onClick={openFollowersModal}
                    >
                        Followers
                    </NavLink>
                </div>
            </div>
            {showFollowing && <ProfileFollowingList following={profileUser.following} closeFollowingModal={closeFollowingModal}/>}
            {showFollowers && <ProfileFollowerList followers={profileUser.followers} following={profileUser.following} closeFollowersModal={closeFollowersModal}/>}
            <Outlet />
        </div>
    );
}

export default Profile;