"use client";

import React, { createContext, useContext, useState, useRouter } from "react";

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const getPost = (id) => {
    return posts.find((post) => post.id === id);
  };
  const getNext = () => {
    const currentId = router.query.id;
    const index = posts.findIndex((post) => post.id === currentId);
    if (index < posts.length - 1) {
      const nextPost = posts[index + 1];
      router.push(nextPost.id);
    }
  };

  return (
    <PostContext.Provider value={(setPosts, posts, getPost, getNext)}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);

export default PostProvider;
