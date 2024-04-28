"use client";
import { useEffect } from "react";
import { usePosts } from "@/providers/PostProvider";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
// import "./page.scss";

export default function Home() {
  const [search, setSearch] = useState("");
  const { setQueryString, checkLists, loader, setCheckLists } = usePosts();
  const router = useRouter();
  // console.log(checkLists, "checklists");
  // console.log(posts);
  useEffect(
    useDebouncedCallback(() => {
      // fetch data
      console.log(search);
      setQueryString(search);
    }, 1000),
    [search]
  );

  return (
    <div className="h-screen flex flex-col justify-center items-center relative">
      <div className="text-9xl border-gradient-to-r from-[#d53e33] to-[#fbb300] ">
        Arc research
      </div>
      {/* add box class if you need noen moving border */}
      <div className="absolute  bg-background backdrop-blur-lg">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className={`${
            loader && "box"
          } rounded p-4 w-[700px] bg-background backdrop-blur-lg`}
          placeholder="Search..."
        />
        <div className="flex flex-col items-center p-4 w-[700px] bg-background backdrop-blur-lg">
          {checkLists?.map(({ title, description, checked }, index) => {
            return (
              <div
                key={index}
                className={`w-full ${
                  checked && "bg-gradient-to-r from-cyan-500 to-blue-500"
                } p-2`}
                onClick={() => {
                  const copy = [...checkLists];
                  copy[index].checked = !copy[index].checked;
                  console.log(copy[index].checked, "copy that is changing");

                  setCheckLists(copy);
                }}
              >
                <div className="text-md">{title}</div>
                <div className="text-xs">{description}</div>
              </div>
            );
          })}
          {checkLists.length > 0 && (
            <button
              className="rounded p-2 bg-white text-black border-red"
              onClick={() => router.push("/graph")}
            >
              submoot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
