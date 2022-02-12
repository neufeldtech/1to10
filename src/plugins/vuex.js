import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const store = new Vuex.Store({
  state: {
    players: {
    },
    playersList: [],
    round: 1,
    score: {
    },
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        );
      }
    },
    newGame(state, payload) {
      Vue.set(state, "players", payload.players);
      let playersList = [];
      for (var p in payload.players) {
        let player = payload.players[p];

        playersList.push(player);
      }
      Vue.set(state, "playersList", playersList);
      const playerIDList = state.playersList.map((p) => p.id);
      let score = {};
      for (let r = 1; r < 21; r++) {
        let shiftNum = r % playerIDList.length;
        let playOrder = Vue.helpers.shiftBy(playerIDList, shiftNum);
        let currentPlayer = playOrder[0];
        let round = {
          tricks: Vue.helpers.tricksForRound(r),
          playOrder,
          currentPlayer,

          state: "bidding",
        };
        for (let p = 0; p < playerIDList.length; p++) {
          round[`wantsp${playerIDList[p]}`] = null;
        }
        for (let p = 0; p < playerIDList.length; p++) {
          round[`gotsp${playerIDList[p]}`] = null;
        }
        score[`round${r}`] = round;
      }
      Vue.set(state, "score", score);
    },
    submitBid(state, payload) {
      let roundsKey = `round${payload.round}`;
      let wantsKey = `wantsp${payload.id}`

      Vue.set(
        state.score[roundsKey],
        wantsKey,
        payload.value
      );
    },
    submitScore(state, payload) {
      let roundsKey = `round${payload.round}`;
      let gotsKey = `gotsp${payload.id}`
      Vue.set(
        state.score[roundsKey],
        gotsKey,
        payload.value
      );
    },
    setPlayerTurn(state, payload) {
      let roundKey = `round${payload.round}`
      Vue.set(
        state.score[roundKey],
        "currentPlayer",
        payload.player
      )
    },
    setState(state, payload) {
      let roundKey = `round${payload.round}`
      Vue.set(
        state.score[roundKey],
        "state",
        payload.state
      )
    },
    setRound(state, payload) {
      Vue.set(
        state,
        "round",
        payload.round
      )
    },
  },
  actions: {
    startPlayingRound({ commit, getters }) {
      commit({
        type: 'setState',
        round: getters.currentRound,
        state: 'playing',
      })
      commit({
        type: 'setPlayerTurn',
        round: getters.currentRound,
        player: getters.playOrder[0]
      })
    },
    commitRound({ commit, getters }) {
      commit({
        type: 'setState',
        round: getters.currentRound,
        state: 'viewing',
      })
    },
    nextPlayer({ commit, getters }) {
      if (
        getters.playOrder.indexOf(getters.currentPlayer) ==
        getters.playOrder.length - 1
      ) {
        return;
      }
      let currentIndex = getters.playOrder.indexOf(getters.currentPlayer);
      let newIndex = currentIndex + 1;
      commit({
        type: 'setPlayerTurn',
        round: getters.currentRound,
        player: getters.playOrder[newIndex]
      })
    },
    prevPlayer({ commit, getters }) {
      if (
        getters.playOrder.indexOf(getters.currentPlayer) == 0) {
        return;
      }
      let currentIndex = getters.playOrder.indexOf(getters.currentPlayer);
      let newIndex = currentIndex - 1;
      commit({
        type: 'setPlayerTurn',
        round: getters.currentRound,
        player: getters.playOrder[newIndex]
      })
    },
    prevRound({ commit, getters }) {
      if (getters.prevRoundAvailable) {
        let newRound = getters.currentRound - 1;
        commit({ type: 'setRound', round: newRound })
      }
    },
    nextRound({ commit, getters }) {
      if (getters.nextRoundAvailable) {
        let newRound = getters.currentRound + 1;
        commit({ type: 'setRound', round: newRound })
      }
    },

    scoreRound({ commit, getters }) {
      commit({
        type: 'setState',
        round: getters.currentRound,
        state: 'scoring',

      })
    },
  },
  getters: {

    tricks(state) {
      if (state.round === 20) {
        return 10;
      }
      if (state.round > 10) {
        return 20 - state.round;
      }
      return state.round;
    },
    currentPlayer(state, getters) {
      return state.score[getters.currentRoundIndex].currentPlayer;
    },
    currentPlayerObj(state, getters) {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].currentPlayer
      ) {
        return state.players[getters.currentPlayerIndex];
      }
      return {};
    },
    currentState(state, getters) {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].state
      ) {
        return state.score[getters.currentRoundIndex].state;
      }
      return "setup";
    },
    currentRound(state) {
      return state.round;
    },
    players(state) {
      return state.players
    },
    nextRoundAvailable(state, getters) {
      if (
        getters.currentRound < 20 &&
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].state == "viewing"
      ) {
        return true;
      }
      return false;
    },
    prevRoundAvailable(state, getters) {
      if (getters.currentRound == 1) {
        return false;
      }
      return true;
    },
    prevPlayerAvailable(state, getters) {
      if (getters.playOrder.indexOf(getters.currentPlayer) == 0) {
        return false;
      }
      return true;
    },
    nextPlayerAvailable(state, getters) {
      if (
        getters.playOrder.indexOf(getters.currentPlayer) ==
        getters.playerCount - 1
      ) {
        return false;
      }
      return true;
    },
    playerTotals(state) {
      let runningTotals = {};
      for (let roundKey of Object.keys(state.score)) {
        let round = state.score[roundKey];
        if (
          round.state == "setup" ||
          round.state == "bidding" ||
          round.state == "playing"
        ) {
          continue;
        }

        for (let playerKey of Object.keys(state.players)) {
          if (runningTotals[playerKey] === undefined) {
            runningTotals[playerKey] = 0;
          }
          let want = round[`wants${playerKey}`]
          let got = round[`gots${playerKey}`]
          if (got != null) {
            let thisRoundScore = Vue.helpers.calculateRoundScore(
              want,
              got,
            );
            runningTotals[playerKey] += thisRoundScore;
          }
        }
      }
      return runningTotals;
    },
    currentRoundScoreState(state, getters) {
      return state.score[getters.currentRoundIndex];
    },
    playOrder(state, getters) {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].playOrder
      ) {
        return state.score[getters.currentRoundIndex].playOrder;
      }
      return [];
    },
    currentRoundIndex(state, getters) {
      return `round${getters.currentRound}`;
    },
    currentPlayerIndex(state, getters) {
      return `p${getters.currentPlayer}`;
    },
    currentPlayerWant(state, getters) {
      let round = state.score[getters.currentRoundIndex];
      return round[`wants${getters.currentPlayerIndex}`];
    },
    currentPlayerGot(state, getters) {
      let round = state.score[getters.currentRoundIndex];
      return round[`gots${getters.currentPlayerIndex}`];
    },
    currentTotalBid(state, getters) {
      let total = 0;
      let round = state.score[getters.currentRoundIndex];
      for (let playerKey of Object.keys(state.players)) {
        total += round[`wants${playerKey}`];
      }
      return total;
    },
    currentTotalScored(state, getters) {
      let total = 0;
      let round = state.score[getters.currentRoundIndex];
      for (let playerKey of Object.keys(state.players)) {
        total += round[`gots${playerKey}`];
      }
      return total;
    },
    playerCount(state) {
      return state.playersList.length;
    },
    showBidWarning(state, getters) {
      if (getters.tricks == 1) {
        return false
      }
      if (!getters.nextPlayerAvailable && getters.currentTotalBid == getters.tricks) {
        return true
      }
      return false
    },
    showScoredWarning(state, getters) {
      if (getters.currentTotalScored > getters.tricks) {
        return true
      }
      if (!getters.nextPlayerAvailable && getters.currentTotalScored != getters.tricks) {
        return true
      }
      return false
    },
    showBiddingCard(state, getters) {
      if (getters.currentState == "bidding") {
        return true;
      }
      return false;
    },
    showPlayingCard(state, getters) {
      if (getters.currentState == "playing") {
        return true;
      }
      return false;
    },
    showScoringCard(state, getters) {
      if (getters.currentState == "scoring") {
        return true;
      }
      return false;
    },
    showViewingCard(state, getters) {
      if (getters.currentState == "viewing") {
        return true;
      }
      return false;
    },
    showScoreboard(state, getters) {
      if (getters.currentState == "setup") {
        return false;
      }
      return true;
    },
    showPlayerModal(state, getters) {
      if (getters.playerCount < 3) {
        return true;
      }
      return false;
    },
  }
})

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

export default store