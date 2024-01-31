import { useDispatch, useSelector } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import { useNavigate } from 'react-router';


function NavBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.user);

    const logoutUser = e => {
        e.preventDefault();
        dispatch(logout());
        navigate('/')
    };
    const navToHome = (e) => {
        e.preventDefault();
        navigate('/echos')
    }

    const navToProfile = (e) => {
        e.preventDefault();
        navigate(`/profile/${currentUser._id}`)
    }

    const navToCreate = (e) => {
        e.preventDefault();
        navigate('/echos/new');
    }

    const navToAbout = (e) => {
        e.preventDefault();
        navigate('/about');
    }

    return (
        <>
        <div id='navContainer'>
            <h1 onClick={navToHome}>Echo</h1>
            {/* {getLinks()} */}
            <div className="links-nav-bar">
                        <div className='navButtonWrapper' onClick={navToHome}>
                            <i id='homeIcon' className="fa-solid fa-house"></i>
                            <h2 className='navButtonText'>Home</h2>
                        </div>

                        <div className='navButtonWrapper' onClick={navToProfile}>
                            <i id='profileIcon' className="fa-regular fa-user"></i>
                            <h2 className='navButtonText'>Profile</h2>
                        </div>

                        <div className='navButtonWrapper' onClick={navToCreate}>
                            <i id='recordIcon' className="fa-solid fa-file-audio"></i>
                            <h2 className='navButtonText'>Create</h2>
                        </div>

                        <div className='navButtonWrapper' onClick={navToAbout}>
                            <h2 id='logoutText' className='navButtonText'>About</h2>
                        </div>
            </div>
            <div className='navButtonWrapper' onClick={logoutUser}>
                <h2 id='logoutText' className='navButtonText'>Logout</h2>
                <i id='logoutIcon' className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
        </div>
        </>
    );
}

export default NavBar;