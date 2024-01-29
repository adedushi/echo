import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearSessionErrors } from '../../store/session';
import "./MainPage.css";

function MainPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();


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
        dispatch(login({ email: "demo-user@appacademy.io", password: "starwars" }))
    }




    return (
        <div className="welcome-page">
                <div className="left-side-welcome">
                    <div id='titleContainer'>
                        <h1>Echo</h1>
                        <h3>Listen now.</h3>
                    </div>
                </div>

                <div className="right-side-welcome">
                    <div id='signInContainer'>
                    <form className="session-form" onSubmit={handleSubmit}>
                    <div className="errors">{errors?.email}</div>
                    <label>
                        <input type="text"
                            value={email}
                            onChange={update('email')}
                            placeholder="Email"
                        />
                    </label>
                    <div className="errors">{errors?.password}</div>
                    <label>
                        <input type="password"
                            value={password}
                            onChange={update('password')}
                            placeholder="Password"
                        />
                    </label>
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
                    </form>
                    </div>
            </div>

        </div>
    );
}

export default MainPage;