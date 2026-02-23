import React, { useState, useEffect } from 'react';
import './BannerCarousel.css';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner data - you can replace these with your own images
  const banners = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Shop the latest trends at unbeatable prices",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      backgroundColor: "#FF6B6B",
      textColor: "#FFFFFF"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh Collection 2024",
      description: "Discover the newest additions to our store",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      backgroundColor: "#4ECDC4",
      textColor: "#FFFFFF"
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On All Orders",
      description: "No minimum purchase required",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      backgroundColor: "#95E1D3",
      textColor: "#2C3E50"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="banner-carousel">
      <div className="carousel-container">
        
        {/* Slides */}
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="carousel-slide"
              style={{ backgroundColor: banner.backgroundColor }}
            >
              <div className="slide-content">
                <div 
                  className="slide-text"
                  style={{ color: banner.textColor }}
                >
                  <h1 className="slide-title">{banner.title}</h1>
                  <h2 className="slide-subtitle">{banner.subtitle}</h2>
                  <p className="slide-description">{banner.description}</p>
                  <button className="shop-now-btn">Shop Now</button>
                </div>
                <div className="slide-image">
                  <img src={banner.image} alt={banner.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-arrow prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-arrow next" onClick={nextSlide}>
          ›
        </button>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
