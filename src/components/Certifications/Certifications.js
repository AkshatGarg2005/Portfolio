// src/components/Certifications/Certifications.js
import React, { useState } from 'react';
import { FaCertificate, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import './Certifications.css';

const Certifications = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const certifications = [
    {
      title: 'Oracle Certified Java Foundations Associate',
      issuer: 'Oracle',
      category: 'programming',
      description: 'Achieved global certification in core Java programming fundamentals.',
      icon: '☕'
    },
    {
      title: 'Introduction to Machine Learning',
      issuer: 'NPTEL (12-week IIT course)',
      category: 'ml',
      description: 'Government-recognized certification in ML, covering algorithms and applications.',
      icon: '🤖'
    },
    {
      title: 'Bits and Bytes of Computer Networking',
      issuer: 'Google (Coursera)',
      category: 'networking',
      description: 'Completed networking fundamentals course covering OSI model, TCP/IP, and network services.',
      icon: '🌐'
    },
    {
      title: 'Postman API Fundamentals Student Expert',
      issuer: 'Postman',
      category: 'development',
      description: 'Gained expertise in API development and testing, validated by Postman Student Expert program.',
      icon: '🚀'
    },
    {
      title: 'Full-Stack Web Development Program (Bronze)',
      issuer: 'TechBairn',
      category: 'development',
      description: 'Intensive hands-on training in MERN stack web development with a Bronze certification.',
      icon: '💻'
    },
    {
      title: 'SQL (Basic) Certificate',
      issuer: 'HackerRank',
      category: 'database',
      description: 'Demonstrated proficiency in basic SQL queries and database manipulation on HackerRank platform.',
      icon: '🗄️'
    },
    {
      title: 'DSA Course (Alpha)',
      issuer: 'Apna College',
      category: 'programming',
      description: 'Completed a comprehensive Data Structures and Algorithms program in Java, strengthening problem-solving skills.',
      icon: '📊'
    },
    {
      title: 'Decode DSA with C++',
      issuer: 'PW Skills',
      category: 'programming',
      description: 'Underwent in-depth training in algorithms using C++, focusing on optimized solutions for coding interviews.',
      icon: '⚡'
    },
    {
      title: 'MATLAB Onramp',
      issuer: 'MathWorks',
      category: 'tools',
      description: 'Finished introductory MATLAB course, building a foundation in scientific computing and simulation.',
      icon: '📈'
    },
    {
      title: 'Linux Basics',
      issuer: 'Great Learning',
      category: 'tools',
      description: 'Acquired fundamental knowledge of Linux commands, system navigation, and shell scripting.',
      icon: '🐧'
    },
    {
      title: 'Prompt Engineering for ChatGPT',
      issuer: 'Great Learning',
      category: 'ml',
      description: 'Learned advanced techniques for designing effective prompts for large language models (LLMs).',
      icon: '🧠'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'programming', label: 'Programming', icon: '💻' },
    { id: 'ml', label: 'Machine Learning', icon: '🤖' },
    { id: 'development', label: 'Development', icon: '🚀' },
    { id: 'database', label: 'Database', icon: '🗄️' },
    { id: 'networking', label: 'Networking', icon: '🌐' },
    { id: 'tools', label: 'Tools', icon: '🛠️' }
  ];

  const filteredCertifications = activeCategory === 'all' 
    ? certifications 
    : certifications.filter(cert => cert.category === activeCategory);

  return (
    <section id="certifications" className="certifications">
      <div className="container">
        <h2>Certifications & Achievements</h2>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="certifications-grid">
          {filteredCertifications.map((cert, index) => (
            <div key={index} className="certification-card fade-in">
              <div className="cert-icon">{cert.icon}</div>
              <div className="cert-content">
                <h3>{cert.title}</h3>
                <p className="cert-issuer">
                  <FaAward /> {cert.issuer}
                </p>
                <p className="cert-description">{cert.description}</p>
              </div>
              <div className="cert-badge">
                <FaCertificate />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;