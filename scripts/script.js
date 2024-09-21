// script.js

// Toggle between Juventus and Napoli players
const juventusBtn = document.getElementById('juventus-btn');
const napoliBtn = document.getElementById('napoli-btn');
const playerCards = document.querySelectorAll('.player-card');

// Function to switch team
function switchTeam(team) {
  playerCards.forEach(card => {
    if (card.getAttribute('data-team') === team) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Set default team to Juventus
switchTeam('juventus');

// Add event listeners to buttons
juventusBtn.addEventListener('click', () => {
  switchTeam('juventus');
  juventusBtn.classList.add('active');
  napoliBtn.classList.remove('active');
});

napoliBtn.addEventListener('click', () => {
  switchTeam('napoli');
  napoliBtn.classList.add('active');
  juventusBtn.classList.remove('active');
});