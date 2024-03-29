import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./EchoPlayer.css";

let currentlyPlayingInstance = null;

function WaveTest({ audioUrl, index }) { 
    const waveformId = `myWaveForm-${index}`;
    const mySongRef = useRef(null);
    const [songPlaying, setSongPlaying] = useState(false);
    // const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    useEffect(() => {
        const mySong = WaveSurfer.create({
            container: `#${waveformId}`,
            waveColor: ['#88cafb', "#7a49a5"],
            // barHeight: .75,
            barRadius: 100,
            height: 50,
            barWidth: 7.5,
            // barHeight: 1,
            cursorColor: "#7a49a5",
            cursorWidth: 0,
            dragToSeek: true,
            hideScrollbar: true,
            normalize: true,
            url: audioUrl
        });

        mySongRef.current = mySong;

        mySong.on('finish', () => {
            setSongPlaying(false); // Reset the play state
            mySong.seekTo(0); // Move the playback position to the beginning
        });

        return () => {
            mySong.destroy();
        };
    }, [audioUrl, waveformId]);

    const handlePlay = () => {
        if (mySongRef.current) {
            if (currentlyPlayingInstance && currentlyPlayingInstance !== mySongRef.current) {
                currentlyPlayingInstance.stop()
                currentlyPlayingInstance.seekTo(0)
            }
                mySongRef.current.playPause();
                setSongPlaying(!songPlaying);

                if (!songPlaying) {
                    currentlyPlayingInstance = mySongRef.current; // Update the currently playing instance
                } else {
                    currentlyPlayingInstance = null; // Reset the currently playing instance
                }
        }
    };

    return (
        <div className="play-container">
            <button className="audio-buttons" onClick={handlePlay}>
                {songPlaying ? <i id="pause-button" className="fa-solid fa-circle-pause"></i> : <i id="play-button" className="fa-solid fa-circle-play"></i>}
            </button>
            <div id={waveformId} className="myWaveForm"></div>
        </div>
    );
}


export default WaveTest;