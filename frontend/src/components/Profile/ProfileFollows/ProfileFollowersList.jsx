import { useState } from "react";
import "./ProfileFollowsList.css"
import FollowListItem from "./ProfileFollowListItem";


const ProfileFollowerList = ({ closeFollowersModal , followers }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            closeFollowersModal()
        }, 300); 
    };

     return (
        <div className={`profile-follows-modal ${isVisible ? '' : 'leave'}`} onClick={handleClose}>
            <div className={`profile-follows-container ${isVisible ? '' : 'leave'}`} onClick={(e) => e.stopPropagation()}>
                <ul className="profile-follow-list">
                    {followers.map(user => {
                        return (
                           <FollowListItem key={user._id} user={user}/>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}


export default ProfileFollowerList