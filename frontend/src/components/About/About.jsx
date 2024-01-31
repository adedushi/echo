import "./About.css"
import { useNavigate } from 'react-router';


function About() {
    const navigate = useNavigate();

    const navToHome = (e) => {
        e.preventDefault();
        navigate('/')
    }

    const handleSendToGithub = (dev) => {
        if (dev === 'albert') {
            window.open('https://github.com/adedushi');
        } else if (dev === 'billy') {
            window.open('https://github.com/wremsen')
        } else {
            window.open('https://github.com/lsherman98')
        }
    }

    const handleSendToLinkedin = (dev) => {
        if (dev === 'billy') {
            window.open('https://www.linkedin.com/in/billy-remsen-b0969a120/');
        } else if (dev === 'albert') {
            window.open('https://www.linkedin.com/in/adedushi/');
        } else {
            window.open('https://github.com/lsherman98')
        }
    }







    return(
        <>
        <div id="aboutContainer">

            <div className='titleCard'>
                <h1>Team <span id='labtext'>LAB</span></h1>
                <i id='backButton' className="fa-solid fa-arrow-rotate-left" onClick={navToHome}></i>
            </div>
           
            <div className='devCardHolder'>
                <div className='devWrapper'>
                    <div className='profilePhoto'></div>
                    <div className='devNameWrapper'>
                        <h1><span className='firstLetter'>L</span>evi Sherman</h1>
                    </div>
                    <div className='devSummaryWrapper'>
                        <p>Levi worked as the back-end lead. He quickly got up to speed on Express and MongoDB, leading the effort to build all of the audio functionality for Echo.</p>
                    </div>
                    <div className='iconLinksWrapper'>
                        <div className='iconButtons'><i id='githubButton' className="fa-brands fa-github" onClick={() => handleSendToGithub('levi')}></i></div>
                        <div className='iconButtons'><i id='liButton' className="fa-brands fa-linkedin" onClick={() => handleSendToLinkedin('levi')}></i></div>
                        <div className='iconButtons'><i id='wellfoundButton' className="fa-solid fa-hand-peace"></i></div>
                    </div>


                </div>
                <div className='devWrapper'>
                    <div className='profilePhoto'></div>
                    <div className='devNameWrapper'>
                        <h1><span className='firstLetter'>A</span>lbert Dedushi</h1>
                    </div>
                    <div className='devSummaryWrapper'>
                        <p>Albert was the team lead and project flex for Echo. He was instrumental in creating base functionality for a large number of components for the site.</p>
                    </div>
                    <div className='iconLinksWrapper'>
                        <div className='iconButtons'><i id='githubButton' className="fa-brands fa-github" onClick={() => handleSendToGithub('albert')}></i></div>
                        <div className='iconButtons'><i id='liButton' className="fa-brands fa-linkedin" onClick={() => handleSendToLinkedin('albert')}></i></div>
                        <div className='iconButtons'><i id='wellfoundButton' className="fa-solid fa-hand-peace"></i></div>
                    </div>

                </div>
                
                <div className='devWrapper'>
                    <div className='profilePhoto'></div>
                    <div className='devNameWrapper'>
                        <h1> <span className='firstLetter'>B</span>illy Remsen</h1>
                    </div>
                    <div className='devSummaryWrapper'>
                        <p>Billy served as the front-end lead for this project, working closely with his teammates to create a cohesive user experience. He is especially proud of the animated sound bar on the splash page.</p>
                    </div>
                    <div className='iconLinksWrapper'>
                        <div className='iconButtons'><i id='githubButton' className="fa-brands fa-github" onClick={() => handleSendToGithub('billy')}></i></div>
                        <div className='iconButtons'><i id='liButton' className="fa-brands fa-linkedin" onClick={() => handleSendToLinkedin('billy')}></i></div>
                        <div className='iconButtons'><i id='wellfoundButton' className="fa-solid fa-hand-peace"></i></div>
                    </div>

                </div>
            </div>



        </div>
        </>
    )
}

export default About;