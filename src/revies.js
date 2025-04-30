import React from "react";

function Review() {
  const reviewers = [
    {
      id: 1,
      image: "./images/hair.png",
      user: "Aisha O",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments:
        "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!",
    },
    {
      id: 2,
      image: "./images/blackman.png",
      user: "Nneka E",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments:
        "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!",
    },
    {
      id: 3,
      image: "./images/panama.png",
      user: "David K",
      caption: "Super happy with the results",
      stars: "★★★★★",
      comments:
        "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!",
    },
    {
      id: 4,
      image: "./images/dreadhair.png",
      user: "Olumide I",
      caption: "Super happy with the results",
      stars: "★★★★☆",
      comments:
        "Emeka was professional, punctual, and delivered top-quality plumbing work. Booking was easy, and he went above and beyond. Highly recommend!",
    },
  ];

  return (
    <>
      <section className="reviews-section">
        <h2 className="reviews-title">REVIEWS</h2>

        {/* Reviews grid */}
        <div className="reviews-grid">
          {reviewers.map((reviewer) => (
            // review card
            <div className="review-card" key={reviewer.id}>
              {/* Review image */}
              <div className="review-header">
                <img
                  className="review-image"
                  src={reviewer.image || "/placeholder-avatar.jpg"}
                  alt={`${reviewer.user} avatar`}
                />
                <div className="review-user-info">
                  <h3 className="review-user">{reviewer.user}</h3>
                  <p className="review-caption">{reviewer.caption}</p>
                  <p className="review-stars">{reviewer.stars}</p>
                </div>
              </div>

              <p className="review-comments">{reviewer.comments}</p>
            </div>
          ))}
        </div>
        {/* See more reviews button */}
        <a href="#" className="see-more-reviews-button">
          See More Reviews
        </a>
      </section>
    </>
  );
}

export default Review;
