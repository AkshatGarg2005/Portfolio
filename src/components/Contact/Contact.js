// src/components/Contact/Contact.js
import React from 'react';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: 'akshatgarg0280@gmail.com',
      link: 'mailto:akshatgarg0280@gmail.com',
      color: '#ea4335'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      value: '+91 8894699422',
      link: 'tel:+918894699422',
      color: '#25d366'
    },
    {
      icon: <FaLinkedin />,
      title: 'LinkedIn',
      value: 'akshat-garg-vitbhopal',
      link: 'https://linkedin.com/in/akshat-garg-vitbhopal',
      color: '#0077b5'
    },
    {
      icon: <FaGithub />,
      title: 'GitHub',
      value: 'AkshatGarg2005',
      link: 'https://github.com/AkshatGarg2005',
      color: '#333'
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Get In Touch</h2>
        
        <div className="contact-wrapper">
          <div className="contact-intro">
            <h3>Let's Connect & Build Something Amazing</h3>
            <p>
              I'm always interested in hearing about new opportunities and exciting projects. 
              Whether you're looking for a developer, have a question, or just want to connect, 
              I'd love to hear from you!
            </p>
            <p>
              Feel free to reach out through any of the channels below, and I'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="contact-grid">
            {contactInfo.map((info, index) => (
              <a 
                key={index} 
                href={info.link} 
                className="contact-card" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ '--accent-color': info.color }}
              >
                <div className="contact-card-icon">{info.icon}</div>
                <div className="contact-card-content">
                  <h4>{info.title}</h4>
                  <p>{info.value}</p>
                </div>
                <div className="contact-card-arrow">
                  <FaArrowRight />
                </div>
              </a>
            ))}
          </div>
          
          <div className="contact-footer">
            <div className="location">
              <FaMapMarkerAlt />
              <span>Currently based in Bhopal, Madhya Pradesh, India</span>
            </div>
            <p className="availability">
              ✨ Available for internships and full-time opportunities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;