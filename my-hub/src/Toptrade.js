import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
      biography: "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure."
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
    }
  ]);

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 2; // Number of cards per page

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
      setCurrentPage(1); // Reset to first page when search changes
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, tradespeople]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="top-trades">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">
          Top Trades & Artisans
        </h2>
        
        {/* Search input within the component */}
        <div className="search-box" data-aos="fade-up">
       
          <input
            type="text"
            placeholder="Search by name, profession or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="trades-search-input"
          />
         
        </div>
        
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : filteredPeople.length === 0 ? (
          <div className="no-results">No matching trades found</div>
        ) : (
          <>
            <div className="trades-grid" data-aos="fade-up" data-aos-delay="100">
              {currentItems.map(person => (
                <div className="trade-card" key={person.id}>
                  <div className="trade-image">
                    <img className="img" src={person.image} alt={person.name} />
                    {person.verified && <span className="verified-badge"> <i className="fa-solid fa-circle-check verification-icon"></i></span>}
                  </div>
                  <h3>{person.name}</h3>
                  <p style={{ color: "gold" }}>{person.ratings}</p>
                  <p>{person.profession}</p>
                  <Link to={`/profile/${person.id}`} className="view-profile-btn">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  Prev
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};



export { TopTrades };