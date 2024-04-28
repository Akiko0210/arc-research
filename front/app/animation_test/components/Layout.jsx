import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const images = [
    '/images/splat1.png',
    '/images/splat2.png',
    '/images/splat3.png',
    '/images/splat4.png' // Include more images as needed
];

const getRandomPosition = () => {
    const variance = 150; // Reduce variance to keep images closer to center
    const x = (window.innerWidth / 2) + (Math.random() - 0.5) * variance; // Center x plus/minus variance
    const y = (window.innerHeight / 2) + (Math.random() - 0.5) * variance; // Center y plus/minus variance
    return { x, y };
};

const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
};

const ScreenCoverImages = () => {
    const [elements, setElements] = useState([]);
    const [startTime] = useState(Date.now()); // Record the start time of the animation

    useEffect(() => {
        const interval = setInterval(() => {
            const timeElapsed = (Date.now() - startTime) / 1000; // Time in seconds since start
            const scale = Math.min(1, 0.2 + timeElapsed / 2); // Start from scale 0.2 and increase over time

            const newElement = {
                id: Math.random(), // Unique key for React elements
                src: getRandomImage(),
                scale: scale,
                ...getRandomPosition()
            };

            setElements(currentElements => [...currentElements, newElement]);

            if (currentElements.length > 50 || timeElapsed > 30) { // Example conditions
                clearInterval(interval);
            }
        }, 200); // Faster interval to demonstrate change over time

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <div>
            {elements.map(el => (
                <motion.img
                    key={el.id}
                    src={el.src}
                    initial={{ scale: el.scale, opacity: 1 }} // Set initial scale to calculated value
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }} // Shorter transition for appearance
                    style={{
                        position: 'absolute',
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        transform: `translate(-50%, -50%)`, // Center the image on (x, y)
                        filter: 'brightness(200)' // Increase brightness and contrast
                    }}
                />
            ))}
        </div>
    );
};

export default ScreenCoverImages;
