'use client'
import React, { useEffect, useRef, useState } from 'react';

export default function Page() {
    const canvasRef = useRef(null);
    const [user, setUser] = useState({ x: 50, y: 50 });
    const [direction, setDirection] = useState('down'); // 'down', 'left', 'right', 'up'

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const backgroundImg = new Image();
        backgroundImg.src = '/background.webp';

        const spriteImg = new Image();
        spriteImg.src = '/sprite.png';

        const frameCount = 4; // Number of frames per row in the sprite sheet
        const spriteWidth = spriteImg.width / frameCount;
        const spriteHeight = spriteImg.height / 4; // Assuming 4 rows for directions

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            // Determine the row based on direction
            const directionRow = direction === 'down' ? 0
                : direction === 'left' ? 1
                : direction === 'right' ? 2
                : 3; // 'up'

            // Draw the sprite (always first frame of the respective row)
            ctx.drawImage(
                spriteImg,
                0, // Always the first frame (x = 0)
                directionRow * spriteHeight, // Source y position
                spriteWidth, // Source width
                spriteHeight, // Source height
                user.x, // Destination x position
                user.y, // Destination y position
                50, // Destination width
                50 // Destination height
            );

            requestAnimationFrame(draw);
        };

        const handleSpriteLoad = () => {
            draw();
        };

        spriteImg.onload = handleSpriteLoad;
    }, [user, direction]);

    const handleKeyDown = (e) => {
        const key = e.key;
        if (key === 'w' || key === 'ArrowUp') {
            setDirection('up');
            setUser((prev) => ({ ...prev, y: prev.y - 20 }));
        } else if (key === 's' || key === 'ArrowDown') {
            setDirection('down');
            setUser((prev) => ({ ...prev, y: prev.y + 20 }));
        } else if (key === 'a' || key === 'ArrowLeft') {
            setDirection('left');
            setUser((prev) => ({ ...prev, x: prev.x - 20 }));
        } else if (key === 'd' || key === 'ArrowRight') {
            setDirection('right');
            setUser((prev) => ({ ...prev, x: prev.x + 20 }));
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className='min-h-screen bg-gray-50 w-full'>
            <canvas ref={canvasRef} className='w-full h-full' id='canvas'></canvas>
        </div>
    );
}