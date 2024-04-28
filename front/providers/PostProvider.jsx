"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const router = useRouter();
  const [queryString, setQueryString] = useState();
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
  const fetchData = async (search) => {
    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        body: JSON.stringify({
          query_string: search,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response;

      /*
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "query_string": "robot"
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://localhost:5000/query", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
      */
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    // console.log(queryString);
    const data = fetchData(queryString);
    // console.log(data);
  }, [queryString]);

  return (
    <PostContext.Provider
      value={{ setPosts, posts, getPost, getNext, setQueryString }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);

export default PostProvider;
