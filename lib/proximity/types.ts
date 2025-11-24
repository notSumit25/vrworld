/**
 * JavaScript types and constants for the proximity-based LiveKit system
 *
 * File location: lib/proximity/types.js
 */

/**
 * @typedef {Object} NearbyUser
 * @property {string} socketId
 * @property {string|null} [clerkId]
 * @property {string|null} [name]
 * @property {number} x
 * @property {number} y
 * @property {number} distance
 * @property {number} audioLevel - 0-1, where 1 is full volume
 */

/**
 * @typedef {Object} ProximityUpdate
 * @property {NearbyUser[]} nearbyUsers
 * @property {number} timestamp
 */

/**
 * @typedef {Object} ProximitySettings
 * @property {number} proximityDistance - pixels
 * @property {number} audioFalloffDistance - pixels
 * @property {number} maxSubscriptions - max number of participants to subscribe to
 * @property {number} updateInterval - ms between proximity checks
 * @property {boolean} spatialAudioEnabled
 */

/**
 * @typedef {Object} LiveKitProximityState
 * @property {NearbyUser[]} nearbyUsers
 * @property {Set<string>} subscribedUsers
 * @property {Map<string, number>} audioLevels
 * @property {Map<string, {x: number, y: number, z: number}>} spatialPositions
 * @property {boolean} isProcessingUpdate
 */

// Default settings
export const DEFAULT_PROXIMITY_SETTINGS = {
  proximityDistance: 150,
  audioFalloffDistance: 150,
  maxSubscriptions: 8,
  updateInterval: 100,
  spatialAudioEnabled: false,
};
