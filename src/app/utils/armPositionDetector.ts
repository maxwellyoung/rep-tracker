// This is a placeholder implementation
// Replace this with actual arm position detection logic when available

interface ArmKeyPoint {
  x: number;
  y: number;
}

let mouseY = 0;

// Update mouse position
export function updateMousePosition(y: number) {
  mouseY = y;
}

export function detectArmPosition(video: HTMLVideoElement): ArmKeyPoint {
  // Use mouse Y position to simulate arm movement
  return {
    x: video.width / 2, // Always centered horizontally
    y: mouseY,
  };
}
