import { useDispatch, useSelector } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import EchoCompose from '../Echos/EchoCompose/EchoCompose';


function NavBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.user);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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

    // const navToCreate = (e) => {
    //     e.preventDefault();
    //     navigate('/echos/new');
    // }

    const navToAbout = (e) => {
        e.preventDefault();
        navigate('/about');
    }

    return (
        <>
       {isModalOpen && <EchoCompose onClose={closeModal} />}
        <div className='nav-container'>
            {/* {getLinks()} */}
            <div className="links-nav-bar">
                <h1 className="nav-header" onClick={navToHome}>Echo</h1>
                <div className='navButtonWrapper' onClick={navToHome}>
                    <i className="fa-solid fa-house nav-icon"></i>
                    <h2 className='navButtonText'>Home</h2>
                </div>

                <div className='navButtonWrapper' onClick={navToProfile}>
                    <i className="fa-solid fa-user nav-icon"></i>
                    <h2 className='navButtonText'>Profile</h2>
                </div>

                <div className='navButtonWrapper create-button' onClick={openModal}>
                    <i className="fa-solid fa-file-audio nav-icon"></i>
                    <h2 className='navButtonText'>Create</h2>
                </div>
            </div>
            <div className='links-nav-bar secondary-nav-links'>
                <div className='navButtonWrapper' onClick={navToAbout}>
                    <i className="fa-solid fa-circle-info nav-icon"></i>
                    <h2 className='navButtonText logout-text'>About</h2>
                </div>
                <div className='navButtonWrapper' onClick={logoutUser}>
                    <i className="fa-solid fa-arrow-right-from-bracket nav-icon"></i>
                    <h2 className='navButtonText logout-text'>Logout</h2>
                </div>
            </div>
        </div>
        </>
    );
}

export default NavBar;