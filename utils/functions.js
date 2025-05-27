
/**
 * Generates a unique numeric ID based on the current timestamp and a random number.
 * The ID is a string that combines the current timestamp with a random number
 */
function generateUniqueNumericId() {
  return `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

module.exports = {
  generateUniqueNumericId
};