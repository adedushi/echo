import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEchoReply, clearEchoErrors } from '../../../store/echos';
import './ReplyCompose.css';
import EchoRecorder from '../EchoRecorder/EchoRecorder';
import ReplyPreview from './ReplyPreview/ReplyPreview';

function ReplyCompose({ echoId, scrollToBottom}) {
    // const echoId = '65ba730da50d777ab5531d43'
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const [audio, setAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showRecord, setShowRecord] = useState(false)
    const [showComment, setShowComment] = useState(true)

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    const clearAudio = () => {
        setAudio(null)
        setAudioUrl(null)
    }

    const handleSubmit = () => {
        if (comment || audio) {
            dispatch(addEchoReply(echoId, comment, audio))
        } 
        setComment('');
        clearAudio();
        setTimeout(() => scrollToBottom(), 500)
    };

    const updateComment = e => {
        setComment(e.currentTarget.value)
        
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && event.metaKey) {
            handleSubmit();
        }
    };

    const handleShowRecord = () => {
        setShowRecord(true)
        setShowComment(false)
    }

    const handleShowComment = () => {
        setShowRecord(false)
        setShowComment(true)
        clearAudio()
    }
    
    return (
        <div className="create-reply-container">
            <form className="create-reply-form" onSubmit={handleSubmit}>
                {(audioUrl !== null) && <ReplyPreview audioUrl={audioUrl} /> }
                {showRecord && <EchoRecorder setAudio={setAudio} setAudioUrl={setAudioUrl} />}
                {showRecord && <div className='record-options'>
                    <i className="fa-solid fa-trash trash-icon" onClick={clearAudio}></i>
                    <i className="fa-solid fa-paper-plane send-icon" onClick={handleSubmit}></i>
                    <i className="fa-solid fa-comment" onClick={handleShowComment}></i>
                </div>}
                {showComment && <div className='reply-container'>
                    <div className='record-icon-container' onClick={handleShowRecord}>
                        <i className="fa-solid fa-microphone record-icon"></i>
                    </div>
                    <div className='reply-comment'>
                        <textarea
                            type="text"
                            value={comment}
                            onChange={updateComment}
                            placeholder="Add a comment"
                            required
                            className="reply-input"
                            style={{ height: '50px' }}
                            onKeyDown={handleKeyDown}
                        />
                        <i className="fa-solid fa-reply reply-icon" onClick={handleSubmit}></i>
                    </div>
                </div>}
            </form>
            {showComment && <p className='reply-instructions'>⌘ + Return to post comment</p>}
        </div>
    )
}

export default ReplyCompose;
