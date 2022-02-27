import React, {useState, useMemo} from 'react'

function sum(n: number) {
  return n + n
}

interface Props {
    post: PostType;
}

export const Post: React.FC<Props> = ({post}) => {

  const [num, setNum] = useState(0)
  const [isGreen, setIsGreen] = useState(false)
  const countSum = useMemo(() => sum(num), [num])
  return(
    <div className="article-content">
    <div className="article-title">
        <a href="/">{post.title}</a>
        <a href="/">{post.userId}</a>
    </div>
      <p className="article-text" style={{ color: isGreen ? 'green' : 'red' }} onClick={() => setIsGreen(!isGreen)}>
          {post.body}
          {post.id}
      </p>
      {countSum}
      <button onClick={() => setNum(num + 1)} style={{ marginLeft: '10px' }}>+</button>
    </div>
  ) 
}

export default React.memo(Post)
