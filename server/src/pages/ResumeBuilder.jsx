import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

// --- Helper Functions & Initial State (No Changes) ---

const initialData = {
  personal: { name: '', email: '', phone: '', linkedIn: '', github: '', address: '' },
  education: [{ institution: '', degree: '', date: '', location: '' }],
  experience: [{ title: '', company: '', date: '', location: '', description: '' }],
  projects: [{ name: '', tech: '', date: '', description: '' }],
  skills: [{ category: 'Languages', details: '' }],
};

const sectionTemplates = {
  education: { institution: '', degree: '', date: '', location: '' },
  experience: { title: '', company: '', date: '', location: '', description: '' },
  projects: { name: '', tech: '', date: '', description: '' },
  skills: { category: '', details: '' },
};

const formatDataForPrompt = (data) => {
  const personal = `Name: ${data.personal.name}\nEmail: ${data.personal.email}\nPhone: ${data.personal.phone}\nLinkedIn: ${data.personal.linkedIn}\nGitHub: ${data.personal.github}\nAddress: ${data.personal.address}`;
  const education = data.education.map(edu => `- Institution: ${edu.institution}, Degree: ${edu.degree}, Date: ${edu.date}, Location: ${edu.location}`).join('\n');
  const experience = data.experience.map(exp => `- Company: ${exp.company}\n  Title: ${exp.title}\n  Date: ${exp.date}\n  Location: ${exp.location}\n  Description: ${exp.description}`).join('\n');
  const projects = data.projects.map(proj => `- Project: ${proj.name}\n  Tech: ${proj.tech}\n  Date: ${proj.date}\n  Description: ${proj.description}`).join('\n');
  const skills = data.skills.map(skill => `- ${skill.category}: ${skill.details}`).join('\n');
  return `Personal Details:\n${personal}\n\nEducation:\n${education}\n\nExperience:\n${experience}\n\nProjects:\n${projects}\n\nSkills:\n${skills}`;
};

// --- Main Resume Builder Component ---

