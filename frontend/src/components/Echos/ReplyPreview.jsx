import WaveTest from '../Audio/EchoPlayer';
import "./ReplyPreview.css"

function ReplyPreview({ audioUrl }) {
    return (
        <div className="reply-preview-box">
            <div className="reply-preview-content">
                <WaveTest index={0} audioUrl={audioUrl} />
            </div>
        </div>
    );
}

export default ReplyPreview;