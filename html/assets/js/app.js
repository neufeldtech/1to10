var gameScore;
var currentRound; //CurrentRound is the array index, not the human-friendly round number
var currentPlayer;

function setUpGame() {
  localStorage.clear()
  document.getElementById('player-one-name').value = null
  document.getElementById('player-two-name').value = null
  document.getElementById('player-three-name').value = null
  document.getElementById('player-four-name').value = null
  
  localStorage.setItem('gameScore', JSON.stringify(blankGameScore))
  localStorage.setItem('currentRound', 0)
  changePlayer('player1')
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

function getMaxTricks() {
  var round = getCurrentRound()
  var gs = getGameScore();
  return gs[round]['maxTricks']
}

function getCurrentPlayer() {
  return localStorage.getItem('currentPlayer')
}

function getCurrentPlayerVanity() {
  return localStorage.getItem(getCurrentPlayer()) || getCurrentPlayer().replace('layer','').toUpperCase()
}

function setCurrentPlayer(player) {
  return localStorage.setItem('currentPlayer', player)
}

function getCurrentPlayerPointsForCurrentRound() {
  var gs = getGameScore()
  var player = getCurrentPlayer()
  var round = getCurrentRound()
  var points = gs[round][player]['points']
  if (points !== null) {
    return points
  } else {
    return 0
  }
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
  if (currentBid < getMaxTricks()) {
    gs[round][player]['bid'] = gs[round][player]['bid'] + 1
    setGameScore(gs)
    calculateCurrentPlayerPoints()
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
    calculateCurrentPlayerPoints()
    draw()
  }
}

function actualUp() {
  var gs = getGameScore();
  var round = getCurrentRound();
  var player = getCurrentPlayer();
  var currentActual = gs[round][player]['actual']
  if (currentActual < getMaxTricks()) {
    if (currentActual === null) {
      gs[round][player]['actual'] = 0
    } else {
      gs[round][player]['actual'] = gs[round][player]['actual'] + 1
    }
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

function changePlayer(player) {
  setCurrentPlayer(player)
  document.getElementById('player1').classList.remove('alert-info')
  document.getElementById('player2').classList.remove('alert-info')
  document.getElementById('player3').classList.remove('alert-info')
  document.getElementById('player4').classList.remove('alert-info')
  document.getElementById(player).classList.add('alert-info')
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

function commitNames() {
  localStorage.setItem('player1', document.getElementById('player-one-name').value.toUpperCase().substr(0,4) || 'P1')
  localStorage.setItem('player2', document.getElementById('player-two-name').value.toUpperCase().substr(0,4) || 'P2')
  localStorage.setItem('player3', document.getElementById('player-three-name').value.toUpperCase().substr(0,4) || 'P3')
  localStorage.setItem('player4', document.getElementById('player-four-name').value.toUpperCase().substr(0,4) || 'P4')
  draw()
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
  if ((getTotalBid(round) === getMaxTricks()) && getMaxTricks() > 1) {
    document.querySelector('.totalBid').classList.add('red')
  } else {
    document.querySelector('.totalBid').classList.remove('red')
  }

  // Draw player scores
  document.getElementById('playerOneScore').innerHTML = getPlayerScore('player1')
  document.getElementById('playerTwoScore').innerHTML = getPlayerScore('player2')
  document.getElementById('playerThreeScore').innerHTML = getPlayerScore('player3')
  document.getElementById('playerFourScore').innerHTML = getPlayerScore('player4')

  // Draw player name
  document.getElementById('playerName').innerHTML = getCurrentPlayerVanity()

  // Draw current player bid
  document.getElementById('bid').value = getBid(getCurrentPlayer())

  // Draw current player actual
  document.getElementById('actual').value = getActual(getCurrentPlayer())

  // Draw points scored
  document.getElementById('pointsScored').innerHTML = getCurrentPlayerPointsForCurrentRound()

  // Draw bids for each player
  document.getElementById('playerOneBid').innerHTML = getBid('player1')
  document.getElementById('playerTwoBid').innerHTML = getBid('player2')
  document.getElementById('playerThreeBid').innerHTML = getBid('player3')
  document.getElementById('playerFourBid').innerHTML = getBid('player4')

  // Draw each player name
  document.getElementById('playerOneLabel').innerHTML = localStorage.getItem('player1') || 'P1'
  document.getElementById('playerTwoLabel').innerHTML = localStorage.getItem('player2') || 'P2'
  document.getElementById('playerThreeLabel').innerHTML = localStorage.getItem('player3') || 'P3'
  document.getElementById('playerFourLabel').innerHTML = localStorage.getItem('player4') || 'P4'
}


function onLoad() {
  // Set up blank game if there is no game state
  if (!localStorage.getItem('gameScore')) {
    console.log('No game score found')
    setUpGame()
  }
  // Populate names in player names modal
  document.getElementById('player-one-name').value = localStorage.getItem('player1')
  document.getElementById('player-two-name').value = localStorage.getItem('player2')
  document.getElementById('player-three-name').value = localStorage.getItem('player3')
  document.getElementById('player-four-name').value = localStorage.getItem('player4')

  changePlayer(getCurrentPlayer())
  draw()
}

onLoad()