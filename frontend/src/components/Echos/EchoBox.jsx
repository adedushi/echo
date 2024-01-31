import WaveTest from '../Audio/EchoPlayer';
import './EchoBox.css';

function EchoBox({ echo: { _id, author, audioUrl, replies, likes, reverbs } }) {
    const { username, profileImageUrl } = author;
    return (
        <div className="echo-box">
            <div className="echo-content">
                {profileImageUrl ?
                    <img className="profile-image" src={profileImageUrl} alt="profile" /> :
                    undefined}
                <WaveTest index={_id} audioUrl={audioUrl}/>
            </div>
            <div className="echo-details">
                {replies === null ? null : <h3><i className="fa-solid fa-comment" id='reply-button'></i> {replies.length}</h3> }
                {likes === null ? null : <h3><i className="fa-solid fa-heart" id='like-button'></i> {likes.length}</h3>}
                {reverbs === null ? null : <h3><i className="fas fa-satellite-dish" id='reverb-button'></i> {reverbs.length}</h3>}
            </div>
        </div>
    );
}

export default EchoBox;