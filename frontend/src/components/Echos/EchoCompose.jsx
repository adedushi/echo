import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, composeEcho } from '../../store/echos';
import EchoBox from './EchoBox';
import './EchoCompose.css';

function EchoCompose() {
    const [text, setText] = useState('');
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
        dispatch(composeEcho(text, audio));
        setAudio(null);
        setAudioUrl(null);
        setText('');
        fileRef.current.value = null;
    };

    const update = e => setText(e.currentTarget.value);

    // const updateFiles = async e => {
    //     const files = e.target.files;
    //     setAudio(files);
    //     if (files.length !== 0) {
    //         let filesLoaded = 0;
    //         const urls = [];
    //         Array.from(files).forEach((file, index) => {
    //             const fileReader = new FileReader();
    //             fileReader.readAsDataURL(file);
    //             fileReader.onload = () => {
    //                 urls[index] = fileReader.result;
    //                 if (++filesLoaded === files.length)
    //                     setAudioUrl(urls);
    //             }
    //         });
    //     }
    //     else setAudioUrl([]);
    // }

    // const updateFile = e => setAudio(e.target.files[0]);

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
                    setAudio(null);
                    setAudioUrl(null);
                }
            };
        } else {
            setAudio(null);
            setAudioUrl(null);
        }
    }

    
    return (
        <div className="compose-echo">
            <form className="compose-echo-form" onSubmit={handleSubmit}>
                <input
                    type="textarea"
                    value={text}
                    onChange={update}
                    placeholder="Give your echo a title..."
                    required
                    className="echo-text"
                />
                <div className="errors">{errors?.text}</div>
                <input type="submit" value="Submit" />
                <label>
                    Audio to Upload
                    <input
                        type="file"
                        ref={fileRef}
                        accept=".wav, .mp3, .mp4, .aac"
                        onChange={updateFile}
                        className="upload-button" />
                </label>
            </form>
            <div className="echo-preview">
                <h3>Echo Preview</h3>
                {(text || audioUrl !== null) ?
                    <EchoBox echo={{ text, author, audioUrl, replies: null, likes: null, reverbs: null }} /> :
                    undefined}
            </div>
        </div>
    )
}

export default EchoCompose;
