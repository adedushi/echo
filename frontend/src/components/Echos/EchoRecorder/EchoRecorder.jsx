import { useCallback, useEffect } from "react";
import "./EchoRecorder.css"
import { useAudioRecorder } from 'react-audio-voice-recorder';
import RecordingAnimation from "./RecordingAnimation/RecordingAnimation";

const EchoRecorder = ({ setAudio, setAudioUrl }) => {
    const {
        startRecording,
        stopRecording,
        recordingBlob,
        isRecording,
        recordingTime,
    } = useAudioRecorder();
    
    const addAudioElement = useCallback((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio()
        audio.src = url;
        setAudio(blob)
        setAudioUrl(audio.src)
    }, [setAudio, setAudioUrl]);

    useEffect(() => {
        if (!recordingBlob) return;
        addAudioElement(recordingBlob)
    }, [addAudioElement, recordingBlob])

    useEffect(() => {
        if (recordingTime >= 30) {
            stopRecording()
        }
    }, [recordingTime, stopRecording])

    const handleClick = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    return (
        <>
            <div className={`${isRecording ? 'audio-recorder-is-recording' : 'audio-recorder-not-recording' }` } onClick={handleClick}>
                {!isRecording && <i className={`fa-solid fa-microphone audio-recorder-mic`}></i>}
                {isRecording && <p className={`audio-recorder-count`}>{recordingTime < 10 ? `0${recordingTime}` : `${recordingTime}`}</p>}
                {isRecording && <RecordingAnimation />}
            </div>
        </>
    )
}
export default EchoRecorder

