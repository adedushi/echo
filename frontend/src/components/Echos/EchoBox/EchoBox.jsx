import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WaveTest from '../../Audio/EchoPlayer';
import './EchoBox.css';
import { destroyEcho, updateEchoTitle } from '../../../store/echos';

function EchoBox({ echo: { _id, author, audioUrl, replies, likes, reverbs, title } }) {
    const { username, profileImageUrl } = author;
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const handleDeleteEcho = (e) => {
        e.preventDefault();
        dispatch(destroyEcho(_id));
    };

    const handleEditEcho = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateEchoTitle(_id, editedTitle));
        setIsEditing(false);
    };

    return (
        <div className="echo-box">
            <div className="echo-content">
                {profileImageUrl ?
                    <img className="profile-image" src={profileImageUrl} alt="profile" /> :
                    undefined}
                <WaveTest index={_id} audioUrl={audioUrl} />
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={editedTitle} onChange={handleTitleChange} autoFocus />
                        <button type="submit">Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                ) : (
                    <div>
                        <span>{title}</span>
                        {currentUser._id === author._id && (
                            <button onClick={handleEditEcho}><i className="fa-regular fa-pen-to-square"></i></button>
                        )}
                    </div>
                )}
            </div>
            <div className="echo-details">

                {replies === null ? null : <h3><i className="fa-solid fa-comment" id='reply-button'></i> {replies.length}</h3> }
                {likes === null ? null : <h3><i className="fa-solid fa-heart" id='like-button'></i> {likes.length}</h3>}
                {reverbs === null ? null : <h3><i className="fas fa-satellite-dish" id='reverb-button'></i> {reverbs.length}</h3>}
                {currentUser._id === author._id && (
                    <h3 onClick={handleDeleteEcho}><i className="fa-regular fa-trash-can" data-value={_id}></i></h3>
                )}
            </div>
        </div>
    );
}

export default EchoBox;
