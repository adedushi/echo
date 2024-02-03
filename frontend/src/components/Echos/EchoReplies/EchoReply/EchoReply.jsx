import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import WaveTest from '../../../Audio/EchoPlayer';
import './EchoReply.css';
// import { follow, unFollow } from '../../../../store/users';
import { addReplyLike, removeReplyLike } from '../../../../store/echos';


const EchoReply = ({ reply, deleteReply, echoId }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    // const [isFollowing, setIsFollowing] = useState(false)
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [showFollow, setShowFollow] = useState(false)
    const [isComment, setIsComment] = useState(false)
    const followedUsers = useSelector(state => {
        if (state.users.currentUser) {
            return state.users.currentUser.following
        }
    })
    const [isLiked, setIsLiked] = useState(false)
    
    const {replyAuthor, replyAudioUrl, replyLikes, _id} = reply
    const authorId = replyAuthor._id
    const authorName = replyAuthor.username
    const profileImageUrl = replyAuthor.profileImageUrl
    const currentUserId = sessionUser._id

    useEffect(() => {
        if (currentUserId === authorId) {
            setIsOwner(true)
        }
        if (reply.replyText) {
            setIsComment(true)
        }
    }, [])

     useEffect(() => {
        for (const like of replyLikes) {
            if (currentUserId === like) {
                setIsLiked(true)
            }
        }
        // if (followedUsers) {
        //     for (const user of followedUsers) {
        //         if (user._id === replyAuthor._id) {
        //             setIsFollowing(true)
        //         }
        //     }
        // }
    }, [followedUsers, replyAuthor._id, replyLikes, currentUserId])
    

    const handleDeleteReply = () => {
        deleteReply(_id)
        // dispatch(removeEchoReply(echoId, _id))
        setConfirmDelete(false)
    }

    const handleLike = () => {
        if (!isLiked) {
            dispatch(addReplyLike(echoId, _id))
            setIsLiked(true)
        } else {
            dispatch(removeReplyLike(echoId, _id))
            setIsLiked(false)
        }
    }

    const handleMouseEnter = (e) => {
        if (e.target.id === 'like-button') {
            setIsLikeHovered(true);
        } 
    }

    const handleMouseLeave = (e) => {
        if (e.target.id === 'like-button') {
            setIsLikeHovered(false);
        } 
    }

    // const handleFollow = () => {
    //     if (!isFollowing) {
    //        dispatch(follow(replyAuthor._id)) 
    //        setIsFollowing(true)
    //     } else {
    //         dispatch(unFollow(replyAuthor._id))
    //         setIsFollowing(false)
    //     }
    // }

    if (!isComment) {
        return (
            <div className='reply-root-parent'>
            <div className="reply-box" >
                <div className="reply-content" >
                        {profileImageUrl && <img className="reply-profile-image" src={profileImageUrl} alt="profile" onClick={() => navigate(`/profile/${authorId}/echos`)} onMouseEnter={() => setShowFollow(true)} /> }
                        {/* {showFollow && 
                        <div className='reply-follow-modal' onClick={handleFollow} onMouseLeave={() => setShowFollow(false)}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </div>
                        } */}
                    <WaveTest index={_id} audioUrl={replyAudioUrl} />
                    <h3><i className={`${isLiked ? 'fa-solid' : (isLikeHovered ? 'fa-solid' : 'fa-regular')} fa-heart`} id='like-button' onClick={handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ opacity: isLikeHovered && isLiked ? 0.7 : 1 }}></i>{replyLikes.length}</h3>
                </div>
            </div>
           <div className="reply-details">
                <p className='reply-username' onClick={() => navigate(`/profile/${authorId}/echos`)}>@{authorName}</p>
                <div className='delete-icon'>
                    {isOwner && !confirmDelete && <i className="fa-regular fa-trash-can" onClick={() => setConfirmDelete(true)}></i>}
                    {isOwner && confirmDelete && <i className="fa-solid fa-check" data-value={_id} onClick={handleDeleteReply}></i>}
                </div>
            </div> 
            </div>
        )
    } else {
        return (
            <div className='reply-root-parent'>
            <div className="reply-comment-box" onMouseEnter={() => setShowFollow(true)} onMouseLeave={() => setShowFollow(false)}>
                <div className="reply-content" >
                        {profileImageUrl && <img className="reply-profile-image" src={profileImageUrl} alt="profile" onClick={() => navigate(`/profile/${authorId}/echos`)} /> }
                        {/* {showFollow && 
                        <div className='reply-follow-modal' onClick={handleFollow} >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </div>
                        } */}
                     {isComment && <p className='reply-list-comment'>{reply.replyText}</p>}
                    <h3><i className={`${isLiked ? 'fa-solid' : (isLikeHovered ? 'fa-solid' : 'fa-regular')} fa-heart`} id='like-button' onClick={handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ opacity: isLikeHovered && isLiked ? 0.7 : 1 }}></i> {replyLikes.length}</h3>
                </div>
            </div>
           <div className="reply-details">
                <p className='reply-username' onClick={() => navigate(`/profile/${authorId}/echos`)}>@{authorName}</p>
                <div className='delete-icon'>
                    {isOwner && !confirmDelete && <i className="fa-regular fa-trash-can" onClick={() => setConfirmDelete(true)}></i>}
                    {isOwner && confirmDelete && <i className="fa-solid fa-check" data-value={_id} onClick={handleDeleteReply}></i>}
                </div>
            </div> 
            </div>
        )
       
    }
}

export default EchoReply