import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import courseData from '../data/courses.json';//import 'bootstrap-icons/font/bootstrap-icons.css';
//import '@fortawesome/fontawesome-free/css/all.min.css';
//import '../assets/styles.css';

const CoursesPage = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', video: '', thumbnail: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [reviewCourseIndex, setReviewCourseIndex] = useState(null);
  const [newReview, setNewReview] = useState('');

  useEffect(() => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  setUser(loggedInUser);

  setCourses(courseData); // directly set from imported file
  localStorage.setItem('courses', JSON.stringify(courseData)); // optional
}, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.hash = 'login';
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const saveCourse = (e) => {
    e.preventDefault();
    const updatedCourses = [...courses];
    const newCourse = { ...formData, reviews: 5 };

    if (editIndex !== null) {
      updatedCourses[editIndex] = newCourse;
    } else {
      updatedCourses.push(newCourse);
    }

    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setEditIndex(null);
    setFormData({ title: '', category: '', description: '', video: '', thumbnail: '' });
    window.location.reload();
  };

  const filteredCourses = courses.filter((course) => {
    return (
      (filter === 'all' || course.category === filter) &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openEditModal = (index) => {
    setEditIndex(index);
    setFormData(courses[index]);
  };

  const deleteCourse = (index) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = [...courses];
      updatedCourses.splice(index, 1);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      window.location.reload();
    }
  };

  const submitReview = () => {
    if (!newReview.trim()) return;
    const updatedCourses = [...courses];
    const course = updatedCourses[reviewCourseIndex];
    course.reviewsText = course.reviewsText || [];
    course.reviewsText.push(newReview);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setNewReview('');
    window.location.reload();
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="d-flex justify-content-between align-items-center px-4 py-2" style={{ backgroundColor: '#4d78b9' }}>
        <a href="/" className="nav-logo d-flex align-items-center">
          <img src="/assets/images/image.jpg" alt="EduSphere Logo" style={{ height: '50px' }} />
        </a>
        <div className="nav-links d-flex align-items-center gap-4">
          <a href="#home" className="text-white">Home</a>
          <a href="#courses" className="text-white">Courses</a>
          <a href="#topratedcourses" className="text-white">Top Rated Courses</a>
          {user && (
            <div className="dropdown">
              <a className="d-flex align-items-center text-white text-decoration-none" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle fs-3"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end text-center" aria-labelledby="userDropdown">
                <li><h6 className="dropdown-header">{user.name}</h6></li>
                <li><span className="dropdown-item-text text-muted">{user.role}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Admin Controls */}
      {user?.role === 'admin' && (
        <div className="container mt-4 text-end">
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addCourseModal">+ Add New Course</button>
        </div>
      )}

      {/* Filters */}
      <section className="container my-4">
        <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
        <select id="categoryFilter" className="form-select w-auto" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="business">Business</option>
          <option value="data-science">Data Science</option>
        </select>
      </section>

      <div className="container mb-4">
        <label htmlFor="searchInput" className="form-label">Search Courses by Title:</label>
        <input
          type="text"
          id="searchInput"
          className="form-control w-50"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Course Cards */}
      <section className="container">
        <div className="row" id="courseList">
          {filteredCourses.map((course, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={course.thumbnail} className="card-img-top" alt={course.title} />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <button className="btn btn-sm btn-primary preview-btn me-2" data-bs-toggle="modal" data-bs-target="#videoModal" onClick={() => setVideoUrl(course.video)}>
                    <i className="bi bi-play-circle"></i> Preview
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <button className="btn btn-sm btn-warning me-2 edit-btn" data-bs-toggle="modal" data-bs-target="#addCourseModal" onClick={() => openEditModal(index)}>Edit</button>
                      <button className="btn btn-sm btn-danger delete-btn" onClick={() => deleteCourse(index)}>Delete</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-info ms-2 review-btn" data-bs-toggle="modal" data-bs-target="#reviewModal" onClick={() => setReviewCourseIndex(index)}>Reviews</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <div className="modal fade" id="videoModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Course Preview</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="ratio ratio-16x9">
                <iframe src={videoUrl} allowFullScreen allow="autoplay"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <div className="modal fade" id="reviewModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Course Reviews</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <h6 className="text-primary">{reviewCourseIndex !== null && courses[reviewCourseIndex].title}</h6>
              <div>{reviewCourseIndex !== null && (courses[reviewCourseIndex].reviewsText?.join(' | ') || 'No reviews yet.')}</div>
              <textarea
                className="form-control mt-2"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write a review..."
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={submitReview}>Submit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" id="addCourseModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={saveCourse}>
              <div className="modal-header">
                <h5 className="modal-title text-primary">Add / Edit Course</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input type="hidden" value={editIndex || ''} />
                {['title', 'category', 'description', 'video', 'thumbnail'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {field === 'description' ? (
                      <textarea id={field} className="form-control" rows="3" value={formData[field]} onChange={handleInputChange} required></textarea>
                    ) : (
                      <input
                        type={field.includes('url') || field === 'video' || field === 'thumbnail' ? 'url' : 'text'}
                        id={field}
                        className="form-control"
                        value={formData[field]}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
