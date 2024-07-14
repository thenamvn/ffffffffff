import React, { useState, useEffect } from 'react';

const ManualSlideshow = ({ images }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    const x = document.getElementsByClassName("mySlides");
    for (let i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    if (x.length > 0) {
      x[slideIndex - 1].style.display = "block";
    }
  }, [slideIndex]);

  const plusDivs = (n) => {
    setSlideIndex(prevIndex => {
      const newIndex = prevIndex + n;
      if (newIndex > images.length) {
        return 1;
      } else if (newIndex < 1) {
        return images.length;
      } else {
        return newIndex;
      }
    });
  };

  return (
    <div className="w3-content w3-display-container" style={{width: "90vw"}}>
      {images.map((src, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img className="mySlides" src={src} style={{ width: "100%" }} alt={`Slide ${index + 1}`} />
          <div className="w3-display-bottommiddle w3-large w3-container w3-padding-16 w3-black" style={{ position: "absolute", bottom: "0", width: "100%" }}> Slide {index + 1}</div>
        </div>
      ))}
      <button className="w3-button w3-black w3-display-left" onClick={() => plusDivs(-1)}>&#10094;</button>
      <button className="w3-button w3-black w3-display-right" onClick={() => plusDivs(1)}>&#10095;</button>
    </div>
  );
};

export default ManualSlideshow;