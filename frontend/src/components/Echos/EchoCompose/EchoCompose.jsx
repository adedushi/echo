import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearEchoErrors, composeEcho } from '../../../store/echos';
import './EchoCompose.css';
import EchoRecorder from '../EchoRecorder/EchoRecorder';
import ReplyPreview from '../ReplyCompose/ReplyPreview/ReplyPreview';

function EchoCompose({ onClose }) {
    
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();
    // const author = useSelector(state => state.session.user);
    // const errors = useSelector(state => state.errors.echos);
    const [errors, setErrors] = useState([])
    const fileRef = useRef(null);
    const [audio, setAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showUpload, setShowUpload] = useState(false)
    const [showRecord, setShowRecord] = useState(true)
    const [fileName, setFileName] = useState('')

    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
        onClose();
        }, 300); 
    };

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    const handleSubmit = e => {
        if (title.length < 5) {
            setErrors(['Title must be at least 5 character'])
            // alert('Title must be at least 5 character')
            return
        }
        if (!audio) {
            setErrors(['Record or upload an echo'])
            // alert('Record or upload an echo')
            return
        }
        e.preventDefault();
        dispatch(composeEcho(title, audio));
        handleClose()
        clearFile()
    };

    const updateFile = async e => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name)
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                if (audio.duration <= 30) {
                    setAudio(file);
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        setAudioUrl(fileReader.result);
                    };
                } else {
                    clearFile()
                }
            };
        } else {
            clearFile()
        }
    }

    const handleShowRecord = () => {
        setShowRecord(true)
        setShowUpload(false)
    }

    const handleShowUpload = () => {
        setShowRecord(false)
        setShowUpload(true)
    }

    const handleUploadClick = () => {
        fileRef.current.click();
    };

    const clearAudio = () => {
        setAudio(null)
        setAudioUrl(null)
        setTitle('')
    }

    const updateTitle = e => {
        setTitle(e.currentTarget.value)
        
    };

    const clearFile = () => {
        setAudio(null);
        setAudioUrl(null);
        setFileName('')
        setTitle('')
        if (fileRef.current) {
            fileRef.current.value = null
        }
    }
    
    return (
        <div className={`echo-create-modal ${isVisible ? '' : 'leave'}`} onClick={handleClose}>
            <div className={`create-echo-container ${isVisible ? '' : 'leave'}`} onClick={(e) => e.stopPropagation()}>
                <form className="create-echo-form" >
                    
                {showUpload && <div className='upload-file' onClick={handleUploadClick}>
                        <i className="fa-solid fa-file-arrow-up"></i>
                        <input
                            type="file"
                            ref={fileRef}
                            accept=".wav, .mp3, .mp4, .aac"
                            onChange={updateFile}
                            className="file-input" 
                        />
                    </div>}
                    {showRecord && <EchoRecorder setAudio={setAudio} setAudioUrl={setAudioUrl} />}
                    {fileName ? <p className='file-name'>{fileName}</p> : ""}
                    <input
                        type="text"
                        value={title}
                        onChange={updateTitle}
                        placeholder="Give your echo a title..."
                        required
                        className="title-input"
                        minLength={5}
                    />
                    <div className="errors">{errors}</div>
                    {showRecord && <div className='record-options'>
                        <i className="fa-solid fa-trash trash-icon" onClick={clearAudio}></i>
                        <i className="fa-solid fa-paper-plane send-icon" onClick={handleSubmit}></i>
                        <i className="fa-solid fa-file-arrow-up" onClick={handleShowUpload}></i>
                    </div>}
                    {showUpload && <div className='record-options'>
                        <i className="fa-solid fa-trash trash-icon" onClick={clearAudio}></i>
                        <i className="fa-solid fa-paper-plane send-icon" onClick={handleSubmit}></i>
                        <i className="fa-solid fa-microphone" onClick={handleShowRecord}></i>
                    </div>}
                    
                    <div className="" onClick={(e) => e.preventDefault()}>
                        {(audioUrl !== null) && <ReplyPreview audioUrl={audioUrl}  /> }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EchoCompose;
