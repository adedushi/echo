import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom"
import WaveTest from '../../Audio/EchoPlayer';
import './EchoBox.css';
import { addEchoLike, addReverb, destroyEcho, removeEchoLike, removeReverb, updateEchoTitle } from '../../../store/echos';
import { follow, unFollow } from '../../../store/users';

function EchoBox({ echo, echoBoxProps }) {
    const {setSelectedEcho, setShowReplies, selectedEcho} = echoBoxProps
    const { _id, author, audioUrl, replies, likes, reverbs, title, wasReverb = false } = echo
    const { username, profileImageUrl } = author;
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const followedUsers = useSelector(state => {
        if (state.users.currentUser) {
            return state.users.currentUser.following
        }
    })

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [isLiked, setIsLiked] = useState(false)
    const [isReverbed, setIsReverbed] = useState(false)
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [isReverbHovered, setIsReverbHovered] = useState(false)
    const [closingModal, setClosingModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [showFollow, setShowFollow] = useState(false)
    const [page, setPage] = useState(null)
    const location = useLocation();

    
    useEffect(() => {
        const pathnameParts = location.pathname.split('/');
        const lastPart = pathnameParts[pathnameParts.length - 1];
        setPage(lastPart)
    }, [location])


    useEffect(() => {
        const currentUserId = sessionUser._id
        for (const like of likes) {
            if (currentUserId === like._id) {
                setIsLiked(true)
            }
        }
        for (const reverb of reverbs) {
            if (currentUserId === reverb._id) {
                setIsReverbed(true)
            }
        }
        if (followedUsers) {
            for (const user of followedUsers) {
                if (user._id === author._id) {
                    setIsFollowing(true)
                }
            }
        }
    }, [followedUsers, author._id, likes, reverbs, sessionUser._id])


    const handleMouseEnter = (e) => {
        if (e.target.id === 'like-button') {
            setIsLikeHovered(true);
        } 
        if (e.target.id === 'reverb-button') {
            setIsReverbHovered(true)
        }
    };

    const handleMouseLeave = (e) => {
        if (e.target.id === 'like-button') {
            setIsLikeHovered(false);
        } 
        if (e.target.id === 'reverb-button') {
            setIsReverbHovered(false)
        }
    };

    const handleLike = () => {
        if (!isLiked) {
            dispatch(addEchoLike(_id))
            setIsLiked(true)
        } else {
            dispatch(removeEchoLike(_id, page))
            setIsLiked(false)
        }
    }

    const handleReverb = () => {
        if (isReverbed) {
            dispatch(removeReverb(_id, page))
            setIsReverbed(false)
        } else {
            dispatch(addReverb(_id))
            setIsReverbed(true)
        }
    }

    const handleDeleteEcho = (e) => {
        e.preventDefault();
        setConfirmDelete(false)
        dispatch(destroyEcho(_id));
    };

    const handleEditEcho = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleSubmitNewTitle = (e) => {
        e.preventDefault();
        dispatch(updateEchoTitle(_id, editedTitle));
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setClosingModal(true)
        setConfirmDelete(false)
        setTimeout(() => {
            setIsEditing(false)
            setClosingModal(false)
        }, 300)
    }

    const handleFollow = () => {
        if (!isFollowing) {
           dispatch(follow(author._id)) 
           setIsFollowing(true)
        } else {
            dispatch(unFollow(author._id))
            setIsFollowing(false)
        }
    }

    const handleShowReplies = () => {
        setSelectedEcho(echo)
        setShowReplies(true)
    }

    // useEffect(() => {
    //     setSelectedEcho(echo)
    // }, [echo, setSelectedEcho])


    return (
        <div className={`echo-box`} id={selectedEcho ? selectedEcho._id === _id ? 'selected-echo' : '' : ''} onClick={handleShowReplies}  onMouseEnter={() => setShowFollow(true)} onMouseLeave={() => setShowFollow(false)}>
            <p className='echo-username' onClick={() => navigate(`/profile/${author._id}/echos`)}>@{username}</p>
            <h2 className='echo-title'>{title}</h2>
            <div className="echo-content" >
                    {profileImageUrl && <img className="profile-image" src={profileImageUrl} alt="profile" onClick={() => navigate(`/profile/${author._id}/echos`)} /> }
                    {showFollow && 
                    <div className='follow-modal' onClick={handleFollow} >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </div>
                    }
                <WaveTest index={`${_id}-${wasReverb}`} audioUrl={audioUrl} />

            </div>
            
            <div className="echo-details">
                <h3><i className="fa-solid fa-comment" id='reply-button' ></i> {replies.length}</h3>
                <h3><i className={`${isLiked ? 'fa-solid' : (isLikeHovered ? 'fa-solid' : 'fa-regular')} fa-heart`} id='like-button' onClick={handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ opacity: isLikeHovered && isLiked ? 0.7 : 1 }}></i> {likes.length}</h3>
                <h3><i className={`${isReverbed ? (isReverbHovered ? 'reverb-button-half' : 'reverb-button-full') : (isReverbHovered ? 'reverb-button-full' : 'reverb-button-half')} fas fa-satellite-dish`} id='reverb-button' onClick={handleReverb} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></i> {reverbs.length}</h3>
                {sessionUser._id === author._id && <button onClick={handleEditEcho}><i className="fa-regular fa-pen-to-square"></i></button>}
            </div>
           
            {isEditing &&
                    <div className={`edit-echo-title-modal ${closingModal ? 'edit-title-leave' : ''}`} onClick={handleCloseModal}>
                        <div className={`edit-echo-title-container ${closingModal ? 'edit-title-leave' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <form  className='edit-echo-title-form'>
                                <input type="text" value={editedTitle} onChange={handleTitleChange} autoFocus className='edit-title-input'/>
                                <div className='echo-edit-actions'>
                                    {!confirmDelete ? <i className="fa-regular fa-trash-can edit-trash-can" onClick={() => setConfirmDelete(true)}></i> : <i className="fa-solid fa-check edit-confirm" data-value={_id} onClick={handleDeleteEcho}></i>}
                                    <button type="submit" className='edit-title-submit' onClick={handleSubmitNewTitle}><i className="fa-solid fa-floppy-disk"></i></button>
                                    <i className="fa-solid fa-xmark cancel-edit-title" onClick={handleCloseModal}></i>
                                </div>
                            </form>
                        </div>
                    </div>}
        </div>
    );
}

export default EchoBox;
