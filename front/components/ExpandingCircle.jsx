import { motion } from "framer-motion";
// import { useState } from "react";

function ExpandingCircle({ x, y }) {
  return (
    <motion.div
      initial={{
        scale: 0.1,
        borderRadius: "50%",
        backgroundColor: "#fff",
        width: 100,
        height: 100,
        position: "fixed",
        top: y,
        left: x,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        scale: 100,
        x: `calc(50vw - ${x}px)`,
        y: `calc(50vh - ${y}px)`,
        transitionEnd: {
          x: 0,
          y: 0,
        },
      }}
      transition={{
        duration: 2,
        ease: [0.6, 0.01, 0.4, 1],
      }}
      style={{
        zIndex: 10,
      }}
    />
  );
}

export default ExpandingCircle;
