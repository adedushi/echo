import WaveTest from '../Audio/EchoPlayer';

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
                <h3><i className="fa-regular fa-comment"></i> {replies.length}</h3>
                <h3><i className="fa-regular fa-heart"></i> {likes.length} </h3>
                <h3><i className="fa-solid fa-satellite-dish"></i> {reverbs.length} </h3>
            </div>
        </div>
    );
}

export default EchoBox;