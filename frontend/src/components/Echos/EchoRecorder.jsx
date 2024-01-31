import { useEffect } from "react";
import "./EchoRecorder.css"
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const EchoRecorder = ({ setAudio, setAudioUrl }) => {
    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
        mediaRecorder
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

    const handleClick = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }


    return (
        <>

            <div className={`audio-recorder ${isRecording ? 'is-recording' : ''}` } onClick={handleClick}>
                <img className={`audio-recorder-mic ${isRecording ? 'hide-recorder-element' : ''}`} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQ3MCA0NzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3MCA0NzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KCTxnPgoJCTxwYXRoIGQ9Ik0yMzUsMzAyLjI5NmM0Ny4xNzcsMCw4NS40MjMtMzguMjQ1LDg1LjQyMy04NS40MjNWODUuNDIzQzMyMC40MjMsMzguMjQ1LDI4Mi4xNzcsMCwyMzUsMHMtODUuNDIzLDM4LjI0NS04NS40MjMsODUuNDIzCgkJCXYxMzEuNDUxQzE0OS41NzcsMjY0LjA1MSwxODcuODIzLDMwMi4yOTYsMjM1LDMwMi4yOTZ6Ii8+CgkJPHBhdGggZD0iTTM1MC40MjMsMTM2LjE0OHYzMGgxNXY1MC43MjZjMCw3MS45MTUtNTguNTA4LDEzMC40MjMtMTMwLjQyMywxMzAuNDIzcy0xMzAuNDIzLTU4LjUwNy0xMzAuNDIzLTEzMC40MjN2LTUwLjcyNmgxNXYtMzAKCQkJaC00NXY4MC43MjZDNzQuNTc3LDMwMC4yNzMsMTM4LjU1MSwzNjksMjIwLDM3Ni41ODlWNDQwaC05MC40NDR2MzBoMjEwLjg4OXYtMzBIMjUwdi02My40MTEKCQkJYzgxLjQ0OS03LjU4OSwxNDUuNDIzLTc2LjMxNywxNDUuNDIzLTE1OS43MTZ2LTgwLjcyNkgzNTAuNDIzeiIvPgoJPC9nPgo8L3N2Zz4K" alt="" />
                <span className={`audio-recorder-timer ${!isRecording ? 'hide-recorder-element' : ''}`}>:{recordingTime < 10 ? `0${recordingTime}` : `${recordingTime}`}</span>
                <span className="audio-recorder-visualizer">
                    visualizer
                </span>
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