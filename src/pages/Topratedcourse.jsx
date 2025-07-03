import React, { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";

const Topratedcourses = () => {
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/E_Learning_System/src/data/courses.json");
        const data = await response.json();

        const filtered = data.filter((course) => course.reviews >= 4);
        setTopCourses(filtered);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };

    loadCourses();
  }, []);

  const getStarsHTML = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = "";
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star text-warning"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star text-warning"></i>';
    }
    return `<div class="mb-2">${stars}</div>`;
  };

  const cardsPerSlide = 3;

  const chunkedSlides = [];
  for (let i = 0; i < topCourses.length; i += cardsPerSlide) {
    chunkedSlides.push(topCourses.slice(i, i + cardsPerSlide));
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Top Rated Courses</h2>

      {topCourses.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Carousel interval={5000}>
          {chunkedSlides.map((slide, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {slide.map((course, i) => (
                  <div className="card" key={i} style={{ width: "18rem", backgroundColor: "#2e2e2e", color: "white" }}>
                    <img
                      src={course.thumbnail}
                      className="card-img-top"
                      alt={course.title}
                      style={{ height: "160px", objectFit: "contain", padding: "10px" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{course.title}</h5>
                      <div dangerouslySetInnerHTML={{ __html: getStarsHTML(course.reviews) }} />
                      <p className="text-light">{course.reviews} stars</p>
                      <p className="card-text">{course.description}</p>
                      <button className="btn enroll-btn" style={{ backgroundColor: "orange", fontWeight: "bold", border: "none", color: "black" }}>
                        Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default topratedCourses;
