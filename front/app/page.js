"use client";
import { usePosts } from "@/providers/PostProvider";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
// import "./page.scss";

export default function Home() {
  const [search, setSearch] = useState("");
  const { setPosts } = usePosts;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("localhost:5000/query", {
        method: "POST",
        body: JSON.stringify({
          query_string: search,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.text();
    };
    useDebouncedCallback(async () => {
      // fetch data
      const data = await fetchData();
      console.log(data);
    }, 300);
  }, [search]);

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
