import { useState } from "react";
import "./ProfileFollowsList.css"
import FollowListItem from "./ProfileFollowListItem";



const ProfileFollowingList = ({ closeFollowingModal , following}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            closeFollowingModal()
        }, 300); 
    };



     return (
        <div className={`profile-follows-modal ${isVisible ? '' : 'leave'}`} onClick={handleClose}>
            <div className={`profile-follows-container ${isVisible ? '' : 'leave'}`} onClick={(e) => e.stopPropagation()}>
                <ul className="profile-follow-list">
                    {following.map(user => {
                        return (
                            <FollowListItem key={user._id} user={user} handleClose={handleClose}/>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}


export default ProfileFollowingList




