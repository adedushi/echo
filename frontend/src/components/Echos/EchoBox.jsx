import "./EchoBox.css"
import waveform from './waveform.png'

function EchoBox({ echo: { text, author, imageUrls } }) {
    const { username, profileImageUrl } = author;
    const images = imageUrls?.map((url, index) => {
        return <img className="echo-image" key={url} src={url} alt={`echoImage${index}`} />
    });
    return (
        <div className="echo-box">
            {profileImageUrl ?
                <img className="profile-image" src={profileImageUrl} alt="profile" /> :
                undefined
                }
            {/* <p className="echo-username">{username}</p> */}
            <img src={waveform} className="echo-waveform"/>
            
            {/* <p className="echo-text">{text}</p> */}
            {/* {images} */}
        </div>
    );
}

export default EchoBox;