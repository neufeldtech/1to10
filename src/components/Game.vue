<template>
  <v-container>
    <v-row justify="center">
      <PlayersModal />
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="prevRound" block>Prev </v-btn>
      </v-col>
      <v-col class="text-center">
        <h5>Round {{ currentRound }}</h5>
        <h4>Tricks: {{ tricks }}</h4>
      </v-col>
      <v-col class="text-right">
        <v-btn @click="nextRound" block> Next </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <BiddingCard :key="currentRound" v-if="showBiddingCard" />
        <PlayingCard :key="currentRound" v-if="showPlayingCard" />
        <ScoringCard :key="currentRound" v-if="showScoringCard" />
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
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Game",
  components: {
    PlayersModal,
    BiddingCard,
    PlayingCard,
    ScoringCard,
    Scoreboard,
  },
  methods: {
    ...mapActions(["prevRound", "nextRound"]),
    ...mapMutations(["increment"]),
  },
  computed: {
    ...mapGetters([
      "myscore",
      "tricks",
      "currentRound",
      "showBiddingCard",
      "showPlayingCard",
      "showScoringCard",
      "showScoreboard",
      "showPlayerModal",
    ]),
  },
};
</script>
