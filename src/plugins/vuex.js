import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const store = new Vuex.Store({
  state: {
    players: {
      // p1: {
      //   id: 1,
      //   name: "",
      // },
    },
    playersList: [],
    round: 1,
    myscore: {
      myround1: {
        gots: {
          p1: 1
        }
      },
      myround2: {
        gots: {
          p2: 2
        }
      }
    },
    score: {
      // round1: {
      //   tricks: 1,
      //   playOrder: [2, 3, 4, 1],
      //   dealer: 1
      //   currentPlayer: 2
      //   state: "setup", // setup / bidding / playing / scoring / viewing
      //   wants: {
      //     p1: 0,
      //     p2: 1,
      //     p3: 2,
      //   },
      //   gots: {
      //     p1: 0,
      //     p2: 1,
      //     p3: 1,
      //   },
      // },
    },

  },
  mutations: {
    increment(state) {
      let round = 'myround1'
      Vue.set(state.myscore[round].gots, 'p2', 3)
    },
    initialiseStore(state) {
      // Check if the ID exists
      if (localStorage.getItem('store')) {
        // Replace the state object with the stored item
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
    commitRound({ commit, getters, dispatch }) {
      commit({
        type: 'setState',
        round: getters.currentRound,
        state: 'viewing',
      })
      dispatch({ type: 'nextRound' })
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
    myscore(state) {
      return state.myscore
    },
    tricks: (state) => {
      if (state.round === 20) {
        return 10;
      }
      if (state.round > 10) {
        return 20 - state.round;
      }
      return state.round;
    },
    currentPlayer: (state, getters) => {
      return state.score[getters.currentRoundIndex].currentPlayer;
    },
    currentPlayerObj: (state, getters) => {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].currentPlayer
      ) {
        return state.players[getters.currentPlayerIndex];
      }
      return {};
    },
    currentState: (state, getters) => {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].state
      ) {
        return state.score[getters.currentRoundIndex].state;
      }
      return "setup";
    },
    currentRound: (state) => {
      return state.round;
    },
    players(state) {
      return state.players
    },
    nextRoundAvailable: (state, getters) => {
      if (
        getters.currentRound <= 20 &&
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].state == "viewing"
      ) {
        return true;
      }
      return false;
    },
    prevRoundAvailable: (state, getters) => {
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
    playerTotals: (state) => {
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
          let thisRoundScore = Vue.helpers.calculateRoundScore(
            round[`wants${playerKey}`],
            round[`gots${playerKey}`]
          );
          runningTotals[playerKey] += thisRoundScore;
        }
      }
      return runningTotals;
    },
    currentRoundScoreState: (state, getters) => {
      return state.score[getters.currentRoundIndex];
    },
    playOrder: (state, getters) => {
      if (
        state.score[getters.currentRoundIndex] &&
        state.score[getters.currentRoundIndex].playOrder
      ) {
        return state.score[getters.currentRoundIndex].playOrder;
      }
      return [];
    },
    currentRoundIndex: (state, getters) => {
      return `round${getters.currentRound}`;
    },
    currentPlayerIndex: (state, getters) => {
      return `p${getters.currentPlayer}`;
    },
    currentPlayerWant: (state, getters) => {
      let round = state.score[getters.currentRoundIndex];

      return round[`wants${getters.currentPlayerIndex}`];
      // if (round && round.wants && round.wants[getters.currentPlayerIndex]) {
      // }
      // return 0;
    },
    currentPlayerGot: (state, getters) => {
      let round = state.score[getters.currentRoundIndex];

      return round[`gots${getters.currentPlayerIndex}`];
      // let round = state.score[getters.currentRoundIndex];
      // if (round && round.gots && round.gots[getters.currentPlayerIndex]) {
      //   return round.gots[getters.currentPlayerIndex];
      // }
      // return null;
    },
    currentTotalBid: (state, getters) => {
      let total = 0;
      let round = state.score[getters.currentRoundIndex];
      if (round && round.wants) {
        for (let playerKey of Object.keys(round.wants)) {
          total += round.wants[playerKey];
        }
        return total;
      }
      return 0;
    },
    playerCount: (state) => {
      return state.playersList.length;
    },

    showBiddingCard: (state, getters) => {
      if (getters.currentState == "bidding") {
        return true;
      }
      return false;
    },
    showPlayingCard: (state, getters) => {
      if (getters.currentState == "playing") {
        return true;
      }
      return false;
    },
    showScoringCard: (state, getters) => {
      if (getters.currentState == "scoring") {
        return true;
      }
      return false;
    },
    showScoreboard: (state, getters) => {
      if (getters.currentState == "setup") {
        return false;
      }
      return true;
    },
    showPlayerModal: (state, getters) => {
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