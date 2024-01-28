import "./EchoBox.css"

function EchoBox({ echo: { text, author } }) {
    const { username } = author;
    return (
        <div className="echo">
            <h3>{username}</h3>
            <p>{text}</p>
        </div>
    );
}

export default EchoBox;