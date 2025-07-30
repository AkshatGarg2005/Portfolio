// src/components/Hero/Hero.js
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaArrowDown, FaDownload } from 'react-icons/fa';
import * as THREE from 'three';
import './Hero.css';

const Hero = ({ darkMode }) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const roles = ['Full-Stack Developer', 'AI Enthusiast', 'IoT Developer', 'Problem Solver'];
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const particlesRef = useRef(null);

  // Optimized Three.js 3D Background with fewer particles
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false // Disable antialiasing for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
    rendererRef.current = renderer;

    // Create particles - reduced count for performance
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500; // Reduced from 1500
    const posArray = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;

      // Simplified color
      const color = new THREE.Color(darkMode ? 0x6366f1 : 0x8b5cf6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    // Simplified animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slower rotation for performance
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0002;
        particlesRef.current.rotation.y += 0.0002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [darkMode]);

  // Typing effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentRole.substring(0, currentText.length - 1));
        }, 50);
      }
    } else {
      if (currentText === currentRole) {
        setIsPaused(true);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentRole.substring(0, currentText.length + 1));
        }, 100);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentRoleIndex, roles]);

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay"></div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <h3 className="hero-greeting animate-on-scroll">
              <span className="wave">👋</span> Hello, I'm
            </h3>
            <h1 className="hero-name animate-on-scroll">
              Akshat Garg
            </h1>
            <div className="hero-role animate-on-scroll">
              <span>I'm a </span>
              <span className="typed-container">
                <span className="typed-text gradient-text">{currentText}</span>
                <span className="cursor">|</span>
              </span>
            </div>
            <p className="hero-description animate-on-scroll">
              Third-year Computer Science student passionate about creating innovative solutions 
              using AI, IoT, and full-stack development. Currently studying at VIT Bhopal.
            </p>
          </div>
          
          <div className="hero-buttons animate-on-scroll">
            <Link to="contact" smooth={true} duration={500} className="btn btn-primary">
              <span>Get In Touch</span>
              <FaArrowDown className="btn-icon" />
            </Link>
            <a 
              href="/resume.pdf" 
              className="btn btn-outline"
              download="Akshat_Garg_Resume.pdf"
            >
              <span>Download Resume</span>
              <FaDownload className="btn-icon" />
            </a>
          </div>

          <div className="hero-social animate-on-scroll">
            <a href="https://github.com/AkshatGarg2005" 
               target="_blank" 
               rel="noopener noreferrer"
               className="social-link">
              <FaGithub />
              <span className="social-tooltip">GitHub</span>
            </a>
            <a href="https://linkedin.com/in/akshat-garg-vitbhopal" 
               target="_blank" 
               rel="noopener noreferrer"
               className="social-link">
              <FaLinkedin />
              <span className="social-tooltip">LinkedIn</span>
            </a>
            <a href="mailto:akshatgarg0280@gmail.com"
               className="social-link">
              <FaEnvelope />
              <span className="social-tooltip">Email</span>
            </a>
            <a href="tel:+918894699422"
               className="social-link">
              <FaPhone />
              <span className="social-tooltip">Phone</span>
            </a>
          </div>
        </div>

        {/* <Link to="about" smooth={true} duration={500} className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <div className="scroll-arrow">
            <FaArrowDown />
          </div>
        </Link> */}
      </div>

      <div className="hero-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  );
};

export default Hero;