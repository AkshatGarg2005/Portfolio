// src/components/Education/Education.js
import React from 'react';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Education.css';

const Education = () => {
  const educationData = [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution: 'VIT Bhopal University',
      location: 'Bhopal, M.P., India',
      period: 'Sep 2023 – May 2027 (Expected)',
      grade: 'CGPA: 8.42/10',
      highlights: [
        'Relevant Coursework: Data Structures, Algorithms, Machine Learning, Web Development',
        'Active member of technical clubs and hackathon participant'
      ]
    },
    {
      degree: 'Class XII (CBSE)',
      institution: "St. Luke's Sr. Sec. School",
      location: 'Solan, Himachal Pradesh, India',
      period: '2023',
      grade: '83%',
      highlights: [
        'Science Stream with Computer Science',
        'School topper in Computer Science'
      ]
    },
    {
      degree: 'Class X (CBSE)',
      institution: "St. Luke's Sr. Sec. School",
      location: 'Solan, Himachal Pradesh, India',
      period: '2021',
      grade: '90.17%',
      highlights: [
        'Achieved distinction in Mathematics and Science',
        'Active participant in school tech competitions'
      ]
    }
  ];

  return (
    <section id="education" className="education">
      <div className="container">
        <h2>Education</h2>
        <div className="education-timeline">
          {educationData.map((edu, index) => (
            <div key={index} className={`education-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="education-card fade-in">
                <div className="education-icon">
                  <FaGraduationCap />
                </div>
                <h3>{edu.degree}</h3>
                <h4>{edu.institution}</h4>
                <div className="education-details">
                  <span className="education-location">
                    <FaMapMarkerAlt /> {edu.location}
                  </span>
                  <span className="education-period">
                    <FaCalendarAlt /> {edu.period}
                  </span>
                </div>
                <p className="education-grade">{edu.grade}</p>
                <ul className="education-highlights">
                  {edu.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="timeline-line"></div>
        </div>
      </div>
    </section>
  );
};

export default Education;