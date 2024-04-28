"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const router = useRouter();
  const [queryString, setQueryString] = useState();
  // not using this for now...
  const [posts, setPosts] = useState([]);
  //

  const [loader, setLoader] = useState(false);
  const [checkLists, setCheckLists] = useState([]);
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
      const url = process.env.NEXT_PUBLIC_API_URL + "/chat";
      console.log(url, "url");
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          user_input: search,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("my data:", data.response);
      setCheckLists(
        data.response.slice(0, 7).map((list) => {
          return { ...list, checked: false };
        })
      );
      setLoader(false);
      // return data.response;

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
      setLoader(false);
      console.log("Error", err);
    }
  };

  useEffect(() => {
    if (queryString !== "") {
      setLoader(true);
      fetchData(queryString);
    }
  }, [queryString]);

  return (
    <PostContext.Provider
      value={{
        setPosts,
        checkLists,
        setCheckLists,
        posts,
        getPost,
        getNext,
        setQueryString,
        loader,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);

export default PostProvider;
