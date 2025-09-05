/**
 * Generate a unique ID for nodes, edges, and flows
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a short ID for display purposes
 */
export function generateShortId(): string {
  return Math.random().toString(36).substr(2, 6);
}

/**
 * Validate if a string is a valid ID format
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Extract timestamp from generated ID
 */
export function getTimestampFromId(id: string): number | null {
  const parts = id.split('-');
  if (parts.length >= 2) {
    const timestamp = parseInt(parts[0], 10);
    return isNaN(timestamp) ? null : timestamp;
  }
  return null;
}
