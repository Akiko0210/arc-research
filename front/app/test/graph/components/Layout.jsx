import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    '/images/splat1.jpg',
    '/images/splat2.jpg',
    '/images/splat3.jpg',
    '/images/splat4.jpg'
];

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [deltaTime, setDeltaTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setDeltaTime(now - lastUpdateTime);
            setLastUpdateTime(now);
            
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3000 milliseconds (3 seconds)

        return () => clearInterval(interval);
    }, [lastUpdateTime]);

    return (
        <div>
            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </AnimatePresence>
            <div>Delta Time: {deltaTime}ms</div>
        </div>
    );
};

export default ImageCarousel;