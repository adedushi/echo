import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, composeEcho } from '../../store/echos';
import EchoBox from './EchoBox';
import './EchoCompose.css';
import EchoRecorder from './EchoRecorder';

function EchoCompose() {

    const [title, setTitle] = useState('');
    const dispatch = useDispatch();
    const author = useSelector(state => state.session.user);
    const errors = useSelector(state => state.errors.echos);
    const fileRef = useRef(null);
    const [audio, setAudio] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showUpload, setShowUpload] = useState(false)
    const [showRecord, setShowRecord] = useState(true)
    const [showSubmit, setShowSubmit] = useState(false)
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    useEffect(() => {
        if (audio && audioUrl && title) {
            setShowSubmit(true)
        } else {
            setShowSubmit(false)
        }
    }, [audio, audioUrl, title])

    const handleSubmit = e => {
        if (title.length < 5) {
            alert('Title must be at least 5 character')
        }
        e.preventDefault();
        dispatch(composeEcho(title, audio));
        clearFile()
        setTitle('');
    };

    const updateTitle = e => {
        setTitle(e.currentTarget.value)
        
    };

    const clearFile = () => {
        setAudio(null);
        setAudioUrl(null);
        setShowSubmit(false)
        setFileName('')
        if (fileRef.current) {
            fileRef.current.value = null
        }
    }

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

    const clickRecord = () => {
        setShowRecord(true)
        setShowUpload(false)
    }

    const clickUpload = () => {
        setShowRecord(false)
        setShowUpload(true)
    }

    const handleUploadClick = () => {
        fileRef.current.click();
    };

    
    return (
        <div className="create-echo-container">
            <form className="create-echo-form" onSubmit={handleSubmit}>
                <div className="errors">{errors?.title}</div>
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
                <div className='create-buttons'>
                    <button className="upload-button" type="button" onClick={clickUpload}>upload</button>
                    <button className="record-button" type="button" onClick={clickRecord}>record</button>
                    <button className="clear-button" type="button" onClick={clearFile}>Clear</button>
                </div>
                <div className="">
                    {(audioUrl !== null) ?
                        <EchoBox echo={{ title, author, audioUrl, replies: null, likes: null, reverbs: null }} /> :
                        undefined}
                </div>
                {showSubmit && <button className="submit-button" type="submit">Submit</button>}
            </form>
        </div>
    )
}

export default EchoCompose;
