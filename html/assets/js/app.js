var gameScore;
var currentRound; //CurrentRound is the array index, not the human-friendly round number
var currentPlayer;

function setUpGame() {
  localStorage.clear()
  localStorage.setItem('gameScore', JSON.stringify(blankGameScore))
  localStorage.setItem('currentRound', 0)
  localStorage.setItem('currentPlayer', 'player1')
  console.log('Setting up new game')
  draw()
}

function newGame() {
  var response = confirm("Start new game?");
  if (response) {
    setUpGame()
  }
}

function getCurrentRound() {
  return parseInt(localStorage.getItem('currentRound'))
}

function setCurrentRound(round) {
  return localStorage.setItem('currentRound', round)
}

function getGameScore() {
  return JSON.parse(localStorage.getItem('gameScore'))
}

function setGameScore(gameScore) {
  localStorage.setItem('gameScore', JSON.stringify(gameScore))
}

function getTotalBid(round) {
  var gs = getGameScore()
  return gs[round]['player1']['bid'] +
    gs[round]['player2']['bid'] +
    gs[round]['player3']['bid'] +
    gs[round]['player4']['bid']
}
function getPlayerScore(player) {
  var gs = getGameScore()
  var playerScore = 0;
  for (var r = 0; r < gs.length; r++) {
    playerScore += gs[r][player]['points']
  }
  return playerScore
}

function getBid(player) {
  var gs = getGameScore()
  var round = getCurrentRound()
  return gs[round][player]['bid']
}

function getActual(player) {
  var gs = getGameScore()
  var round = getCurrentRound()
  return gs[round][player]['actual']
}

function getCurrentPlayer() {
  return localStorage.getItem('currentPlayer')
}

function roundUp() {
  if (getCurrentRound() < 19) {
    setCurrentRound(getCurrentRound() + 1)
    draw()
  }
}

function roundDown() {
  if (getCurrentRound() > 0) {
    setCurrentRound(getCurrentRound() - 1)
    draw()
  }
}

function bidUp() {
  var gs = getGameScore();
  var round = getCurrentRound();
  var player = getCurrentPlayer();
  var currentBid = gs[round][player]['bid']
  if (currentBid <= getCurrentRound()) {
    gs[round][player]['bid'] = gs[round][player]['bid'] + 1
    setGameScore(gs)
    draw()
  }
}

function bidDown() {
  var gs = getGameScore();
  var round = getCurrentRound();
  var player = getCurrentPlayer();
  var currentBid = gs[round][player]['bid'];
  if (currentBid > 0) {
    gs[round][player]['bid'] = gs[round][player]['bid'] - 1
    setGameScore(gs)
    draw()
  }
}

function actualUp() {
  var gs = getGameScore();
  var round = getCurrentRound();
  var player = getCurrentPlayer();
  var currentActual = gs[round][player]['actual']
  if (currentActual <= getCurrentRound()) {
    gs[round][player]['actual'] = gs[round][player]['actual'] + 1
    setGameScore(gs)
    calculateCurrentPlayerPoints()
    draw()
  }
}

function actualDown() {
  var gs = getGameScore();
  var round = getCurrentRound();
  var player = getCurrentPlayer();
  var currentActual = gs[round][player]['actual'];
  if (currentActual > 0) {
    gs[round][player]['actual'] = gs[round][player]['actual'] - 1
  } else if (currentActual == 0) {
    gs[round][player]['actual'] = null
  }
  setGameScore(gs)
  calculateCurrentPlayerPoints()
  draw()
}

function calculateCurrentPlayerPoints() {
  var player = getCurrentPlayer();
  var round = getCurrentRound();
  var gs = getGameScore();
  var bid = gs[round][player]['bid']
  var actual = gs[round][player]['actual']

  // only calculate the score if bid and actual are both filled in
  if ((bid !== null) && (actual !== null)) {
    if (bid === actual) {
      // if bid equals actual
      gs[round][player]['points'] = 10 + (2 * bid)
    } else {
      // if bid does not equal actual
      var spread = Math.abs(bid - actual)
      console.log(`spread: ${spread}`)
      gs[round][player]['points'] = 10 - (2 * spread)
    }
  } else if (actual === null) {
    // if you are trying to set the score for this round to 'not yet scored'
    gs[round][player]['points'] = null
  }
  setGameScore(gs)


}
function draw() {
  console.debug('drawing the board..')
  // Draw the current round
  var round = getCurrentRound()
  var gs = getGameScore()
  document.getElementById('currentRound').innerHTML = gs[round]['round']
  // console.log(`Setting current round to array: ${round} - (Pretty round: ${gs[round]['round']})`)

  // Draw total bid
  document.getElementById('totalBid').innerHTML = getTotalBid(round)

  // Draw player scores
  document.getElementById('playerOneScore').innerHTML = getPlayerScore('player1')
  document.getElementById('playerTwoScore').innerHTML = getPlayerScore('player2')
  document.getElementById('playerThreeScore').innerHTML = getPlayerScore('player3')
  document.getElementById('playerFourScore').innerHTML = getPlayerScore('player4')

  // Draw player name
  document.getElementById('playerName').innerHTML = getCurrentPlayer().toUpperCase()

  // Draw current player bid
  document.getElementById('bid').value = getBid(getCurrentPlayer())

  // Draw current player actual
  document.getElementById('actual').value = getActual(getCurrentPlayer())

}


function onLoad() {
  // Set up blank game if there is no game state
  if (!localStorage.getItem('gameScore')) {
    console.log('No game score found')
    setUpGame()
  }
  draw()
}

onLoad()