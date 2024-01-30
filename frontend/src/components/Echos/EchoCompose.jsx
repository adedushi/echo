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

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(composeEcho(title, audio));
        setAudio(null);
        setAudioUrl(null);
        setTitle('');
        fileRef.current.value = null;
    };

    const update = e => setTitle(e.currentTarget.value);

    
    const updateFile = async e => {
        let file = null
        if (e) {
            file = e.target.files[0]
        }
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
                    setAudio(null);
                    setAudioUrl(null);
                }
            };
        } else if (audio) {
            console.log('audio exists')
        } 
        // else {
        //     setAudio(null);
        //     setAudioUrl(null);
        // }
    }

    
    return (
        <div className="compose-echo">
            <form className="compose-echo-form" onSubmit={handleSubmit}>
                <div className="errors">{errors?.title}</div>
                <input
                    type="textarea"
                    value={title}
                    onChange={update}
                    placeholder="Give your echo a title..."
                    required
                    className="echo-text"
                />
                <label >
                    <input
                        type="file"
                        ref={fileRef}
                        accept=".wav, .mp3, .mp4, .aac"
                        onChange={updateFile}
                    />
                </label>
                <input type="submit" value="Submit" />
                <div>
                    <EchoRecorder setAudio={setAudio} setAudioUrl={setAudioUrl} updateFile={updateFile} />
                </div>
            </form>

            <div className="echo-preview">
                <h3>Echo Preview</h3>
                {(title || audioUrl !== null) ?
                    <EchoBox echo={{ title, author, audioUrl, replies: null, likes: null, reverbs: null }} /> :
                    undefined}
            </div>
        </div>
    )
}

export default EchoCompose;
