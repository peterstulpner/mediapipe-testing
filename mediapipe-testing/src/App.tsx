import { Button } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import HandsComponent from "./mediapipe/HandsComponent";

const App = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleClick = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="App">
      <h1>Hands Testing</h1>
      <Button
        style={{ width: "200px", height: "30px" }}
        variant={showVideo ? "dark" : "light"}
        onClick={handleClick}
      >
        {showVideo ? "Hide Video" : "Show Video"}
      </Button>

      {showVideo ? <HandsComponent showVideo={showVideo} /> : <></>}
    </div>
  );
};

export default App;
