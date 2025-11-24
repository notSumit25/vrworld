/**
 * Utility functions for proximity calculations
 *
 * File location: lib/proximity/utils.js
 */

/**
 * Calculate distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number} distance in pixels
 */
export function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate audio level based on distance
 * @param {number} distance
 * @param {number} maxDistance
 * @returns {number} audio level between 0-1
 */
export function calculateAudioLevel(distance, maxDistance) {
  if (distance >= maxDistance) return 0;
  return Math.max(0, 1 - distance / maxDistance);
}

/**
 * Convert 2D game coordinates to 3D spatial audio coordinates
 * @param {number} x
 * @param {number} y
 * @param {number} scale
 * @returns {{x: number, y: number, z: number}}
 */
export function convertToSpatialPosition(x, y, scale = 0.01) {
  return {
    x: x * scale,
    y: 0, // Keep Y at 0 for 2D game
    z: y * scale, // Map game Y to spatial Z
  };
}

/**
 * Check if a user is within proximity threshold
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} threshold
 * @returns {boolean}
 */
export function isWithinProximity(x1, y1, x2, y2, threshold) {
  return calculateDistance(x1, y1, x2, y2) <= threshold;
}
