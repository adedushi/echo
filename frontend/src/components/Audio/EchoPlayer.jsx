import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./EchoPlayer.css";

function WaveTest({ audioUrl, index }) { 
    const waveformId = `myWaveForm-${index}`;
    const mySongRef = useRef(null);
    const [songPlaying, setSongPlaying] = useState(false);

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

        return () => {
            mySong.destroy();
        };
    }, [audioUrl, waveformId]);

    const handlePlay = () => {
        if (mySongRef.current) {
            mySongRef.current.playPause();
            setSongPlaying(!songPlaying);
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