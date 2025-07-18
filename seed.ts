// Dummy destinations & titles
const destinations = [
  "Goa",
  "Manali",
  "Paris",
  "Tokyo",
  "Bali",
  "London",
  "Kerala",
  "Iceland",
];
const titles = [
  "Adventure Trip",
  "Romantic Getaway",
  "Family Vacation",
  "Solo Travel",
  "Cultural Tour",
  "Beach Blast",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Main generator
export async function generateItineraries() {
  const start = new Date("2024-01-01");
  const end = new Date("2025-12-31");

  let current = new Date(start);

  while (current <= end) {
    const duration = getRandomInt(5, 15); // trip length
    const startDate = new Date(current);
    const endDate = addDays(startDate, duration);

    const itinerary = {
      title: getRandomItem(titles),
      destination: getRandomItem(destinations),
      budget: getRandomInt(5000, 100000),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };

    // 🔥 Call your API here
    try {
      await fetch("http://localhost:5500/api/v1/itinerary", {
        method: "POST",
        body: JSON.stringify(itinerary),
        headers: {
          "Content-Type": "application/json",
          Cookie: `_ac_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc3ZmQ4YTQwMmQ3MTE5MmM3MmFiN2QiLCJ1c2VybmFtZSI6ImN6ci1yYnQiLCJlbWFpbCI6InN1bWFudGt1bWFyMTcyMDAwQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoic3VtYW50IGt1bWFyIiwiaWF0IjoxNzUyODA2NDM5LCJleHAiOjE4MzkyMDY0Mzl9.0lC-GFFK3NOgC4gIDeOIDsP6ak4s8UBIQ4K0bS_ChBI`, // replace dynamically if needed
        },
      });
      console.log("Created:", itinerary);
    } catch (err) {
      console.error("Failed to create itinerary:", err);
    }

    // Move current to after this trip to avoid overlap
    current = addDays(endDate, 1);
  }
}

generateItineraries()