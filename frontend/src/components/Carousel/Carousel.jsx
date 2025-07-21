import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow next-arrow`} // Add custom classes for CSS
      style={{ ...style, display: "block", right: "-20px", zIndex: 10 }} // Adjust positioning
      onClick={onClick}
    >
      <span className="material-icons text-gray-700 text-3xl">&gt;</span>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow prev-arrow`} // Add custom classes for CSS
      style={{ ...style, display: "block", left: "-20px", zIndex: 10 }} // Adjust positioning
      onClick={onClick}
    >
      <span className="material-icons text-gray-700 text-3xl">&lt;</span>
    </div>
  );
}

const mockRecommendedSnacks = [
  {
    id: 1,
    name: "Nutrient Bar",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imageUrl: "https://placehold.co/150x150/ADD8E6/000?text=Snack1",
    moods: ["stress", "tired", "frustrated"],
  },
  {
    id: 2,
    name: "Fruit Medley",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imageUrl: "https://placehold.co/150x150/90EE90/000?text=Snack2",
    moods: ["energetic", "happy"],
  },
  {
    id: 3,
    name: "Veggie Crisps",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    imageUrl: "https://placehold.co/150x150/FFDAB9/000?text=Snack3",
    moods: ["calm", "focused"],
  },
  {
    id: 4,
    name: "Protein Shake",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imageUrl: "https://placehold.co/150x150/DDA0DD/000?text=Snack4",
    moods: ["motivated"],
  },
];
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

const Carousel = () => {
  return (
    <div className="slider">
      <h2>RECOMMENDED SNACKS</h2>

      {mockRecommendedSnacks.length > 0 ? (
        <Slider {...sliderSettings}>
          {mockRecommendedSnacks.map((snack) => (
            <div key={snack.id}>
              <div>
                <img src={snack.imageUrl} alt={snack.name} />
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {snack.name}
                  </h4>
                  <div>
                    {snack.moods.map((mood, index) => (
                      <span key={index}>{mood}</span>
                    ))}
                  </div>
                  <p>{snack.description.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-gray-500 text-sm">
          No snack recommendations available.
        </p>
      )}
    </div>
  );
};

export default Carousel;
