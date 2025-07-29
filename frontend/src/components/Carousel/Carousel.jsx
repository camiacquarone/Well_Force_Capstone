import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";
import Chip from "../../components/Chip/Chip";
import "../DisplayInfo/DisplayInfo.css";


function SampleNextArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={`${className} custom-slick-arrow next-arrow`}
      style={{ ...style, display: "block", right: "-20px", zIndex: 10 }}
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
      className={`${className} custom-slick-arrow prev-arrow`}
      style={{ ...style, display: "block", left: "-20px", zIndex: 10 }}
      onClick={onClick}
    >
      <span className="material-icons text-gray-700 text-3xl">&lt;</span>
    </div>
  );
}

const sliderSettings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 3000,
  autoplaySpeed: 6000,
  cssEase: "linear",
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,

  responsive: [
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const Carousel = ({ snacks }) => {
  return (
    <div className="slider">
      <h3 className="home-page-titles">RECOMMENDED SNACKS</h3>

      {snacks && snacks.length > 0 ? (
        <Slider {...sliderSettings}>
          {snacks.map((snack) => (
            <div key={snack.id || snack.name} className="p-2 outline-none">
              {" "}
              <div className="snack-info">
                {" "}
                <img
                  src={
                    snack.image_url ||
                    "https://demofree.sirv.com/products/123456/123456.jpg?profile=error-example"
                  }
                  alt={snack.name}
                />
                <div className="text-left flex-grow">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                    {snack.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {snack.moods &&
                      snack.moods.map((mood, index) => (
                        <Chip key={index} type="mood" label={mood} />
                      ))}
                  </div>
                  <p className="text-gray-600 text-sm">{snack.description}</p>{" "}
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
