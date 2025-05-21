import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000';

const sampleCourses = [
  { id: 1, title: 'React Basics', image: 'https://www.patterns.dev/img/reactjs/react-logo@3x.svg' },
  { id: 2, title: 'Node.js Fundamentals', image: 'https://technokeylearning.com/assets/img/service/node-js.jpg' },
  { id: 3, title: 'Full Stack Dev', image: 'https://www.shutterstock.com/image-vector/full-stack-developer-programmer-who-260nw-2273927175.jpg' },
];

const CourseCard = ({ course, isWishlisted, onToggle }) => (
  <div className="card m-2" style={{ width: '18rem' }}>
    <img src={course.image} className="card-img-top" alt={course.title} />
    <div className="card-body">
      <h5 className="card-title">{course.title}</h5>
      <button
        className={`btn ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
        onClick={() => onToggle(course.id)}
      >
        {isWishlisted ? '♥ Saved' : '♡ Save'}
      </button>
    </div>
  </div>
);

function HomePage() {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = async (courseId) => {
    const isSaved = wishlist.includes(courseId);
    try {
      if (isSaved) {
        await axios.delete(`${API_URL}/wishlist/${courseId}`);
        setWishlist(wishlist.filter(id => id !== courseId));
        alert('Removed from wishlist!');
      } else {
        await axios.post(`${API_URL}/wishlist`, { userId: 1, courseId });
        setWishlist([...wishlist, courseId]);
        alert('Added to wishlist!');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/wishlist`)
      .then(res => setWishlist(res.data.map(item => item.courseId)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Courses</h2>
      <div className="d-flex flex-wrap">
        {sampleCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            isWishlisted={wishlist.includes(course.id)}
            onToggle={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}

function WishlistPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/wishlist`)
      .then(res => {
        const wishlistedCourseIds = res.data.map(item => item.courseId);
        setCourses(sampleCourses.filter(c => wishlistedCourseIds.includes(c.id)));
      })
      .catch(err => console.error(err));
  }, []);

  const removeFromWishlist = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/wishlist/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Removed from wishlist!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">My Wishlist</h2>
      <div className="d-flex flex-wrap">
        {courses.length > 0 ? courses.map(course => (
          <div key={course.id} className="card m-2" style={{ width: '18rem' }}>
            <img src={course.image} className="card-img-top" alt={course.title} />
            <div className="card-body">
              <h5 className="card-title">{course.title}</h5>
              <button
                className="btn btn-danger"
                onClick={() => removeFromWishlist(course.id)}
              >
                Remove
              </button>
            </div>
          </div>
        )) : <p>No courses in wishlist.</p>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">Udemy Clone</Link>
        <div className="ml-auto">
          <Link className="btn btn-outline-primary me-2" to="/">Home</Link>
          <Link className="btn btn-outline-success" to="/wishlist">Wishlist</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </Router>
  );
}
