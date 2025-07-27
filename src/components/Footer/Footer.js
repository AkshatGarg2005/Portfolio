// src/components/Footer/Footer.js
import React from 'react';
import { FaHeart, FaCode, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <h3>Akshat Garg</h3>
            <p>Passionate about creating innovative solutions that make a difference.</p>
            
            <div className="footer-social">
              <a href="https://github.com/AkshatGarg2005" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/akshat-garg-vitbhopal" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="mailto:akshatgarg0280@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <p>📧 akshatgarg0280@gmail.com</p>
            <p>📱 +91 8894699422</p>
            <p>📍 Bhopal, MP, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © {currentYear} Akshat Garg. Built with <FaHeart className="heart" /> and <FaCode />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;