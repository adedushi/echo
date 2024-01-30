
import { AudioRecorder } from 'react-audio-voice-recorder';

const EchoRecorder = ({ setAudio, setAudioUrl, updateFile }) => {
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio()
        audio.src = url;
        setAudio(blob)
        setAudioUrl(audio.src)
        updateFile()
        // audio.controls = true;
        // document.body.appendChild(audio);
    };

    return (
        <div>
            <AudioRecorder 
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }} 
                downloadOnSavePress={false}
                downloadFileExtension="mp3"
            />
        </div>
  );
}

export default EchoRecorder