import { useEffect } from "react";
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
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio()
        audio.src = url;
        setAudio(blob)
        setAudioUrl(audio.src)
    };

    useEffect(() => {
        if (!recordingBlob) return;
        addAudioElement(recordingBlob)
    }, [recordingBlob])

    // useEffect(() => {
    //     if (recordingTime >= 30) {
    //         stopRecording()
    //     }
    // }, [recordingTime])

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
            {/* // startRecording	Invoking this method starts the recording. Sets isRecording to true
                // stopRecording	Invoking this method stops the recording in progress and the resulting audio is made available in recordingBlob. Sets isRecording to false
                // togglePauseResume	Invoking this method would pause the recording if it is currently running or resume if it is paused. Toggles the value isPaused
                // recordingBlob	This is the recording blob that is created after stopRecording has been called
                // isRecording	A boolean value that represents whether a recording is currently in progress
                // isPaused	A boolean value that represents whether a recording in progress is paused
                // recordingTime	Number of seconds that the recording has gone on. This is updated every second
                // mediaRecorder	The current mediaRecorder in use. Can be undefined in case recording is not in progress */}
            {/* <AudioRecorder 
                onRecordingComplete={addAudioElement}
                showVisualizer={true}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }} 
                downloadOnSavePress={false}
                downloadFileExtension="mp3"
                recorderControls={recorderControls}
            /> */}
        </>
    )
}



export default EchoRecorder



// startRecording	Invoking this method starts the recording. Sets isRecording to true
// stopRecording	Invoking this method stops the recording in progress and the resulting audio is made available in recordingBlob. Sets isRecording to false
// togglePauseResume	Invoking this method would pause the recording if it is currently running or resume if it is paused. Toggles the value isPaused
// recordingBlob	This is the recording blob that is created after stopRecording has been called
// isRecording	A boolean value that represents whether a recording is currently in progress
// isPaused	A boolean value that represents whether a recording in progress is paused
// recordingTime	Number of seconds that the recording has gone on. This is updated every second
// mediaRecorder	The current mediaRecorder in use. Can be undefined in case recording is not in progress


            /* <AudioRecorder 
                onRecordingComplete={addAudioElement}
                showVisualizer={true}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }} 
                downloadOnSavePress={false}
                downloadFileExtension="mp3"
                recorderControls={recorderControls}
                classes={{
                    AudioRecorderClass: 'audio-recorder-custom',
                    AudioRecorderTimerClass: 'audio-recorder-timer',
                    AudioRecorderStatusClass: 'audio-recorder-status',
                    AudioRecorderStartSaveClass: 'audio-recorder-start-save',
                    AudioRecorderPauseResumeClass: 'audio-recorder-pause-resume',
                    AudioRecorderDiscardClass: 'audio-recorder-pause-discard'
                }}
            /> */
