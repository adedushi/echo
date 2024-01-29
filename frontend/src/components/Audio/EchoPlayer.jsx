import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./EchoPlayer.css";

function WaveTest({echoUrl}) {
    const mySongRef = useRef(null);
    const [songPlaying, setSongPlaying] = useState(false);

    useEffect(() => {
        const mySong = WaveSurfer.create({
            container: "#myWaveForm",
            waveColor: '#88cafb',
            cursorWidth: 0,
            url: echoUrl
        })

        mySongRef.current = mySong;

        return () => {
            mySong.destroy();
        };
    }, []);

    const handlePlay = () => {
        if (mySongRef.current) {
            mySongRef.current.playPause();
            setSongPlaying(!songPlaying);
        }
    }


    return (
        <>
        <div className="echoCard">
            <div className="playContainer">
                <button className="upperEchoButton" onClick={handlePlay}>{songPlaying ? <i className="fa-solid fa-pause"></i> : <i id="playTriangle" className="fa-solid fa-play"></i>}</button>
                <div id="myWaveForm"></div>
            </div>
        </div>
        </>
      );
}

export default WaveTest;