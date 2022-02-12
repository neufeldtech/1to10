<template>
  <v-container>
    <v-row justify="center">
      <PlayersModal />
    </v-row>
    <v-row>
      <v-col>
        <v-btn :disabled="!prevRoundAvailable" @click="prevRound" block
          >Prev
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <h5>Round {{ currentRound }}</h5>
        <h4>Tricks: {{ tricks }}</h4>
      </v-col>
      <v-col class="text-right">
        <v-btn :disabled="!nextRoundAvailable" @click="nextRound" block>
          Next
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <BiddingCard v-if="showBiddingCard" />
        <PlayingCard v-if="showPlayingCard" />
        <ScoringCard v-if="showScoringCard" />
        <ViewingCard v-if="showViewingCard" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Scoreboard v-if="showScoreboard" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayersModal from "./PlayersModal.vue";
import BiddingCard from "./BiddingCard.vue";
import PlayingCard from "./PlayingCard.vue";
import ScoringCard from "./ScoringCard.vue";
import Scoreboard from "./Scoreboard.vue";
import ViewingCard from "./ViewingCard.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Game",
  components: {
    PlayersModal,
    BiddingCard,
    PlayingCard,
    ScoringCard,
    Scoreboard,
    ViewingCard,
  },
  methods: {
    ...mapActions(["prevRound", "nextRound"]),
    ...mapMutations(["increment"]),
  },
  computed: {
    ...mapGetters([
      "tricks",
      "currentRound",
      "showBiddingCard",
      "showPlayingCard",
      "showScoringCard",
      "showViewingCard",
      "showScoreboard",
      "showPlayerModal",
      "prevRoundAvailable",
      "nextRoundAvailable",
    ]),
  },
};
</script>
