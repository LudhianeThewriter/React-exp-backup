import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Animate = () => {
  return (
    <div className="App">
      <DotLottieReact
        src="https://lottie.host/84ad0b92-dba3-431a-bdc3-c1ed5767ef96/o2iRAKgH8d.lottie" // Lottie URL
        loop={true} // Animation will loop
        autoplay={true} // Animation will autoplay
        style={{ width: "200px", height: "200px" }} // Set the size of the animation
      />
    </div>
  );
};

export default Animate;
