// Assuming you have the total games and active games as variables
let totalGames = 100;
let activeGames = 30;

let totalUsers = 1000;
let activeUsers = 300;

// Calculate inactive games
let inactiveGames = totalGames - activeGames;
// Calculate inactive users
let inactiveUsers = totalUsers - activeUsers;

// Create the games chart
let gamesData = [{
  values: [activeGames, inactiveGames],
  labels: ['Active Games', 'Inactive Games'],
  type: 'pie'
}];

let gamesLayout = {
    title: 'Total Games: ' + totalGames,
    legend: {
      orientation: "h",
      xanchor: "center",
      x: 0.5,
      y: -0.1
    }
  };

Plotly.newPlot('game-status-chart', gamesData, gamesLayout);

// Create the users chart
let usersData = [{
  values: [activeUsers, inactiveUsers],
  labels: ['Active Users', 'Inactive Users'],
  type: 'pie'
}];

let usersLayout = {
    title: 'Total Users: ' + totalUsers,
    legend: {
      orientation: "h",
      xanchor: "center",
      x: 0.5,
      y: -0.1
    }
  };

Plotly.newPlot('users-status-chart', usersData, usersLayout);