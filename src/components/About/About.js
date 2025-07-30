// src/components/About/About.js
import React, { useEffect, useRef } from 'react';
import { FaCode, FaBrain, FaRocket, FaUsers, FaGlobe, FaAward } from 'react-icons/fa';
import './About.css';

const About = () => {
  const aboutRef = useRef(null);
  const cardsRef = useRef([]);

  const highlights = [
    {
      icon: <FaCode />,
      title: 'Full-Stack Development',
      description: 'Experienced in building end-to-end web applications using modern technologies',
      color: '#667eea',
      stats: '15+ Projects'
    },
    {
      icon: <FaBrain />,
      title: 'AI & Machine Learning',
      description: 'Passionate about implementing ML models to solve real-world problems',
      color: '#f093fb',
      stats: '5+ ML Projects'
    },
    {
      icon: <FaRocket />,
      title: 'IoT Solutions',
      description: 'Creating innovative IoT systems for agriculture, safety, and monitoring',
      color: '#4facfe',
      stats: '3+ IoT Systems'
    },
    {
      icon: <FaUsers />,
      title: 'Team Collaboration',
      description: 'Strong team player with excellent communication and leadership skills',
      color: '#fa709a',
      stats: '10+ Team Projects'
    }
  ];

  const achievements = [
    { icon: <FaGlobe />, text: 'Multilingual: English, Hindi, Basic Japanese' },
    { icon: <FaAward />, text: 'Oracle Certified Java Professional' },
    { icon: <FaCode />, text: '8.42 CGPA at VIT Bhopal' },
    { icon: <FaRocket />, text: 'Active Open Source Contributor' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = cardsRef.current;
      cards.forEach((card) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        card.style.setProperty('--rotation-x', `${y / 10}deg`);
        card.style.setProperty('--rotation-y', `${-x / 10}deg`);
      });
    };

    const handleMouseLeave = () => {
      const cards = cardsRef.current;
      cards.forEach((card) => {
        if (!card) return;
        card.style.setProperty('--rotation-x', '0deg');
        card.style.setProperty('--rotation-y', '0deg');
      });
    };

    const aboutSection = aboutRef.current;
    if (aboutSection) {
      aboutSection.addEventListener('mousemove', handleMouseMove);
      aboutSection.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (aboutSection) {
        aboutSection.removeEventListener('mousemove', handleMouseMove);
        aboutSection.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section id="about" className="about" ref={aboutRef}>
      <div className="container">
        <h2 className="animate-on-scroll">About Me</h2>
        
        <div className="about-container">
          <div className="about-content">
            <div className="about-text-section animate-on-scroll">
              <div className="about-intro">
                <h3>
                  <span className="gradient-text">Passionate Developer</span> & 
                  <span className="gradient-text"> Tech Enthusiast</span>
                </h3>
                <p>
                  I'm a third-year Computer Science student at VIT Bhopal University with a 
                  strong foundation in AI, IoT, and full-stack web development. My journey in tech has 
                  been driven by a desire to create innovative solutions that make a real impact.
                </p>
              </div>
              
              <div className="about-details">
                <p>
                  With hands-on experience in developing projects ranging from smart farming systems to 
                  emergency response platforms, I've demonstrated my ability to leverage cutting-edge 
                  technologies like TensorFlow, React, Node.js, and IoT sensors to solve complex problems.
                </p>
                <p>
                  I'm proficient in multiple programming languages including Python, Java, C++, and 
                  JavaScript, and I'm always eager to learn new technologies. Currently, I'm focused on 
                  building scalable applications and exploring the intersection of AI and web development.
                </p>
              </div>
              
              <div className="achievements-list">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item animate-on-scroll">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span className="achievement-text">{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="about-highlights">
              {highlights.map((item, index) => (
                <div 
                  key={index} 
                  className="highlight-card animate-on-scroll"
                  ref={el => cardsRef.current[index] = el}
                  style={{
                    '--card-color': item.color,
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="card-front">
                    <div className="highlight-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <div className="highlight-stats">{item.stats}</div>
                    <div className="card-glow"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="about-decorations">
            <div className="decoration-orb orb-1"></div>
            <div className="decoration-orb orb-2"></div>
            <div className="decoration-orb orb-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;