'use client'
// pages/Page.jsx
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const data = [
  {
    id: 1,
    title: "First Title", 
    content: "First Content"
  },
  {
    id: 2,
    title: "Second Title", 
    content: "Second Content"
  },
  // Add more items as needed
];

const Page = () => {
  const [id, setId] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setId(id === 1 ? data.length : id - 1);
        setDirection(-1);
      } else if (e.key === "ArrowRight") {
        setId(id === data.length ? 1 : id + 1);
        setDirection(1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id]);

  const { title, content } = data.find(item => item.id === id);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-screen relative"
      >
        {/* Left navigation button */}
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
          <FontAwesomeIcon icon={faAngleLeft} className="h-[30px] w-[30px] cursor-pointer" />
        </div>
        {/* Right navigation button */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
          <FontAwesomeIcon icon={faAngleRight} className="h-[30px] w-[30px] cursor-pointer" />
        </div>
        {/* DONE button */}
        <button className="absolute top-10 right-10 px-4 py-2 rounded-lg backdrop-blur-lg text-white focus:outline-none transition duration-300 hover:bg-red-600 border border-black">X</button>
        {/* Background Image */}
        <div className="absolute inset-0 z-[-1]">
          <Image src="/anime.avif" alt="Anime Background" layout="fill" objectFit="cover" />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            key={id} // This is crucial for animating between different content
            className="relative w-[800px]"
            initial={{ x: `${300 * direction}%` }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: `${-300 * direction}%` }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl p-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg mb-4 text-center text-4xl">
              {/* Title content */}
              {title}
            </div>
            <div className="rounded-xl p-4 bg-gray-800 bg-opacity-30 backdrop-blur-lg">
              {/* Content */}
              {content}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Page;
