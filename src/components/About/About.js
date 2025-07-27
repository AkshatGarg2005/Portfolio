// src/components/About/About.js
import React from 'react';
import { FaCode, FaBrain, FaRocket, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
  const highlights = [
    {
      icon: <FaCode />,
      title: 'Full-Stack Development',
      description: 'Experienced in building end-to-end web applications using modern technologies'
    },
    {
      icon: <FaBrain />,
      title: 'AI & Machine Learning',
      description: 'Passionate about implementing ML models to solve real-world problems'
    },
    {
      icon: <FaRocket />,
      title: 'IoT Solutions',
      description: 'Creating innovative IoT systems for agriculture, safety, and monitoring'
    },
    {
      icon: <FaUsers />,
      title: 'Team Collaboration',
      description: 'Strong team player with excellent communication and leadership skills'
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-content">
          <div className="about-text slide-in-left">
            <p>
              I'm a passionate third-year Computer Science student at VIT Bhopal University with a 
              strong foundation in AI, IoT, and full-stack web development. My journey in tech has 
              been driven by a desire to create innovative solutions that make a real impact.
            </p>
            <p>
              With hands-on experience in developing projects ranging from smart farming systems to 
              emergency response platforms, I've demonstrated my ability to leverage cutting-edge 
              technologies like TensorFlow, React, Node.js, and IoT sensors to solve complex problems.
            </p>
            <p>
              I'm proficient in multiple programming languages including Python, Java, C++, and 
              JavaScript, and I'm always eager to learn new technologies. My multilingual abilities 
              (English, Hindi, and basic Japanese) complement my technical skills, making me an 
              effective communicator in diverse team environments.
            </p>
          </div>
          
          <div className="about-highlights slide-in-right">
            {highlights.map((item, index) => (
              <div key={index} className="highlight-card">
                <div className="highlight-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;