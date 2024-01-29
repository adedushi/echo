import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./WaveSurfer.css";

function WaveTest() {
    const mySongRef = useRef(null);
    const [songPlaying, setSongPlaying] = useState(false);

    useEffect(() => {
        const mySong = WaveSurfer.create({
            container: "#myWaveForm",
            waveColor: '#88cafb',
            url: "https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3"
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
            <div className="upperEchoCard">
                <button className="upperEchoButton"></button>
                <button className="upperEchoButton" onClick={handlePlay}>{songPlaying ? <i className="fa-solid fa-pause"></i> : <i id="playTriangle" className="fa-solid fa-play"></i>}</button>
                <div id="myWaveForm"></div>
            </div>
            <div className="lowerEchoCard">
                <button className="lowerEchoButton" id="likeIcon"><i className="fa-solid fa-heart"></i></button>
                <button className="lowerEchoButton" id="shareIcon"><i className="fa-solid fa-share"></i></button>
                <button className="lowerEchoButton" id="reverbIcon"><i className="fa-solid fa-satellite-dish"></i></button>
            </div>
          
        </div>
        </>
      );
}

export default WaveTest;