import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import WaveTest from '../../../Audio/EchoPlayer';
import './EchoReply.css';


const EchoReply = ({reply}) => {
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user);
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    
    const {replyAuthor, replyAudioUrl, replyLikes, _id} = reply
    const authorId = replyAuthor.id
    const authorName = replyAuthor.username
    const profileImageUrl = replyAuthor.profileImageUrl
    const likes = replyLikes.length

    useEffect(() => {
        if (sessionUser._id === authorId) {
            setIsOwner(true)
        }
    }, [])
    

    const handleDeleteReply = () => {

    }

    const handleLike = () => {

    }

    return (
        <div className="reply-box">
            <p className='reply-username' onClick={() => navigate(`/profile/${authorId}/echos`)}>@{authorName}</p>
            <div className="reply-content" >
                    {profileImageUrl && <img className="reply-profile-image" src={profileImageUrl} alt="profile" onClick={() => navigate(`/profile/${authorId}/echos`)} /> }
                    {showFollow && 
                    <div className='follow-modal' onClick={handleFollow} >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </div>
                    }
                <WaveTest index={_id} audioUrl={replyAudioUrl} />
            </div>
            <div className="reply-details">
                {/* <h3><i className={`${isLiked ? 'fa-solid' : (isLikeHovered ? 'fa-solid' : 'fa-regular')} fa-heart`} id='like-button' onClick={handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ opacity: isLikeHovered && isLiked ? 0.7 : 1 }}></i> {likes.length}</h3> */}
                {/* {isOwner && !confirmDelete && <i className="fa-regular fa-trash-can" onClick={() => setConfirmDelete(true)}></i>} */}
                {/* {isOwner && confirmDelete && <i className="fa-solid fa-check" data-value={_id} onClick={handleDeleteReply}></i>} */}
            </div>
        </div>
    )
}

export default EchoReply