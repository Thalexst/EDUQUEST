import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className, style }) => {
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [scale, setScale] = useState(1);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        setRotateX(yPct * -20); // Max rotation deg
        setRotateY(xPct * 20);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setScale(1);
    };

    const handleMouseEnter = () => {
        setScale(1.05);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                ...style,
                transformStyle: "preserve-3d",
            }}
            animate={{
                rotateX,
                rotateY,
                scale
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;
