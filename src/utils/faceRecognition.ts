import * as faceapi from 'face-api.js';

/**
 * Loads the face-api.js models from public/models.
 */
export const loadFaceModels = async (): Promise<void> => {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
};

/**
 * Saves the parent's face descriptor to localStorage.
 */
export const registerParentFace = (descriptor: Float32Array): void => {
  const arr = Array.from(descriptor);
  localStorage.setItem('parentFaceDescriptor', JSON.stringify(arr));
};

/**
 * Compares a live face descriptor against the stored descriptor.
 * Threshold: distance < 0.6 is a match (success).
 */
export const verifyParentFace = (descriptor: Float32Array): { success: boolean; distance: number } => {
  const storedStr = localStorage.getItem('parentFaceDescriptor');
  if (!storedStr) {
    throw new Error('No registered face found');
  }
  
  const storedArr = JSON.parse(storedStr) as number[];
  const storedDescriptor = new Float32Array(storedArr);
  
  const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);
  return {
    success: distance < 0.6,
    distance,
  };
};