const ResumeBuilder = () => {
  const [formData, setFormData] = useState(initialData);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const resumeRef = useRef();

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const handleSectionChange = (section, index, e) => {
    const { name, value } = e.target;
    const list = [...formData[section]];
    list[index][name] = value;
    setFormData(prev => ({ ...prev, [section]: list }));
  };

  const addSectionItem = (section) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], { ...sectionTemplates[section] }] }));
  };

  const removeSectionItem = (section, index) => {
    const list = [...formData[section]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [section]: list }));
  };

  const generateResume = async () => {
    setLoading(true);
    setResume(null);
    try {
      const promptDetails = formatDataForPrompt(formData);
      const response = await axios.post('/api/resume/generate', { details: promptDetails });
      setResume(response.data.resume);
    } catch (err) {
      console.error('Error generating resume:', err);
      alert('Resume generation failed. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${formData.personal.name || 'Resume'}-resume`,
    pageStyle: `@page { size: A4; margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; } }`,
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dynamic AI Resume Builder</h1>
          <p className="text-slate-500 mt-2">Fill in your details to create a professional resume in minutes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* --- Form Section --- */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
            <FormSection title="Personal Information" icon={<UserIcon />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                {Object.keys(formData.personal).map(key => (
                   <InputField key={key} name={key} value={formData.personal[key]} onChange={handlePersonalChange} />
                ))}
              </div>
            </FormSection>

            <DynamicFormSection title="Education" section="education" formData={formData.education} onChange={handleSectionChange} onAdd={() => addSectionItem('education')} onRemove={(index) => removeSectionItem('education', index)} icon={<AcademicCapIcon />} />
            <DynamicFormSection title="Work Experience" section="experience" formData={formData.experience} onChange={handleSectionChange} onAdd={() => addSectionItem('experience')} onRemove={(index) => removeSectionItem('experience', index)} icon={<BriefcaseIcon />} />
            <DynamicFormSection title="Projects" section="projects" formData={formData.projects} onChange={handleSectionChange} onAdd={() => addSectionItem('projects')} onRemove={(index) => removeSectionItem('projects', index)} icon={<LightBulbIcon />} />
            <DynamicFormSection title="Skills" section="skills" formData={formData.skills} onChange={handleSectionChange} onAdd={() => addSectionItem('skills')} onRemove={(index) => removeSectionItem('skills', index)} icon={<WrenchScrewdriverIcon />} />
            
            <button onClick={generateResume} disabled={loading} className="w-full mt-6 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
              {loading ? 'Generating...' : '✨ Generate Resume'}
            </button>
          </div>

          {/* --- Preview Section --- */}
          <div className="bg-slate-200 p-2 sm:p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-2xl font-bold text-slate-800">Preview</h2>
              {resume && (<button onClick={handlePrint} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Download PDF</button>)}
            </div>
            <div ref={resumeRef} className="p-8 bg-white text-black rounded-md shadow-inner min-h-[calc(29.7cm-40mm)] aspect-[1/1.414]">
              {resume ? <ResumePreview resume={resume} /> : <div className="flex items-center justify-center h-full text-slate-500">{loading ? 'AI is crafting your resume...' : 'Your generated resume will appear here.'}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Form Building ---

const FormSection = ({ title, icon, children }) => (
  <div className="space-y-5">
    <div className="flex items-center space-x-3">
      <span className="text-blue-500">{icon}</span>
      <h3 className="font-bold text-xl text-slate-800">{title}</h3>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

const DynamicFormSection = ({ title, section, formData, onChange, onAdd, onRemove, icon }) => (
  <FormSection title={title} icon={icon}>
    <div className="space-y-6">
      {formData.map((item, index) => (
        <div key={index} className="p-5 bg-slate-50 border border-slate-200 rounded-lg relative space-y-4 shadow-sm">
          {Object.keys(item).map(key => (
            key === 'description' ? 
            <TextAreaField key={key} name={key} value={item[key]} onChange={(e) => onChange(section, index, e)} /> :
            <InputField key={key} name={key} value={item[key]} onChange={(e) => onChange(section, index, e)} />
          ))}
          {formData.length > 1 && <button onClick={() => onRemove(index)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors h-6 w-6 flex items-center justify-center rounded-full hover:bg-red-100">&times;</button>}
        </div>
      ))}
      <button onClick={onAdd} className="w-full text-sm font-semibold text-blue-600 hover:text-blue-800 p-3 border-2 border-dashed border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all duration-200">+ Add New {title.endsWith('s') ? title.slice(0,-1) : title}</button>
    </div>
  </FormSection>
);

const InputField = ({ name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}</label>
        <input id={name} type="text" name={name} value={value} onChange={onChange} placeholder={`Enter ${name.toLowerCase()}`} className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm" />
    </div>
);

const TextAreaField = ({ name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder="Provide a detailed description..." rows="4" className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm" />
    </div>
);


// --- Sub-component for Resume Preview ---

const ResumePreview = ({ resume }) => (
  // FONT CHANGE: Switched from font-serif to font-sans for ATS friendliness
  <div className="text-sm font-sans">
    <div className="text-center mb-4">
      <h1 className="text-3xl font-bold">{resume.name}</h1>
      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
        <a href={`mailto:${resume.email}`} className="hover:underline break-all">{resume.email}</a>
        <span className="text-gray-400">|</span>
        <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">LinkedIn</a>
        <span className="text-gray-400">|</span>
        <a href={resume.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">GitHub</a>
      </div>
    </div>
    <div className="space-y-4">
      {resume.education && <PreviewSection title="Education">{resume.education.map((edu, i) => <div key={i} className="mb-2"><div className="flex justify-between font-bold"><p>{edu.institution}</p><p>{edu.location}</p></div><div className="flex justify-between italic text-xs"><p>{edu.degree}</p><p>{edu.date}</p></div></div>)}</PreviewSection>}
      {resume.experience && <PreviewSection title="Experience">{resume.experience.map((exp, i) => <div key={i} className="mb-3"><div className="flex justify-between font-bold"><p>{exp.title}</p><p>{exp.date}</p></div><div className="flex justify-between italic text-xs"><p>{exp.company}</p><p>{exp.location}</p></div><ul className="list-disc pl-5 mt-1 text-xs space-y-1">{exp.description?.map((desc, j) => <li key={j}>{desc}</li>)}</ul></div>)}</PreviewSection>}
      {resume.projects && <PreviewSection title="Projects">{resume.projects.map((proj, i) => <div key={i} className="mb-3"><div className="flex justify-between font-bold"><p>{proj.name} | <span className="font-normal italic text-xs">{proj.tech}</span></p><p>{proj.date}</p></div><ul className="list-disc pl-5 mt-1 text-xs space-y-1">{proj.description?.map((desc, j) => <li key={j}>{desc}</li>)}</ul></div>)}</PreviewSection>}
      {resume.skills && <PreviewSection title="Technical Skills">{Object.entries(resume.skills).map(([key, value]) => <div key={key} className="text-xs flex space-x-2"><p className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p><p>{value}</p></div>)}</PreviewSection>}
    </div>
  </div>
);

const PreviewSection = ({ title, children }) => (<div><h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">{title}</h2>{children}</div>);

// --- SVG Icons for Form ---

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default ResumeBuilder;
