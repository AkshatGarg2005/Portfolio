// src/components/Projects/Projects.js
import React, { useState, useRef, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaCode, FaRocket } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const projectsContainerRef = useRef(null);

  const projects = [
    {
      title: 'SecondSons – Unified Local-Commerce Super-App',
      period: 'Jul 2025 - Ongoing',
      description: 'A comprehensive platform combining five verticals: food ordering, on-demand services, cab booking, stays & rentals, and quick commerce—all with one login and unified cart/booking flow.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker', 'Redis'],
      features: [
        'Architected single platform with five integrated verticals',
        'Built vendor onboarding and catalog management',
        'Implemented dynamic pricing and order lifecycle',
        'Led end-to-end development solo'
      ],
      type: 'Full-Stack Product',
      githubUrl: 'https://github.com/AkshatGarg2005/SecondSons',
      icon: '🚀',
      gradient: 'gradient-1'
    },
    {
      title: 'AgriSense – Smart Farming System',
      period: 'Apr 2025',
      description: 'IoT-based agriculture automation system with real-time monitoring and ML-powered predictions for crop health and irrigation needs.',
      technologies: ['ESP32', 'React', 'MongoDB', 'Python', 'TensorFlow', 'MQTT'],
      features: [
        'Developed sensor nodes for soil moisture, temperature, humidity monitoring',
        'Implemented ML models for crop health prediction',
        'Reduced expected crop losses by 20% through proactive alerts',
        'Real-time dashboard for farm monitoring'
      ],
      type: 'IoT & Machine Learning',
      githubUrl: 'https://github.com/AkshatGarg2005/AgriSense',
      icon: '🌱',
      gradient: 'gradient-2'
    },
    {
      title: 'ThermoSense – Cross-Platform Sensor Dashboard',
      period: 'Jul 2025',
      description: 'Cross-platform device health dashboard with Random Forest model for battery health prediction achieving ~90% accuracy.',
      technologies: ['FastAPI', 'React', 'Docker', 'Random Forest', 'Python', 'WebSocket'],
      features: [
        'Engineered cross-platform dashboard with containerized deployment',
        'Integrated OS-level sensors for real-time data capture',
        'Built ML model for battery health trend prediction',
        'Seamless performance across Windows and macOS'
      ],
      type: 'IoT/ML System Monitoring',
      githubUrl: 'https://github.com/AkshatGarg2005/ThermoSense',
      icon: '📊',
      gradient: 'gradient-3'
    },
    {
      title: 'ShaktiPath – Women Safety Navigation App',
      period: 'May 2025',
      description: 'AI-powered safe route planning application prioritizing well-lit, secure paths with real-time GPS tracking and SOS alerts.',
      technologies: ['React (TypeScript)', 'Supabase', 'Leaflet APIs', 'Google Maps', 'PWA'],
      features: [
        'Developed AI-powered safe route planning algorithm',
        'Analyzed five safety factors for route optimization',
        'Implemented real-time GPS tracking',
        'One-tap SOS alert feature for emergencies'
      ],
      type: 'Hackathon Project',
      githubUrl: 'https://github.com/AkshatGarg2005/ShaktiPath',
      icon: '🛡️',
      gradient: 'gradient-4'
    },
    {
      title: 'IntelliQrHelp – Smart Emergency Response System',
      period: 'Jan 2025 – Feb 2025',
      description: 'Emergency platform delivering critical medical information to first responders via QR codes with IoT SOS integration.',
      technologies: ['React', 'Firebase', 'IoT (ESP8266)', 'Telegram API', 'QR Generation'],
      features: [
        'Co-developed emergency response platform',
        'Secure QR codes linked to medical profiles',
        'Integrated Telegram bot for real-time alerts',
        'ESP8266-based IoT SOS button'
      ],
      type: 'Health Hackathon Project',
      githubUrl: 'https://github.com/AkshatGarg2005/intelliqrhelp',
      icon: '🚨',
      gradient: 'gradient-5'
    }
  ];

  const gradients = {
    'gradient-1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'gradient-2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'gradient-3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'gradient-4': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'gradient-5': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevProject();
      if (e.key === 'ArrowRight') nextProject();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveProject((prev) => (prev + 1) % projects.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevProject = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Touch handling for mobile swipe
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) nextProject();
      if (touchEndX > touchStartX + 50) prevProject();
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isAnimating]);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="animate-on-scroll">Featured Projects</h2>
        
        <div className="projects-container" ref={projectsContainerRef}>
          <div className="projects-track">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`project-card-3d ${index === activeProject ? 'active' : ''}`}
                style={{
                  '--gradient': gradients[project.gradient],
                  transform: `translateX(${(index - activeProject) * 105}%)`,
                  opacity: Math.abs(index - activeProject) <= 1 ? 1 : 0,
                  pointerEvents: index === activeProject ? 'all' : 'none'
                }}
              >
                <div className="project-card-inner">
                  <div className="project-card-front">
                    <div className="project-icon">{project.icon}</div>
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span className="project-type">{project.type}</span>
                    </div>
                    
                    <p className="project-period">{project.period}</p>
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-features">
                      <h4><FaCode /> Key Features</h4>
                      <ul>
                        {project.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="project-footer">
                      <div className="project-technologies">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      
                      <div className="project-links">
                        <a href={project.githubUrl} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="project-link">
                          <FaGithub /> 
                          <span>View Code</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="project-nav project-nav-prev" onClick={prevProject}>
            <FaChevronLeft />
          </button>
          
          <button className="project-nav project-nav-next" onClick={nextProject}>
            <FaChevronRight />
          </button>
        </div>
        
        <div className="project-indicators">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeProject ? 'active' : ''}`}
              onClick={() => !isAnimating && setActiveProject(index)}
            >
              <span className="indicator-fill" 
                    style={{ '--gradient': gradients[projects[index].gradient] }}></span>
            </button>
          ))}
        </div>

        <div className="projects-hint animate-on-scroll">
          <p>
            <FaRocket /> Use arrow keys or swipe to navigate • Click indicators to jump to a project
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;