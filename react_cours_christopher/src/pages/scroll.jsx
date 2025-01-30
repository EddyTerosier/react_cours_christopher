import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/forumSlice.js';

const InfiniteScroll = () => {
    const dispatch = useDispatch();
    const { posts, hasMore, loading } = useSelector((state) => state.forum);
    const observerRef = useRef(null);

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(fetchPosts());
        }
    }, [dispatch, posts.length]);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                dispatch(fetchPosts());
            }
        });

        if (observerRef.current && document.getElementById('load-more-trigger')) {
            observerRef.current.observe(document.getElementById('load-more-trigger'));
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [dispatch, hasMore, loading]);

    return (
        <div>
            <h1>Infinite Scroll</h1>
            <ul>
                {posts.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
            <div id="load-more-trigger" style={{ height: '10px' }}></div>
        </div>
    );
};

export default InfiniteScroll;