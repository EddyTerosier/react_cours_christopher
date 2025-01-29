import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/forumSlice.js';

const InfiniteScroll = () => {
    const dispatch = useDispatch();
    const { posts, hasMore, loading } = useSelector((state) => state.forum);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            dispatch(fetchPosts());
        }
    }, [hasMore, loading, dispatch]);

    useEffect(() => {
        loadMore();
    }, [loadMore]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loadMore]);

    return (
        <div>
            <h1>Infinite Scroll</h1>
            <ul>
                {posts.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default InfiniteScroll;