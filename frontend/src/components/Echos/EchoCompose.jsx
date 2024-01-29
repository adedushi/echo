import { useEffect, useRef, useState } from 'react';
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
    const fileRef = useRef(null);
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        return () => dispatch(clearEchoErrors());
    }, [dispatch]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(composeEcho(text, images));
        setImages([]);
        setImageUrls([]);
        setText('');
        fileRef.current.value = null;
    };

    const update = e => setText(e.currentTarget.value);

    const updateFiles = async e => {
        const files = e.target.files;
        setImages(files);
        if (files.length !== 0) {
            let filesLoaded = 0;
            const urls = [];
            Array.from(files).forEach((file, index) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    urls[index] = fileReader.result;
                    if (++filesLoaded === files.length)
                        setImageUrls(urls);
                }
            });
        }
        else setImageUrls([]);
    }


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
                <label>
                    Images to Upload
                    <input
                        type="file"
                        ref={fileRef}
                        accept=".jpg, .jpeg, .png"
                        multiple
                        onChange={updateFiles} />
                </label>
            </form>
            <div className="echo-preview">
                <h3>Echo Preview</h3>
                {(text || imageUrls.length !== 0) ?
                    <EchoBox echo={{ text, author, imageUrls }} /> :
                    undefined}
            </div>
            <div className="previous-echo">
                <h3>Previous Echo</h3>
                {newEcho ? <EchoBox echo={newEcho} /> : undefined}
            </div>
        </>
    )
}

export default EchoCompose;
