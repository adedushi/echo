import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEchoErrors, composeEcho } from '../../store/echos';
import EchoBox from './EchoBox';
import './EchoCompose.css';

function EchoCompose() {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const author = useSelector(state => state.session.user);
    const newEcho = useSelector(state => state.echos.new);
    const errors = useSelector(state => state.errors.echos);

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(composeEcho({ text }));
        setText('');
    };

    const update = e => setText(e.currentTarget.value);

    return (
        <>
            <form className="compose-echo" onSubmit={handleSubmit}>
                <input
                    type="textarea"
                    value={text}
                    onChange={update}
                    placeholder="Write your echo..."
                    required
                />
                <div className="errors">{errors?.text}</div>
                <input type="submit" value="Submit" />
            </form>
            <div className="echo-preview">
                <h3>Echo Preview</h3>
                {text ? <EchoBox echo={{ text, author }} /> : undefined}
            </div>
            <div className="previous-echo">
                <h3>Previous Echo</h3>
                {newEcho ? <EchoBox echo={newEcho} /> : undefined}
            </div>
        </>
    )
}

export default EchoCompose;
