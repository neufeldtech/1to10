let players
function init() {
  localStorage.removeItem('gameStatus')
  document.querySelector('#playArea').style.display = 'hidden'
  document.querySelector('#playerInput').style.display = 'inline-block'
}
function validatePlayers() {
  let players = document.querySelectorAll('.playerName')
  console.table(players)
  for (let i=0; i < players.length; i++) {
    let player = players[i]
    console.log(player)
  }
  return true;
}
function bindEventHandlers() {
  document.querySelector('#newGame').onclick = function(){
    if (confirm('Abandon progress and start new game?')) {
      console.log('starting a new game...')
      init()
    }
  }
  document.querySelector('#startGame').onclick = function(){
    if (validatePlayers()) {
      startGame()
    } else {
      alert('Player validation failed. 3 or 4 players are required.')
    }
  }
}
function startGame() {
  document.querySelector('#playArea').style.display = 'inline-block'
  document.querySelector('#playerInput').style.display = 'hidden'
}

let gameStatus = localStorage.getItem('gameStatus')

// Start the game!
bindEventHandlers()