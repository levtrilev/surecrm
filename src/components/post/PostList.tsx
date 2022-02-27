import React from 'react'
import Post from './Post'
import {
    useRecoilValue,
} from 'recoil';
import { currentPostsQuery } from '../../state/state'
// import HeaderMUI from './HeaderMUI';

export const PostList: React.FC = () => {

    const posts = useRecoilValue(currentPostsQuery) as PostType[];
    // console.log(posts);

    return (
        <div style={{ margin: 80 }}>
            {/* <HeaderMUI /> */}
            <div className="blog-content layout">
                <button onClick={() => { }}>
                    fetch posts
                </button>
                {posts.length ? posts.map(post => <Post key={post.id} post={post} />) : "Нет записей"}
            </div>
        </div>
    )
}

export default PostList
