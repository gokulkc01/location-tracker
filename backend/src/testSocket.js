const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmYyZGJjNWQwODY3ZDA3MWJiM2ZkYSIsImlhdCI6MTc2ODg5NDI2NSwiZXhwIjoxNzY5NDk5MDY1fQ.RnuXFjiaslJNWrlkw2e52SU2wEvwKMA6QVhaCj59RIg"
  }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-circles", ["696f30df5d0867d071bb3fe3"]);

  socket.emit("location-update", {
    circleId: "696f30df5d0867d071bb3fe3",
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 10,
    battery: 15
  });
});

socket.on("low-battery-alert", (data) => {
  console.log("Low battery warning:", data);
});

socket.on("sos-received", (data) => {
  console.log("SOS received:", data);
});
