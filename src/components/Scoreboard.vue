<template>
  <v-data-table
    :items="scoreItems"
    :headers="scoreHeaders"
    mobile-breakpoint="200"
    hide-default-footer
    :value="[{ id: currentPlayer }]"
    dense
    disable-sort
    disable-pagination
    disable-filtering
    class="elevation-1"
  >
    <template v-slot:[`item.name`]="{ item }">
      {{ item.name }}
      <v-chip x-small outlined color="blue" v-if="dealer == item.id">
        Dealer
      </v-chip>
    </template>
    <template v-slot:[`item.want`]="{ item }">
      {{ item.want }}
      <v-chip
        x-small
        class="pr-2 pl-2"
        v-if="currentPlayer == item.id && roundState == 'bidding'"
        color="orange"
      >
        Bidding
      </v-chip>
    </template>

    <template v-slot:[`item.got`]="{ item }">
      {{ item.got }}

      <v-chip
        class="badge-chip white--text pr-1 pl-1 mb-3"
        v-if="item.got !== null"
        x-small
        :color="colorForScore(calculateRoundScore(item.want, item.got))"
        >{{ roundScoreChip(item.want, item.got) }}</v-chip
      >
    </template>

    <template v-slot:[`item.score`]="{ item }">
      {{ playerTotals[`p${item.id}`] }}
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters } from "vuex";
import helpers from "../plugins/helpers";
export default {
  name: "Scoreboard",
  data() {
    return {
      scoreHeaders: [
        {
          text: "Player",
          value: "name",
        },
        {
          text: "Bid",
          value: "want",
        },
        {
          text: "Got",
          value: "got",
        },
        {
          text: "Score",
          value: "score",
        },
      ],
      shouldShowGot: {},
    };
  },
  computed: {
    dealer() {
      return this.playOrder[this.playOrder.length - 1];
    },
    ...mapGetters({
      roundScoreState: "currentRoundScoreState",
      roundState: "currentState",
    }),
    ...mapGetters(["players", "playOrder", "currentPlayer", "playerTotals"]),
    scoreItems() {
      let r = this.roundScoreState;
      let scores = [];
      for (let playerKey of Object.keys(this.players)) {
        let scoreLine = {};
        scoreLine.id = this.players[playerKey].id;
        scoreLine.name = this.players[playerKey].name;
        scoreLine.want = r[`wants${playerKey}`];
        scoreLine.got = r[`gots${playerKey}`];
        scores.push(scoreLine);
      }
      return scores;
    },
  },

  methods: {
    roundScoreChip(want, got) {
      let num = this.calculateRoundScore(want, got);
      let sign = num < 0 ? "-" : "+";
      return `${sign}${num}`;
    },

    calculateRoundScore: helpers.calculateRoundScore,

    colorForScore(s) {
      if (s > 10) {
        return "green";
      } else if (s < 8) {
        return "red";
      } else if (s < 10) {
        return "orange";
      }
      return "blue";
    },
  },
};
</script>
