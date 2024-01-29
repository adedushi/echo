import "./EchoBox.css"

function EchoBox({ echo: { text, author, imageUrls } }) {
    const { username, profileImageUrl } = author;
    const images = imageUrls?.map((url, index) => {
        return <img className="echo-image" key={url} src={url} alt={`echoImage${index}`} />
    });
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
            {images}
        </div>
    );
}

export default EchoBox;