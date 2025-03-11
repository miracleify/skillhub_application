// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import "./App.css";

// const Profile = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Complete dataset of tradespeople
//   const tradespeopleData = [
//     {
//       id: 1,
//       name: 'Kola Aekunle',
//       profession: 'Painter',
//       verified: true,
//       image: '/userProfile/kola.png',
//       expertise: "Professional painting, wall preparation, color consultation, special finishes",
//       location: "Lagos, Nigeria",
//       ratings: "★★★★★",
//       phone: "+234 801 234 5678",
//       email: "kola.aekunle@example.com",
//       biography: "Hi, I'm Kola, a certified painter with over 10 years of experience in residential and commercial painting work. I take pride in delivering high-quality finishes and attention to detail on every project. My specialties include interior and exterior painting, decorative finishes, and color consultation.",
//       portfolio: [
//         "/portfolio/kola1.jpg",
//         "/portfolio/kola2.jpg",
//         "/portfolio/kola3.jpg"
//       ],
//       reviews: [
//         {
//           name: "Olufemi James",
//           rating: 5,
//           comment: "Kola did an amazing job painting our living room. Very professional and clean work!"
//         },
//         {
//           name: "Blessing Adeyemi",
//           rating: 5,
//           comment: "Excellent service. Finished on time and the quality was outstanding."
//         }
//       ]
//     },
//     {
//       id: 2,
//       name: 'Adewale OgunLeye',
//       profession: 'Plumber',
//       verified: true,
//       image: '/userProfile/wale.png',
//       expertise: "Pipe fitting, repairs, installations, drainage solutions",
//       location: "Lagos, Nigeria",
//       ratings: "★★★★★",
//       phone: "+234 802 345 6789",
//       email: "adewale.ogunleye@example.com",
//       biography: "I'm Adewale, a professional plumber specializing in all plumbing needs for homes and businesses. With 12 years of experience, I provide reliable and efficient plumbing services including installations, repairs, and maintenance.",
//       portfolio: [
//         "/portfolio/wale1.jpg",
//         "/portfolio/wale2.jpg"
//       ],
//       reviews: [
//         {
//           name: "Tunde Bakare",
//           rating: 5,
//           comment: "Fixed my leaking pipe quickly and professionally. Highly recommended!"
//         }
//       ]
//     },
//     {
//       id: 3,
//       name: 'Zainab Suleiman',
//       profession: 'Electrician',
//       verified: true,
//       image: '../userProfile/zainab.png',
//       expertise: "Wiring, repairs, lighting, electrical upgrades",
//       location: "Lagos, Nigeria",
//       ratings: "★★★★★",
//       phone: "+234 803 456 7890",
//       email: "zainab.suleiman@example.com",
//       biography: "With 8 years of experience, I provide reliable electrical services with a focus on safety. I'm certified and insured, specializing in residential and small commercial electrical work.",
//       portfolio: [
//         "/portfolio/zainab1.jpg",
//         "/portfolio/zainab2.jpg",
//         "/portfolio/zainab3.jpg"
//       ],
//       reviews: [
//         {
//           name: "Amina Mohammed",
//           rating: 5,
//           comment: "Zainab is very knowledgeable and professional. She installed new lighting in my home perfectly."
//         },
//         {
//           name: "Ibrahim Yusuf",
//           rating: 4,
//           comment: "Good work on our electrical panel upgrade. Explained everything clearly."
//         }
//       ]
//     },
//     {
//       id: 4,
//       name: 'Chinedu Okafor',
//       profession: 'Carpenter',
//       verified: true,
//       image: '/userProfile/okafor.png',
//       expertise: "Furniture making, woodworking, installations, repairs",
//       location: "Lagos, Nigeria",
//       ratings: "★★★★★",
//       phone: "+234 804 567 8901",
//       email: "chinedu.okafor@example.com",
//       biography: "I'm a skilled carpenter creating custom furniture and providing quality carpentry services. With attention to detail and craftsmanship, I deliver beautiful and functional woodwork for any space.",
//       portfolio: [
//         "/portfolio/chinedu1.jpg",
//         "/portfolio/chinedu2.jpg"
//       ],
//       reviews: [
//         {
//           name: "Ngozi Eze",
//           rating: 5,
//           comment: "Chinedu built custom shelving for my home office. The quality is excellent!"
//         }
//       ]
//     }
//   ];

//   // Fetch profile data based on ID
//   useEffect(() => {
//     // Simulate API fetch with setTimeout
//     setTimeout(() => {
//       const foundProfile = tradespeopleData.find(person => person.id === parseInt(id));
//       setProfile(foundProfile);
//       setLoading(false);
//     }, 500);
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="error-container">
//         <h2>Profile Not Found</h2>
//         <p>Sorry, we couldn't find the tradesperson you're looking for.</p>
//         <Link to="/" className="back-btn">Back to Home</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="container">
//         <Link to="/" className="back-btn">&larr; Back to Home</Link>
        
//         <div className="profile-header">
//           <div className="profile-image-container">
//             <img src={profile.image} alt={profile.name} className="profile-image" />
//             {profile.verified && <span className="profile-verified-badge">✓ Verified</span>}
//           </div>
          
//           <div className="profile-info">
//             <h1>{profile.name}</h1>
//             <p className="profile-profession">{profile.profession}</p>
//             <p className="profile-ratings">{profile.ratings}</p>
//             <p className="profile-location">
//               <span className="location-icon">📍</span> {profile.location}
//             </p>
//             <div className="contact-buttons">
//               <a href={`tel:${profile.phone}`} className="contact-btn phone-btn">Call</a>
//               <a href={`mailto:${profile.email}`} className="contact-btn email-btn">Email</a>
//               <button className="contact-btn message-btn">Message</button>
//             </div>
//           </div>
//         </div>
        
//         <div className="profile-sections">
//           <section className="profile-about">
//             <h2>About</h2>
//             <p>{profile.biography}</p>
//           </section>
          
//           <section className="profile-expertise">
//             <h2>Expertise</h2>
//             <p>{profile.expertise}</p>
//           </section>
          
//           {profile.portfolio && profile.portfolio.length > 0 && (
//             <section className="profile-portfolio">
//               <h2>Portfolio</h2>
//               <div className="portfolio-grid">
//                 {profile.portfolio.map((image, index) => (
//                   <div className="portfolio-item" key={index}>
//                     <img src={image} alt={`${profile.name}'s work ${index + 1}`} className="portfolio-image" />
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
          
//           {profile.reviews && profile.reviews.length > 0 && (
//             <section className="profile-reviews">
//               <h2>Reviews</h2>
//               <div className="reviews-container">
//                 {profile.reviews.map((review, index) => (
//                   <div className="review-card" key={index}>
//                     <div className="review-header">
//                       <h4>{review.name}</h4>
//                       <p className="review-rating">
//                         {Array(review.rating).fill('★').join('')}
//                       </p>
//                     </div>
//                     <p className="review-comment">{review.comment}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;