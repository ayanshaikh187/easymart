import { FaStar } from "react-icons/fa";
import { useState } from "react";

function ProductReviews() {

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Ali",
      rating: 5,
      comment: "Amazing Quality ❤️",
    },
    {
      id: 2,
      name: "Ahmed",
      rating: 4,
      comment: "Fresh Product",
    },
  ]);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const addReview = () => {

    if (!name || !comment) return;

    setReviews([
      ...reviews,
      {
        id: Date.now(),
        name,
        comment,
        rating,
      },
    ]);

    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <section className="mt-24 m-auto max-w-7xl px-6">

      <h2 className="text-4xl font-bold mb-10">
        Customer Reviews
      </h2>

      <div className="space-y-6">

        {reviews.map((review) => (

          <div
            key={review.id}
            className="border rounded-2xl p-6"
          >

            <h3 className="font-bold text-xl">
              {review.name}
            </h3>

            <div className="flex text-yellow-500 mt-2">

              {[...Array(review.rating)].map((_, index) => (
                <FaStar key={index} />
              ))}

            </div>

            <p className="text-gray-500 mt-3">
              {review.comment}
            </p>

          </div>

        ))}

      </div>

      <div className="mt-12 bg-gray-100 rounded-2xl p-8">

        <h3 className="text-2xl font-bold mb-6">
          Write Review
        </h3>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <textarea
          rows="5"
          placeholder="Write review..."
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <select
          value={rating}
          onChange={(e)=>setRating(Number(e.target.value))}
          className="border rounded-xl p-3 mb-4 m-3 accordion active"
        >

          <option value="5">★★★★★</option>
          <option value="4">★★★★</option>
          <option value="3">★★★</option>
          <option value="2">★★</option>
          <option value="1">★</option>

        </select>

        <button
          onClick={addReview}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
        >
          Submit Review
        </button>

      </div>

    </section>
  );
}

export default ProductReviews;