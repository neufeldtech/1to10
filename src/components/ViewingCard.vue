<template>
  <v-card elevation="1">
    <v-card-title>Round {{ currentRound }} Complete </v-card-title>
    <v-card-text v-show="showNextRound" class="mb-0 pb-0">
      <p>Tap below to advance to next round</p>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-text v-show="!showNextRound" class="mb-0 pb-0">
      <h3 class="text-center">🎉 {{ winner.name }} is the winner! 🎉</h3>
    </v-card-text>
    <v-card-actions>
      <v-col cols="12">
        <v-btn
          v-show="showNextRound"
          @click="nextRound"
          small
          color="primary"
          elevation="2"
        >
          Next Round<v-icon> mdi-redo </v-icon></v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ViewingCard",
  methods: {
    ...mapActions(["nextRound"]),
  },
  computed: {
    ...mapGetters(["currentRound", "playerTotals", "players"]),
    showNextRound() {
      if (this.currentRound == 20) {
        return false;
      }
      return true;
    },
    winner() {
      let topScorer = { id: 0, score: 0 };

      for (let playerKey of Object.keys(this.playerTotals)) {
        let currentScore = this.playerTotals[playerKey];

        if (currentScore > topScorer.score) {
          topScorer.id = playerKey;
          topScorer.score = currentScore;
        }
      }
      return this.players[topScorer.id];
    },
  },
};
</script>
