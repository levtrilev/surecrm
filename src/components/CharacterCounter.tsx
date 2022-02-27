import {
    useRecoilState,
    useRecoilValue,
} from 'recoil';
// import HeaderMUI from './HeaderMUI';
import { textState, charCountState } from '../state/state'

function CharacterCount() {
    const count = useRecoilValue(charCountState);

    return <>Character Count: {count}</>;
}

function CharacterCounter() {
    return (
        <div style={{ margin: 80 }}>
            {/* <HeaderMUI /> */}
            <TextInput />
            <CharacterCount />
        </div>
    );
}

function TextInput() {
    const [text, setText] = useRecoilState(textState);

    const onChange = (event: any) => {
        setText(event.target.value);
    };

    return (
        <div>
            <input type="text" value={text} onChange={onChange} />
            <br />
            Echo: {text}
        </div>
    );
}

export default CharacterCounter;