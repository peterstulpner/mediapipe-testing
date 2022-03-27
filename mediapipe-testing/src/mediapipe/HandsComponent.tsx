import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { useRef } from "react";
import { useEffect } from "react";

interface props {
  showVideo: boolean;
}

const HandsComponent = (props: props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!canvasElement || !videoElement) {
      console.log("Check css to ensure components exist with the IDs above");
      return;
    }
    const canvasCtx = canvasElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    // Need to change from any to the returend object from hands
    const onResults = (results: any) => {
      console.log("Results: ", results);
      canvasCtx.save();

      // Clear the canvas:
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw onto the canvas from the resulting image captured from the webcam
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }
      canvasCtx.restore();
    };

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();

    // Stop the video stream on component unmount
    return function cleanup() {
      camera.stop();
    };
  });

  return (
    <>
      <canvas ref={canvasRef} width="1280px" height="720px"></canvas>
      <video ref={videoRef} height="100px" width="100px"></video>
    </>
  );
};

export default HandsComponent;
