import "./EchoBox.css"

function EchoBox({ echo: { text, author } }) {
    const { username, profileImageUrl } = author;
    return (
        <div className="echo">
            <h3>
                {profileImageUrl ?
                    <img className="profile-image" src={profileImageUrl} alt="profile" /> :
                    undefined
                }
                {username}
            </h3>
            <p>{text}</p>
        </div>
    );
}

export default EchoBox;