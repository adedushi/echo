import {Howl, Howler} from 'howler';

const audioUrls = [
    'https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3'
]
  
function HowlerTest() {
    const babyShar = new Howl({
        src: ['https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3']
    });

    const handlePlay = (e) => {
        e.preventDefault();

        babyShar.play();
    }

    return(
        <>
        <div>
            <button onClick={handlePlay}>Babyshark</button>
        </div>
        
        
        
        </>
    )
}

export default HowlerTest;
