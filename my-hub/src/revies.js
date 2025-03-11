import React from "react";

function Review() {
  const reviewers = [
    {
      id: 1,
      image: "./revImage/fullhair.png", // Placeholder image path
      user: "Aisha O",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 2,
      image: "./revImage/black.png", // Placeholder image path
      user: "Nneka E",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 3,
      image: "./revImage/glass.png", // Placeholder image path
      user: "David K",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    },
    {
      id: 4,
      image: "./revImage/caper.png", // Placeholder image path
      user: "Olumide I",
      caption: "Super happy with the results",
      stars: "★★★★☆",
      comments: "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!"
    }
  ];

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">What Our Customers Say</h2>
      <div className="reviews-grid">
        {reviewers.map((reviewer) => (
          <div className="review-card" key={reviewer.id}>
            <div className="review-header">
              <img 
                className="review-image" 
                src={reviewer.image || "/placeholder-avatar.jpg"} 
                alt={`${reviewer.user} avatar`} 
              />
              <div className="review-user-info">
                <h3 className="review-user">{reviewer.user}</h3>
                <div className="review-stars">{reviewer.stars}</div>
              </div>
            </div>
            <p className="review-caption">{reviewer.caption}</p>
            <p className="review-comments">{reviewer.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;