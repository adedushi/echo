import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./SignupForm.css"
import { login, signup, clearSessionErrors } from '../../store/session';
import { useNavigate } from 'react-router';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [image, setImage] = useState(null);
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = field => {
        let setState;

        switch (field) {
            case 'email':
                setState = setEmail;
                break;
            case 'username':
                setState = setUsername;
                break;
            case 'password':
                setState = setPassword;
                break;
            case 'password2':
                setState = setPassword2;
                break;
            default:
                throw Error('Unknown field in Signup Form');
        }

        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            email,
            username,
            image,
            password
        };

        dispatch(signup(user));
    }

    const backToHome = (e) => {
        e.preventDefault();
        navigate('/')
    }

    

    const handleDemoLogin = (e) => {
        e.preventDefault();
        dispatch(login({ email: "mark@zuckerberg.com", password: "password" }))
    }

    const updateFile = e => setImage(e.target.files[0]);

    return (
        <>
        <div id='signUpBG'>
        <div id='signUpContainer'>
        <form className="signUpForm" onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>
            <h3>Start listening today!</h3>
                <i id='closeButton' className="fa-solid fa-square-xmark" onClick={backToHome}></i>
            <div className="errors">{errors?.email}</div>
            
                <input className='signUpInput' type="text"
                    value={email}
                    onChange={update('email')}
                    placeholder="Enter your email"
                />
            
            <div className="errors">{errors?.username}</div>
            
                <input className='signUpInput' type="text"
                    value={username}
                    onChange={update('username')}
                    placeholder="Pick a username"
                />
            
            <div className="errors">{errors?.password}</div>
            
                <input className='signUpInput' type="password"
                    value={password}
                    onChange={update('password')}
                    placeholder="Enter a password"
                />
            
            <div className="errors">
                {password !== password2 && 'Confirm Password field must match'}
            </div>
            
                <input className='signUpInput' type="password"
                    value={password2}
                    onChange={update('password2')}
                    placeholder="Confirm Password"
                />
            
            <div id='fileInputContainer'>
            <h3 id='uploadProfilePic'>Upload Profile Picture</h3>
            <div id='uploadDivide'></div>
            <div className='fileInputContainer'><input type="file" accept=".jpg, .jpeg, .png" onChange={updateFile} /></div>
            </div>
            <input
                type="submit"
                value="Sign Up"
                disabled={!email || !username || !password || password !== password2}
            />
            <input
                type="submit"
                value="Demo Login"
                onClick={handleDemoLogin}
            />
        </form>
        </div>
        </div>
        </>
    );
}

export default SignupForm;