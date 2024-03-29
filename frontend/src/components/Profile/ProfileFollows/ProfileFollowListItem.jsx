import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import "./ProfileFollowsList.css"
import { follow, unFollow } from '../../../store/users';
import { useNavigate } from "react-router-dom";




const FollowListItem = ({ user, handleClose }) => {
    const navigate = useNavigate()
    const [isFollowing, setIsFollowing] = useState(false)
    const dispatch = useDispatch()
    let users = useSelector(state => state.users)
    let following = []
    if (users.currentUser) {
        following = users.currentUser.following
    }

    useEffect(() => {
        for (const followUser of following) {
            if (followUser._id === user._id) {
                setIsFollowing(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFollow = () => {
        if (isFollowing) {
            dispatch(unFollow(user._id))
            setIsFollowing(false)
        } else {
            dispatch(follow(user._id)) 
            setIsFollowing(true)
        }   
    }

    return (
        <li className='follow-list-item' key={user._id} >
            <div className="follow-list-img-username" onClick={() => {
                navigate(`/profile/${user._id}/echos`)
                handleClose()
            }}>
                <img className='follow-list-image' src={user.profileImageUrl  } alt="" />
                <p className='follow-list-username'>{user.username}</p>
            </div>
            <div className='profile-list-follow-button' onClick={() => handleFollow(user._id)} >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </div>
        </li>
    )
}

export default FollowListItem