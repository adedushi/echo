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
        console.log('in handle submit')
        e.preventDefault();
        dispatch(composeEcho(title, audio));
        clearFile()
        setTitle('');
    };

    const updateTitle = e => setTitle(e.currentTarget.value);

    const clearFile = () => {
        setAudio(null);
        setAudioUrl(null);
        setShowSubmit(false)
        if (fileRef.current) {
            fileRef.current.value = null
        }
    }

    const updateFile = async e => {
        const file = e.target.files[0];
        if (file) {
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
                    alert("Please upload an audio file less than 30 seconds long.");
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

    
    return (
        <div className="">
            <form className="" onSubmit={handleSubmit}>
                <div className="errors">{errors?.title}</div>
                <input
                    type="text"
                    value={title}
                    onChange={updateTitle}
                    placeholder="Give your echo a title..."
                    // required
                    className=""
                />
               {showUpload && <div>
                     <label>
                        Upload Echo
                        <input
                            type="file"
                            ref={fileRef}
                            accept=".wav, .mp3, .mp4, .aac"
                            onChange={updateFile}
                            className="" 
                        />
                    </label>
                </div>}
                {showRecord && <EchoRecorder setAudio={setAudio} setAudioUrl={setAudioUrl} />}
                <button type="button" onClick={clickUpload}>upload a echo</button>
                <button  type="button" onClick={clickRecord}>record an echo</button>
                {showSubmit && <button type="submit">Submit</button>}
                <button type="button" onClick={clearFile}>Clear</button>
            </form>
            <div className="">
                <h3>Echo Preview</h3>
                {(audioUrl !== null) ?
                    <EchoBox echo={{ title, author, audioUrl, replies: null, likes: null, reverbs: null }} /> :
                    undefined}
            </div>
        </div>
    )
}

export default EchoCompose;
