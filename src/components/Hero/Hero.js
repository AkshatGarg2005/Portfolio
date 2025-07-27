// src/components/Hero/Hero.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaArrowDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const roles = ['Full-Stack Developer', 'AI Enthusiast', 'IoT Developer', 'Problem Solver'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const currentRole = roles[roleIndex];

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(currentRole.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex(charIndex + (isDeleting ? -1 : 1));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <div className="hero-particles"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <h3 className="hero-greeting fade-in">Hello, I'm</h3>
          <h1 className="hero-name fade-in">Akshat Garg</h1>
          <div className="hero-role fade-in">
            <span>I'm a </span>
            <span className="typed-text">{typedText}</span>
            <span className="cursor">|</span>
          </div>
          <p className="hero-description fade-in">
            Third-year Computer Science student passionate about creating innovative solutions 
            using AI, IoT, and full-stack development. Currently studying at VIT Bhopal.
          </p>
          
          <div className="hero-buttons fade-in">
            <Link to="contact" smooth={true} duration={500} className="btn">
              Get In Touch
            </Link>
            <a 
              href="/resume.pdf" 
              className="btn btn-outline"
              download="Akshat_Garg_Resume.pdf"
            >
              Download Resume
            </a>
          </div>

          <div className="hero-social fade-in">
            <a href="https://github.com/AkshatGarg2005" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/akshat-garg-vitbhopal" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:akshatgarg0280@gmail.com">
              <FaEnvelope />
            </a>
            <a href="tel:+918894699422">
              <FaPhone />
            </a>
          </div>
        </div>

        <Link to="about" smooth={true} duration={500} className="scroll-down">
          <FaArrowDown />
        </Link>
      </div>
    </section>
  );
};

export default Hero;