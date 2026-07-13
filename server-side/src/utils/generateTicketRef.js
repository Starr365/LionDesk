/**
 * Generates a unique ticket reference in the format TK-XXXXXX.
 * Uses a 6-digit random number.
 */
const generateTicketRef = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TK-${num}`;
};

export default generateTicketRef;
