<template>
  <v-card elevation="1">
    <v-card-title>Now Scoring: {{ currentPlayerObj.name }} </v-card-title>
    <v-card-text class="mb-0 pb-0">
      <p>Record number of tricks received</p>
      <v-divider></v-divider>
      <v-alert dense type="error" outlined>
        Total tricks received from all players must equal {{ maxScore }}
      </v-alert>
      <v-slider
        :value="currentScore"
        @input="updateScore"
        :max="maxScore"
        class="mt-8"
        ticks="always"
        thumb-label="always"
      ></v-slider>
    </v-card-text>
    <v-card-actions>
      <v-col cols="8">
        <v-btn
          :disabled="!prevPlayerAvailable"
          @click="prevPlayer"
          small
          color="red"
          elevation="2"
        >
          <v-icon> mdi-undo </v-icon>Back</v-btn
        >
        <v-btn
          :disabled="!nextPlayerAvailable"
          @click="nextPlayer"
          small
          color="primary"
          elevation="2"
        >
          Next<v-icon> mdi-redo </v-icon></v-btn
        >
      </v-col>

      <v-col cols="4" class="text-right">
        <v-btn
          small
          :disabled="nextPlayerAvailable"
          @click="commitRound"
          color="green"
          elevation="2"
        >
          <v-icon> mdi-check </v-icon>OK</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ScoringCard",
  methods: {
    updateScore(e) {
      this.$store.commit({
        type: "submitScore",
        id: this.currentPlayer,
        round: this.currentRound,
        value: e,
      });
    },
    ...mapActions(["nextPlayer", "prevPlayer", "commitRound"]),
  },
  computed: {
    ...mapGetters({
      maxScore: "tricks",
      currentScore: "currentPlayerGot",
    }),
    ...mapGetters([
      "currentPlayer",
      "currentPlayerObj",
      "currentRound",
      "playOrder",
      "prevPlayerAvailable",
      "nextPlayerAvailable",
    ]),
  },
};
</script>
