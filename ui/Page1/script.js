const createGameBtn = document.querySelector(".create-game-btn");
const enterBtn = document.querySelector(".enter-btn");
const roomCodeInput = document.querySelector("#room-code");

createGameBtn.addEventListener("click", () => {
  // Create game logic here
  console.log("Create game button clicked!");
});

enterBtn.addEventListener("click", () => {
  const roomCode = roomCodeInput.value.trim();
  if (roomCode) {
    // Enter room logic here
    console.log(`Entering room ${roomCode}...`);
  } else {
    alert("Please enter a room code!");
  }
});
