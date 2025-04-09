import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ('./search.css');

const TopTrades = () => {
  const [tradespeople, setTradespeople] = useState([
    {
      id: 1,
      name: 'Kola Adekunle',
      profession: 'Painter',
      verified: true,
      image: '/userProfile/kola.png',
      expertise: "Wiring, repairs, lighting, electrical upgrades",
      location: "Lagos, Nigeria",
      ratings: "★★★★★",
      biography: "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure.",
      jobs: "12",
    },
    {
      id: 2,
      name: 'Adewale OgunLeye',
      profession: 'Plumber',
      verified: true,
      image: '/userProfile/wale.png',
      expertise: "Wiring, repairs, lighting, electrical upgrades",
      location: "Lagos, Nigeria",
      ratings: "★★★★★",
      jobs: "25",
    },
    {
      id: 3,
      name: 'Zainab Suleiman',
      profession: 'Electrician',
      verified: true,
      image: '../userProfile/zainab.png',
      expertise: "Wiring, repairs, lighting, electrical upgrades",
      location: "Lagos, Nigeria",
      ratings: "★★★★★",
      jobs: "8",
    },
    {
      id: 4,
      name: 'Chinedu okafor',
      profession: 'Carpenter',
      verified: true,
      image: '/userProfile/okafor.png',
      expertise: "Wiring, repairs, lighting, electrical upgrades",
      location: "Lagos, Nigeria",
      ratings: "★★★★★",
      jobs: "42",
    }
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Ref for the scroll container
  const scrollContainerRef = useRef(null);
  // Track if we're in mobile view
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on component mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Filter tradespeople based on search term
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      const filtered = tradespeople.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.expertise && person.expertise.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPeople(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, tradespeople]);

  // Handle profile view click
  const handleViewProfile = (e, person) => {
    e.preventDefault(); // Prevent default link behavior
    
    sessionStorage.setItem('selectedTradesPerson', JSON.stringify(person));
    
   
    navigate(`/profile/${person.id}`);
  };

  // Navigation functions for mobile view
  const scrollPrevious = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 270; 
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 270; // Width of card + gap
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="top-trades">
  
      <div className="container"> 
        <h2 className="section-title" data-aos="fade-up" >
          Top Trades & Artisans <FiArrowRight size={25} />
        </h2> <br></br>
        
        
        {/* Search input within the component */}
        <div className="search-box" data-aos="fade-up">
        <FaMapMarkerAlt className="icon" color="white" size={40} />
  <input
    type="text"
    placeholder=" What skill are you looking?"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="trades-search-input"
  />
 
</div>
        <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : filteredPeople.length === 0 ? (
          <div className="no-results">No matching trades found</div>
        ) : ( 
          <div className="trades-container">
            <div 
              ref={scrollContainerRef}
              className="trades-scroll-container" 
              data-aos="fade-up" 
              data-aos-delay="100"
              style={{
                overflowX: 'auto',
                display: 'flex',
                scrollBehavior: 'smooth',
                padding: '10px 0',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: isMobileView ? 'none' : 'auto', // Hide scrollbar in mobile view
                msOverflowStyle: isMobileView ? 'none' : 'auto', // Hide scrollbar in IE/Edge
              }}
            >
              <div 
                className="trades-grid" 
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '0 5px',
                  minWidth: 'min-content'
                }}
              > 
                {(() => {
                  const tradeCards = [];
                  filteredPeople.forEach((person) => {
                    tradeCards.push(
                      <div 
                        className="trade-card" 
                        key={person.id}
                        style={{
                          flex: '0 0 auto',
                          minWidth: '250px'
                        }}
                      >
                        <div className="trade-image">
                          <img className="img" src={person.image} alt={person.name} />
                        </div>
                        <h3>
                          {person.name} 
                          
                          {person.verified && <span className="verified-badge"> <i className="fa-solid fa-circle-check verification-icon"></i></span>}
                        </h3>
                        <p className="personP">{person.profession} </p>
                        {/* <p style={{ color: "gold" }}>{person.ratings} <span className="jobs-done">({`${person.jobs} Jobs`})</span></p> */}

                        <p><span className="star-rating">{person.ratings}</span> <span className="jobs-done">({`${person.jobs} Jobs`})</span></p> {/* Star rating */}
                        <a 
                          href={`/profile/${person.id}`} 
                          className="view-profile-btn"
                          onClick={(e) => handleViewProfile(e, person)}
                        >
                          View Profile
                        </a>
                      </div>
                    );
                  });
                  return tradeCards;
                })()}
              </div>
            </div>
            
            {/* Navigation buttons moved to bottom */}
            {isMobileView && filteredPeople.length > 1 && (
              <div 
                className="navigation-buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '20px'
                }}
              >
                <button 
                  onClick={scrollPrevious}
                  className="nav-button prev-button"
                  aria-label="Previous profile"
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FiChevronLeft size={24} />
                </button>
                <button 
                  onClick={scrollNext}
                  className="nav-button next-button"
                  aria-label="Next profile"
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export { TopTrades };