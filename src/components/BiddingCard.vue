<template>
  <v-card elevation="1">
    <v-card-title>Now Bidding: {{ currentPlayerObj.name }}</v-card-title>
    <v-card-text class="mb-0 pb-0">
      <p>Total bid: {{ totalBid }}</p>
      <v-divider></v-divider>
      <v-alert v-show="showBidWarning" dense type="error" outlined>
        Total bid cannot equal number of tricks
      </v-alert>
      <v-slider
        @input="updateBid"
        :value="currentBid"
        :max="maxBid"
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
          :disabled="nextPlayerAvailable || showBidWarning"
          @click="startPlayingRound"
          small
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
  name: "BiddingCard",
  methods: {
    updateBid(e) {
      this.$store.commit({
        type: "submitBid",
        id: this.currentPlayer,
        round: this.currentRound,
        value: e,
      });
    },
    ...mapActions(["nextPlayer", "prevPlayer", "startPlayingRound"]),
  },

  computed: {
    ...mapGetters({
      maxBid: "tricks",
      currentBid: "currentPlayerWant",
      totalBid: "currentTotalBid",
    }),
    ...mapGetters([
      "currentPlayer",
      "currentPlayerObj",
      "currentRound",
      "showBidWarning",
      "playOrder",
      "prevPlayerAvailable",
      "nextPlayerAvailable",
    ]),
  },
};
</script>