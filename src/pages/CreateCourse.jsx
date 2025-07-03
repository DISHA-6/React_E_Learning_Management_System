import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    video: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || user.role !== 'admin') {
      alert('Access denied!');
      navigate('/dashboard');
    } else {
      const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
      setCourses(storedCourses);
    }
  }, [navigate]);

  const convertToEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    } else {
      alert('Please enter a valid YouTube video URL.');
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const embedUrl = convertToEmbedUrl(formData.video);
    if (!embedUrl) return;

    const newCourse = { ...formData, video: embedUrl };
    const updatedCourses = [...courses, newCourse];
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
    setFormData({ title: '', description: '', image: '', video: '' });
  };

  const deleteCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <a href="/" className="navbar-brand">
          <img src="/assets/images/image.jpg" alt="EduSphere Logo" style={{ height: '40px' }} />
        </a>
        <div className="navbar-nav ms-auto">
          <a className="nav-link text-white" href="#home">Home</a>
          <a className="nav-link text-white" href="#courses">Courses</a>
          <a className="nav-link fw-bold text-warning" href="#topratedcourses">Top Rated Courses</a>
        </div>
      </nav>

      <main className="container py-5">
        <h1 className="text-center text-primary mb-4">Create a Course</h1>

        <form className="bg-white p-4 rounded shadow-sm mb-5" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" id="title" className="form-control" placeholder="Course Title" required value={formData.title} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <textarea id="description" className="form-control" placeholder="Course Description" rows="4" required value={formData.description} onChange={handleInputChange}></textarea>
          </div>
          <div className="mb-3">
            <input type="text" id="image" className="form-control" placeholder="Image URL" required value={formData.image} onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <input type="text" id="video" className="form-control" placeholder="Video URL" required value={formData.video} onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-primary">Create Course</button>
        </form>

        <div id="courseList">
          {courses.map((course, index) => (
            <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3" key={index}>
              <img src={course.image} alt="Course" className="img-fluid" style={{ maxWidth: '200px', borderRadius: '6px' }} />
              <div className="flex-grow-1">
                <h3 className="text-primary">{course.title}</h3>
                <p>{course.description}</p>
                <a href={course.video} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mb-2">📺 Watch Video</a><br />
                <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CreateCoursePage;
