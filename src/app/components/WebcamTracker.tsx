"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import * as pose from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

const WebcamTracker: React.FC = () => {
  const [repCount, setRepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [armPosition, setArmPosition] = useState<"up" | "down" | "middle">(
    "middle"
  );
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [showRepAnimation, setShowRepAnimation] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const armUpRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const trackArmPosition = useCallback(
    (
      elbow: pose.NormalizedLandmark,
      wrist: pose.NormalizedLandmark,
      shoulder: pose.NormalizedLandmark
    ) => {
      const upwardThreshold = shoulder.y - 0.1;
      const downwardThreshold = shoulder.y + 0.1;

      if (wrist.y < upwardThreshold) {
        setArmPosition("up");
        if (!armUpRef.current) {
          armUpRef.current = true;
        }
      } else if (wrist.y > downwardThreshold) {
        setArmPosition("down");
        if (armUpRef.current) {
          setRepCount((prevCount) => prevCount + 1);
          setShowRepAnimation(true);
          setTimeout(() => setShowRepAnimation(false), 500);
          armUpRef.current = false;
        }
      } else {
        setArmPosition("middle");
      }
    },
    []
  );

  const handleResults = useCallback(
    (results: pose.Results) => {
      if (results.poseLandmarks && isTracking) {
        const leftElbow = results.poseLandmarks[13];
        const leftWrist = results.poseLandmarks[15];
        const leftShoulder = results.poseLandmarks[11];

        trackArmPosition(leftElbow, leftWrist, leftShoulder);
      }
    },
    [isTracking, trackArmPosition]
  );

  const initPoseDetection = useCallback(() => {
    const poseModel = new pose.Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseModel.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseModel.onResults(handleResults);

    if (webcamRef.current && webcamRef.current.video) {
      cameraRef.current = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video) {
            await poseModel.send({ image: webcamRef.current.video });
          }
        },
        width: 1280,
        height: 720,
      });
    }
  }, [handleResults]);

  useEffect(() => {
    initPoseDetection();
  }, [initPoseDetection]);

  useEffect(() => {
    if (isTracking && cameraRef.current) {
      cameraRef.current.start();
    } else if (!isTracking && cameraRef.current) {
      cameraRef.current.stop();
    }
  }, [isTracking]);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setWorkoutDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resetCounter = () => {
    setRepCount(0);
    setWorkoutDuration(0);
    armUpRef.current = false;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Webcam
        className="absolute top-0 left-0 w-full h-full object-cover"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 1920,
          height: 1080,
          facingMode: "user",
        }}
      />
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-between items-end text-white">
          <div>
            <motion.div
              className="text-6xl font-bold"
              animate={{
                scale: showRepAnimation ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {repCount}
            </motion.div>
            <div className="text-xl">Reps</div>
          </div>
          <div className="text-center">
            <div className="text-xl">{armPosition}</div>
            <div className="text-2xl">{formatTime(workoutDuration)}</div>
          </div>
          <div className="space-x-2">
            <AnimatePresence mode="wait">
              {!isTracking ? (
                <motion.button
                  key="start"
                  className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-semibold"
                  onClick={startTracking}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start
                </motion.button>
              ) : (
                <motion.button
                  key="stop"
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-semibold"
                  onClick={stopTracking}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Stop
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-semibold"
              onClick={resetCounter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showRepAnimation && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-yellow-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebcamTracker;
