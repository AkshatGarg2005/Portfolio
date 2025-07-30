// src/components/Cursor/Cursor.js
import React, { useEffect, useRef } from 'react';
import './Cursor.css';

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const requestRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on mobile
    if ('ontouchstart' in window) {
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    };

    const handleLinkHover = () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('follower-hover');
    };

    const handleLinkLeave = () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('follower-hover');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover effects to interactive elements
    const links = document.querySelectorAll('a, button, input, textarea, .clickable');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    // Optimized animation loop
    const animate = () => {
      // Smoother cursor movement
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;
      
      cursorPos.current.x += dx * 0.2;
      cursorPos.current.y += dy * 0.2;
      
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.1;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.1;

      cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      follower.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Don't render on touch devices
  if ('ontouchstart' in window) {
    return null;
  }

  return (
    <>
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={followerRef} className="cursor-follower"></div>
    </>
  );
};

export default Cursor;