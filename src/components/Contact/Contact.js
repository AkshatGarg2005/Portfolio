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
      color: '#ea4335',
      gradient: 'linear-gradient(135deg, #ea4335, #fbbc04)'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      value: '+91 8894699422',
      link: 'tel:+918894699422',
      color: '#25d366',
      gradient: 'linear-gradient(135deg, #25d366, #128c7e)'
    },
    {
      icon: <FaLinkedin />,
      title: 'LinkedIn',
      value: 'akshat-garg-vitbhopal',
      link: 'https://linkedin.com/in/akshat-garg-vitbhopal',
      color: '#0077b5',
      gradient: 'linear-gradient(135deg, #0077b5, #00a0dc)'
    },
    {
      icon: <FaGithub />,
      title: 'GitHub',
      value: 'AkshatGarg2005',
      link: 'https://github.com/AkshatGarg2005',
      color: '#333',
      gradient: 'linear-gradient(135deg, #333, #6e5494)'
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="animate-on-scroll">Get In Touch</h2>
        
        <div className="contact-wrapper">
          <div className="contact-intro animate-on-scroll">
            <h3>Let's <span className="gradient-text">Connect</span> & Build Something <span className="gradient-text">Amazing</span></h3>
            <p>
              I'm always interested in hearing about new opportunities and exciting projects. 
              Whether you're looking for a developer, have a question, or just want to connect, 
              I'd love to hear from you!
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-cards">
              {contactInfo.map((info, index) => (
                <a 
                  key={index} 
                  href={info.link} 
                  className="contact-card animate-on-scroll" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    '--card-gradient': info.gradient,
                    '--card-color': info.color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="card-content">
                    <div className="card-icon">{info.icon}</div>
                    <div className="card-info">
                      <h5>{info.title}</h5>
                      <p>{info.value}</p>
                    </div>
                    <FaArrowRight className="card-arrow" />
                  </div>
                  <div className="card-bg"></div>
                </a>
              ))}
            </div>
            
            <div className="contact-footer animate-on-scroll">
              <div className="location">
                <FaMapMarkerAlt />
                <span>Currently based in Bhopal, Madhya Pradesh, India</span>
              </div>
              <div className="availability-badge">
                <span className="availability-dot"></span>
                <span>Available for opportunities</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-background">
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;