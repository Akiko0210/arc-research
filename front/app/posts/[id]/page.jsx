"use client";
// pages/Page.jsx
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";

const data = [
  {
    id: 1,
    title: "First Title",
    content: "First Content",
  },
  {
    id: 2,
    title: "Second Title",
    content: "Second Content",
  },
  ,
  {
    id: 3,
    title: "third Title",
    content: "Second Content",
  },
  ,
  {
    id: 4,
    title: "fourth Title",
    content: "Second Content",
  },
  // Add more items as needed
];

const Page = () => {
  // const router = useRouter();
  const [activeId, setActiveId] = useState(1);
  // const [activeIndex, setActiceIndex] = useState(0);

  const handleNavigation = (direction) => {
    setActiveId((prevId) => {
      if (activeId >= data.length - 2 && direction === 1) {
        //stupid logic to prevent going to the last item
        return activeId;
      } else if (activeId <= 1 && direction === -1) {
        //stupid logic to prevent going to the first item
        return activeId;
      }
      const newIndex = prevId + direction;

      return newIndex > data.length ? 1 : newIndex < 1 ? data.length : newIndex;
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-screen relative"
      >
        {/* Navigation buttons */}
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2 z-10">
          <FontAwesomeIcon
            icon={faAngleLeft}
            className="h-[30px] w-[30px] cursor-pointer"
            onClick={() => handleNavigation(-1)}
          />
        </div>
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 z-10">
          <FontAwesomeIcon
            icon={faAngleRight}
            className="h-[30px] w-[30px] cursor-pointer"
            onClick={() => handleNavigation(1)}
          />
        </div>
        {/* Background Image */}
        <Image
          src="/anime.avif"
          alt="Anime Background"
          layout="fill"
          objectFit="cover"
          className="z-[-1]"
        />

        <div className="flex relative w-screen h-screen">
          <div className="flex relative w-screen h-screen -translate-y-[10%] -translate-x-[27%]">
            {data.map((item) => (
              <motion.div
                key={item.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute w-[800px] top-1/2 left-1/2 -translate-x-[-50%] -translate-y-[-50%]"
                initial={{
                  x: item.id === activeId ? 0 : 1300 * -(activeId - item.id),
                }}
                animate={{
                  x: item.id === activeId ? 0 : 1300 * -(activeId - item.id),
                }}
                exit={{ x: 800 * (activeId - item.id) }}
                transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
              >
                <div className="rounded-xl p-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg mb-4 text-center text-4xl">
                  {item.title}
                </div>
                <div className="rounded-xl p-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg">
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>
          <button
            className="opacity-30 hover:opacity-100 absolute top-14 right-14 py-2 px-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg border-2 text-white border-red-100 border-opacity-30 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-300"
            aria-label="Complete and close"
          >
            Done
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Page;
