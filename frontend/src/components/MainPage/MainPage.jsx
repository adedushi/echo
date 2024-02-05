import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearSessionErrors } from '../../store/session';
import { useNavigate } from 'react-router';
import "./MainPage.css";

function MainPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'email' ? setEmail : setPassword;
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    }

    const handleDemoLogin = (e) => {
        e.preventDefault();
        dispatch(login({ email: "mark@zuckerberg.com", password: "password" }))
    }

    const sendToSignUp = (e) => {
        e.preventDefault();
        navigate("/signup");
    }




    return (
        <div className="welcome-page">
                <div className="left-side-welcome">
                    <div id='titleContainer'>
                        <div className='titleWrapper'><h1>Echo</h1></div>
                        <div id='subTitle'>
                        <h3>Listen now. now. now. now.</h3>
                            <div id='barContainer'>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                                <div className='soundBar'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-side-welcome">
                    <div id='signInContainer'>
                    <form className="session-form" onSubmit={handleSubmit}>
                    <div className="errors">{errors?.email}</div>
                    
                        <input type="text"
                            value={email}
                            onChange={update('email')}
                            placeholder="Email"
                        />
                
                    
                    <div className="errors">{errors?.password}</div>
                 
                        <input type="password"
                            value={password}
                            onChange={update('password')}
                            placeholder="Password"
                        />
                    
                    <input
                        type="submit"
                        value="Log In"
                        disabled={!email || !password}
                    />
                    <input
                        type="submit"
                        value="Demo Login"
                        onClick={handleDemoLogin}
                    />
                    <div id='dividerLine'></div>
                    <input 
                        id="signUpButton"
                        type="submit" 
                        value="Sign Up"
                        onClick={sendToSignUp}
                    />
                    </form>
                    </div>
            </div>

        </div>
    );
}

export default MainPage;