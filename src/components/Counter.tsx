import {
  useRecoilState,
} from 'recoil';
// import HeaderMUI from './HeaderMUI';
// import { textState, charCountState } from './state'
import { counterOneState, counterTwoState } from "../state/state";

function Counter() {

  const [counterOne, setCounterOne] = useRecoilState(counterOneState);
  const [counterTwo, setCounterTwo] = useRecoilState(counterTwoState);
  // const [posts, setPosts] = useRecoilState(postsState);

  return (
    <div style={{ margin: 80 }}>
      {/* <HeaderMUI /> */}
      <button onClick={() => setCounterOne(counterOne + 1)}>
        Press1
      </button>
      <div></div>
      <button onClick={() => setCounterTwo(counterTwo + 3)}>
        Press2
      </button>
      <p>
        total: {counterOne}----{counterTwo}
      </p>
    </div>
  );
}

export default Counter;