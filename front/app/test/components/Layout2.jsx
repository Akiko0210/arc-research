import { motion } from 'framer-motion';
import { useState } from 'react';

function ExpandingCircle() {
    const [clickPosition, setClickPosition] = useState(null);

    // Handler for mouse click
    const handleMouseClick = (event) => {
        // Get mouse coordinates from the event
        setClickPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }} onClick={handleMouseClick}>
            {clickPosition && (
                <motion.div
                    initial={{
                        scale: 0.1,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        width: 100,
                        height: 100,
                        position: 'fixed',
                        top: clickPosition.y,
                        left: clickPosition.x,
                        x: '-50%',
                        y: '-50%'
                    }}
                    animate={{
                        scale: 100,
                        x: `calc(50vw - ${clickPosition.x}px)`,
                        y: `calc(50vh - ${clickPosition.y}px)`,
                        transitionEnd: {
                            x: 0,
                            y: 0
                        }
                    }}
                    transition={{
                        duration: 2,
                        ease: [0.6, 0.01, 0.4, 1]
                    }}
                    style={{
                        zIndex: 10
                    }}
                />
            )}
        </div>
    );
}

export default ExpandingCircle;
