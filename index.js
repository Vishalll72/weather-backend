const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get("/Cities/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "Cities", `${filename}.json`);
  res.sendFile(filePath);
});

// Add a new route to handle filtering data based on date and month
app.get("/Cities/:filename/data", (req, res) => {
  const filename = req.params.filename;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  const filePath = path.join(__dirname, "Cities", `${filename}.json`);
  const locationData = require(filePath); // Assuming JSON files are exportable
  // Filter data based on the provided date
  const formattedDate = date; // Date format DD-MM
  const filteredData = locationData.filter((item) => {
    // Check if the item's time matches the formatted date
    return item.time.startsWith(formattedDate);
  });

  res.json(filteredData);
});

app.get("/Cities/:filename/current", (req, res) => {
  const filename = req.params.filename;
  const { date } = req.query; // Get the date query parameter

  const dayMonth = date.split("-").slice(0, 2).join("-"); // Extract day and month from the provided date

  const filePath = path.join(__dirname, "Cities", `${filename}.json`);
  const locationData = require(filePath);

  // Filter data based on the provided day and month
  const filteredData = locationData.filter((item) => {
    // Extract day and month from the item's time
    const itemDayMonth = item.time.split("-").slice(0, 2).join("-");
    // Check if the item's day and month matches the provided day and month
    return itemDayMonth === dayMonth;
  });

  res.json(filteredData);
});

app.get("/Cities/:filename/previous", (req, res) => {
  const filename = req.params.filename;
  const { date } = req.query; // Get the date query parameter

  // Split the date string and reverse it to get the correct format
  const [day, month, year] = date.split("-");
  const formattedDate = `${month}-${day}-${year}`;

  // Parse the current date
  const currentDate = new Date(formattedDate);

  // Array to store data for previous dates
  const previousData = [];

  // Iterate over the previous 7 days
  for (let i = 1; i <= 7; i++) {
    // Create a new Date object for the previous day
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - i);

    // Format the previous date
    const prevDay = previousDate.getDate().toString().padStart(2, "0");
    const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedPrevDate = `${prevDay}-${prevMonth}-${previousDate.getFullYear()}`;

    // Load data from JSON file for the previous date
    const filePath = path.join(__dirname, "Cities", `${filename}.json`);
    const locationData = require(filePath);

    // Filter data based on the previous date
    const filteredData = locationData.filter((item) => {
      // Extract day and month from the item's time
      const [itemDay, itemMonth] = item.time.split("-").slice(0, 2);
      // Check if the item's day and month matches the previous day and month
      return itemDay === prevDay && itemMonth === prevMonth;
    });

    // Add filtered data for the previous date to the array
    previousData.push({ date: formattedPrevDate, data: filteredData });
  }

  // Send the collected data for previous dates as the response
  res.json(previousData);
});

app.get("/Cities/:filename/future", (req, res) => {
  const filename = req.params.filename;
  const { date } = req.query; // Get the date query parameter

  // Split the date string and reverse it to get the correct format
  const [day, month, year] = date.split("-");
  const formattedDate = `${month}-${day}-${year}`;

  // Parse the current date
  const currentDate = new Date(formattedDate);

  // Array to store data for future dates
  const futureData = [];

  // Iterate over the next 7 days
  for (let i = 1; i <= 7; i++) {
    // Create a new Date object for the future day
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + i);

    // Format the future date
    const futDay = futureDate.getDate().toString().padStart(2, "0");
    const futMonth = (futureDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedFutDate = `${futDay}-${futMonth}-${futureDate.getFullYear()}`;

    // Load data from JSON file for the future date
    const filePath = path.join(__dirname, "Cities", `${filename}.json`);
    const locationData = require(filePath);

    // Filter data based on the future date
    const filteredData = locationData.filter((item) => {
      // Extract day and month from the item's time
      const [itemDay, itemMonth] = item.time.split("-").slice(0, 2);
      // Check if the item's day and month matches the future day and month
      return itemDay === futDay && itemMonth === futMonth;
    });

    // Add filtered data for the future date to the array
    futureData.push({ date: formattedFutDate, data: filteredData });
  }

  // Send the collected data for future dates as the response
  res.json(futureData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
