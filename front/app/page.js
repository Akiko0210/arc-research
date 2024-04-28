"use client";
import { useEffect } from "react";
import { usePosts } from "@/providers/PostProvider";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
// import "./page.scss";

export default function Home() {
  const [search, setSearch] = useState("");
  const { setQueryString } = usePosts();
  // console.log(posts);
  useEffect(
    useDebouncedCallback(() => {
      // fetch data
      setQueryString(search);
    }, 1000),
    [search]
  );

  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="text-9xl border-gradient-to-r from-[#d53e33] to-[#fbb300] ">
        Arc research
      </div>
      {/* add box class if you need noen moving border */}
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="box rounded p-4 w-[700px] bg-background backdrop-blur-lg absolute"
        placeholder="Search..."
      />
    </div>
  );
}
