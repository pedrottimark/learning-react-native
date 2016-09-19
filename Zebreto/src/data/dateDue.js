// Strength increases with correct answers to review questions,
// therefore the time increment until the next review increases.
const increments = [
  { hours: 1 },  // 0
  { hours: 3 },  // 1
  { days: 1 },   // 2
  { days: 3 },   // 3
  { weeks: 1 },  // 4
  { weeks: 2 },  // 5
  { months: 1 }, // 6
  { months: 4 }, // 7
  { years: 1 },  // 8
];

const incrementDefault = { years: 3 }; // 9 <= strength

// Return the new due date after a card has been reviewed.
// Reducer logic assumes that the new due date will be in the future!
// date.clone() copies the moment object because the function must be pure!
export default (date, strength) => date.clone().add(strength < increments.length
  ? increments[strength]
  : incrementDefault
).toISOString();
