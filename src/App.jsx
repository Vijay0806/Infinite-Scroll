import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]); // To store fetched posts
  const [page, setPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // Whether there are more posts to fetch

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );

      // Append new posts
      setPosts((prevPosts) => [...prevPosts, ...response.data]);

      // If no more data is returned, set `hasMore` to false
      if (response.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Fetch posts when `page` changes
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="app">
      <h1>Infinite Scroll</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p className="loading">Loading...</p>}
      {!hasMore && <p className="end-message">No more posts to load.</p>}
    </div>
  );
};

export default App;
