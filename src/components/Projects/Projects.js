// src/components/Projects/Projects.js
import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      title: 'SecondSons – Unified Local-Commerce Super-App',
      period: 'Jul 2025 - Ongoing',
      description: 'A comprehensive platform combining five verticals: food ordering, on-demand services, cab booking, stays & rentals, and quick commerce—all with one login and unified cart/booking flow.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      features: [
        'Architected single platform with five integrated verticals',
        'Built vendor onboarding and catalog management',
        'Implemented dynamic pricing and order lifecycle',
        'Led end-to-end development solo'
      ],
      type: 'Full-Stack Product'
    },
    {
      title: 'AgriSense – Smart Farming System',
      period: 'Apr 2025',
      description: 'IoT-based agriculture automation system with real-time monitoring and ML-powered predictions for crop health and irrigation needs.',
      technologies: ['ESP32', 'React', 'MongoDB', 'Python', 'TensorFlow'],
      features: [
        'Developed sensor nodes for soil moisture, temperature, humidity monitoring',
        'Implemented ML models for crop health prediction',
        'Reduced expected crop losses by 20% through proactive alerts',
        'Real-time dashboard for farm monitoring'
      ],
      type: 'IoT & Machine Learning'
    },
    {
      title: 'ThermoSense – Cross-Platform Sensor Dashboard',
      period: 'Jul 2025',
      description: 'Cross-platform device health dashboard with Random Forest model for battery health prediction achieving ~90% accuracy.',
      technologies: ['FastAPI', 'React', 'Docker', 'Random Forest', 'Python'],
      features: [
        'Engineered cross-platform dashboard with containerized deployment',
        'Integrated OS-level sensors for real-time data capture',
        'Built ML model for battery health trend prediction',
        'Seamless performance across Windows and macOS'
      ],
      type: 'IoT/ML System Monitoring'
    },
    {
      title: 'ShaktiPath – Women Safety Navigation App',
      period: 'May 2025',
      description: 'AI-powered safe route planning application prioritizing well-lit, secure paths with real-time GPS tracking and SOS alerts.',
      technologies: ['React (TypeScript)', 'Supabase', 'Leaflet APIs', 'Google Maps'],
      features: [
        'Developed AI-powered safe route planning algorithm',
        'Analyzed five safety factors for route optimization',
        'Implemented real-time GPS tracking',
        'One-tap SOS alert feature for emergencies'
      ],
      type: 'Hackathon Project'
    },
    {
      title: 'IntelliQrHelp – Smart Emergency Response System',
      period: 'Jan 2025 – Feb 2025',
      description: 'Emergency platform delivering critical medical information to first responders via QR codes with IoT SOS integration.',
      technologies: ['React', 'Firebase', 'IoT (ESP8266)', 'Telegram API'],
      features: [
        'Co-developed emergency response platform',
        'Secure QR codes linked to medical profiles',
        'Integrated Telegram bot for real-time alerts',
        'ESP8266-based IoT SOS button'
      ],
      type: 'Health Hackathon Project'
    }
  ];

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        
        <div className="projects-showcase">
          <button className="project-nav project-nav-prev" onClick={prevProject}>
            <FaChevronLeft />
          </button>
          
          <div className="project-carousel">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`project-card ${index === activeProject ? 'active' : ''}`}
                style={{
                  transform: `translateX(calc(-50% + ${(index - activeProject) * 105}%))`,
                  left: '50%',
                  opacity: index === activeProject ? 1 : 0.3,
                  pointerEvents: index === activeProject ? 'all' : 'none'
                }}
              >
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className="project-type">{project.type}</span>
                </div>
                
                <p className="project-period">{project.period}</p>
                <p className="project-description">{project.description}</p>
                
                <div className="project-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {project.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a href="https://github.com/AkshatGarg2005" target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaGithub /> View Code
                  </a>
                  {/* <a href="#" onClick={(e) => { e.preventDefault(); alert('Live demo coming soon!'); }} className="project-link">
                    <FaExternalLinkAlt /> Live Demo
                  </a> */}
                </div>
              </div>
            ))}
          </div>
          
          <button className="project-nav project-nav-next" onClick={nextProject}>
            <FaChevronRight />
          </button>
        </div>
        
        <div className="project-indicators">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeProject ? 'active' : ''}`}
              onClick={() => setActiveProject(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;