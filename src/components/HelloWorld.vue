<template>
  <v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">New Game</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12"> Enter the names of at least 3 players </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="p1"
                    label="Player 1"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="p2"
                    label="Player 2"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="p3"
                    label="Player 3"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="p4"
                    label="Player 4"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!validPlayers"
              color="blue darken-1"
              text
              @click="startGame"
            >
              Start
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-col>
        <v-btn :disabled="round === 1" block @click="prevRound">Prev </v-btn>
      </v-col>

      <v-col class="text-center">
        <h5>Round {{ round }}</h5>
        <h4>Tricks: {{ tricks }}</h4>
      </v-col>
      <v-col class="text-right">
        <v-btn :disabled="!nextRoundAvailable" block @click="nextRound">
          Next
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="1" v-if="roundState == 'bidding'">
          <v-card-title>Now Bidding: {{ currentPlayerName }}</v-card-title>
          <v-card-text class="mb-0 pb-0">
            <p>Total bid: 0</p>
            <v-divider></v-divider>
            <v-alert
              dense
              type="error"
              outlined
              v-show="!allBidsValid && currentPlayer == dealer"
            >
              Total bid cannot equal number of tricks
            </v-alert>
            <v-slider
              v-model="currentBid"
              :max="maxAllowableBid"
              class="mt-8"
              ticks="always"
              thumb-label="always"
              :tick-labels="new Array(maxAllowableBid)"
            ></v-slider>
          </v-card-text>
          <!-- </v-col> -->
          <!-- </v-row> -->
          <v-card-actions>
            <v-col cols="8">
              <v-btn @click="prevPlayer" small color="red" elevation="2">
                <v-icon> mdi-undo </v-icon>Undo</v-btn
              >
              <v-btn @click="submitBid" small color="primary" elevation="2">
                <v-icon> mdi-hand-back-right </v-icon>Bid</v-btn
              >
            </v-col>

            <v-col cols="4" class="text-right">
              <v-btn
                small
                @click="transitionRoundState('playing')"
                color="green"
                elevation="2"
                :disabled="!allBidsValid"
                v-if="allBidsSubmitted && currentPlayer == dealer"
              >
                <v-icon> mdi-play </v-icon>Play</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
        <v-card elevation="1" v-if="roundState == 'playing'">
          <v-card-title>Now Playing Round {{ round }}</v-card-title>
          <v-card-text class="mb-0 pb-0">
            <p>Tap below after all cards have been played</p>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-col cols="12">
              <v-btn
                @click="transitionRoundState('scoring')"
                small
                color="primary"
                elevation="2"
              >
                <v-icon> mdi-check </v-icon>Round Complete</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
        <v-card elevation="1" v-if="roundState == 'scoring'">
          <v-card-title>Now Scoring: {{ currentPlayerName }} </v-card-title>
          <v-card-text class="mb-0 pb-0">
            <p>Record number of tricks received</p>
            <v-divider></v-divider>
            <v-alert
              dense
              type="error"
              outlined
              v-show="
                !allScoresValid &&
                currentPlayer == dealer &&
                getCurrentRoundTricksForPlayer != null
              "
            >
              Total tricks received from all players must equal {{ tricks }}
            </v-alert>
            <v-slider
              v-model="currentScore"
              :max="maxAllowableBid"
              class="mt-8"
              ticks="always"
              thumb-label="always"
            ></v-slider>
          </v-card-text>
          <v-card-actions>
            <v-col cols="8">
              <v-btn @click="prevPlayer" small color="red" elevation="2">
                <v-icon> mdi-undo </v-icon>Undo</v-btn
              >
              <v-btn @click="submitScore" small color="primary" elevation="2">
                <v-icon> mdi-lead-pencil </v-icon>Score</v-btn
              >
            </v-col>

            <v-col cols="4" class="text-right">
              <v-btn
                small
                @click="finalizeRound"
                color="green"
                elevation="2"
                :disabled="!allScoresValid"
                v-if="allScoresValid && currentPlayer == dealer"
              >
                <v-icon> mdi-play </v-icon>Next</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :items="scoreForRound"
          :headers="scoreHeaders"
          mobile-breakpoint="200"
          hide-default-footer
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
              v-if="currentPlayer == item.id && roundState == 'bidding'"
              color="orange"
            >
              Bidding
            </v-chip>
          </template>

          <template v-slot:[`item.got`]="{ item }">
            <v-chip
              small
              outlined
              v-if="
                (roundState == 'scoring' || roundState == 'viewing') &&
                item.got != null
              "
              :color="colorForScore(calculateRoundScore(item.want, item.got))"
            >
              {{ item.got }}
            </v-chip>
            <v-chip
              x-small
              v-if="currentPlayer == item.id && roundState == 'scoring'"
              color="orange"
            >
              Scoring
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",
  watch: {
    p1(p) {
      localStorage.p1 = p;
    },
    p2(p) {
      localStorage.p2 = p;
    },
    p3(p) {
      localStorage.p3 = p;
    },
    p4(p) {
      localStorage.p4 = p;
    },
    round(r) {
      this.initRound(r);
      this.initBidder();

      localStorage.round = r;
    },
    dealer(d) {
      localStorage.dealer = d;
    },
    score(s) {
      localStorage.setItem("score", JSON.stringify(s));
    },
    currentPlayer() {
      this.currentBid = this.getCurrentRoundBidForPlayer;
      this.currentScore = this.getCurrentRoundTricksForPlayer;
    },
  },
  mounted() {
    // Load from storage
    if (localStorage.p1) {
      this.p1 = localStorage.p1;
    }
    if (localStorage.p2) {
      this.p2 = localStorage.p2;
    }
    if (localStorage.p3) {
      this.p3 = localStorage.p3;
    }
    if (localStorage.p4) {
      this.p4 = localStorage.p4;
    }
    if (localStorage.round) {
      this.round = Number(localStorage.round);
    }
    if (localStorage.dealer) {
      this.dealer = Number(localStorage.dealer);
    }
    try {
      if (localStorage.getItem("score")) {
        this.score = JSON.parse(localStorage.getItem("score"));
      }
    } catch (e) {
      console.log(e);
      // localStorage.removeItem("score");
      console.log("Error encountered loading state... resetting localstorage");
      localStorage.clear();
    }
    if (this.players.length < 3) {
      this.dialog = true;
    }
  },
  data: function () {
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
      score: [
        // {
        // round: 1,
        // state: (bidding / playing / scoring / viewing)
        // players: [
        // {
        //   id: 1,
        //   name: "player1",
        //   want: null,
        //   got: null,
        // },
        // ],
        // },
      ],
      dialog: false,
      round: 1,
      dealer: 1,
      currentPlayer: 2,
      currentBid: 0,
      currentScore: 0,
      p1: "",
      p2: "",
      p3: "",
      p4: "",
    };
  },
  computed: {
    nextRoundAvailable() {
      if (this.round == 20) {
        return false;
      }
      if (this.roundState == "viewing") {
        return true;
      }
      return false;
    },
    tricks() {
      if (this.round === 20) {
        return 10;
      }
      if (this.round > 10) {
        return 20 - this.round;
      }
      return this.round;
    },
    roundState() {
      // bidding / playing / scoring / viewing
      let round = this.round;
      let scoreRound = this.score.find((s) => round == s.round);
      if (scoreRound && scoreRound.state) {
        return scoreRound.state;
      }
      return "bidding";
    },
    allBidsValid() {
      let round = this.round;
      let scoreForRound = this.score.find((s) => s.round == round);
      if (scoreForRound && scoreForRound.players) {
        let totalBid = 0;
        scoreForRound.players.forEach((playerScore) => {
          if (playerScore.want) {
            totalBid += playerScore.want;
          }
        });
        if (totalBid != this.tricks || this.tricks == 1) {
          return true;
        }
      }
      return false;
    },
    allScoresValid() {
      let round = this.round;
      let scoreForRound = this.score.find((s) => s.round == round);
      if (scoreForRound && scoreForRound.players) {
        let totalGot = 0;
        scoreForRound.players.forEach((playerScore) => {
          if (playerScore.got) {
            totalGot += playerScore.got;
          }
        });
        if (totalGot == this.tricks) {
          return true;
        }
      }
      return false;
    },
    getCurrentRoundBidForPlayer() {
      let round = this.round;
      let player = this.currentPlayer;
      let currentRound = this.score.find(
        (roundScore) => roundScore.round == round
      );
      if (currentRound && currentRound.players) {
        return currentRound.players.find(
          (playerScore) => playerScore.id == player
        ).want;
      }
      return 0;
    },
    getCurrentRoundTricksForPlayer() {
      let round = this.round;
      let player = this.currentPlayer;
      let currentRound = this.score.find(
        (roundScore) => roundScore.round == round
      );
      if (currentRound && currentRound.players) {
        return currentRound.players.find(
          (playerScore) => playerScore.id == player
        ).got;
      }
      return null;
    },
    maxAllowableBid() {
      return this.tricks;
    },
    allBidsSubmitted() {
      let round = this.round;
      let roundScore = this.score.find((s) => s.round == round);
      if (roundScore) {
        return roundScore.players.every((player) => player.want != null);
      }
      return false;
    },

    currentPlayerName() {
      let bidder = this.players.find((p) => this.currentPlayer == p.id);
      // console.log(bidder);
      if (bidder) {
        return bidder.name;
      }
      return "";
    },
    playerCount() {
      return this.players.length;
    },

    dealerName() {
      return this.players[this.dealer - 1].name;
    },
    scoreForRound() {
      let round = this.round;
      // console.log(this.score[this.round]);
      let r = this.score.find((s) => {
        // console.log(s.round, this.round);
        return s.round == round;
      });
      if (r) {
        return r.players;
      }
      return [];
    },
    players() {
      let p = [];
      if (this.p1) {
        p.push({ id: 1, name: this.p1 });
      }
      if (this.p2) {
        p.push({ id: 2, name: this.p2 });
      }
      if (this.p3) {
        p.push({ id: 3, name: this.p3 });
      }
      if (this.p4) {
        p.push({ id: 4, name: this.p4 });
      }
      return p;
    },
    validPlayers() {
      if (this.p1.length > 0 && this.p2.length > 0 && this.p3.length > 0) {
        return true;
      }
      return false;
    },
  },

  methods: {
    initRound(roundNumber) {
      const roundExists = this.score.find((el) => {
        return el.round == roundNumber;
      });
      if (roundExists) {
        return;
      }

      this.score.push({
        round: roundNumber,
        state: "bidding",
        players: this.players.map((player) => {
          player.got = null;
          player.want = null;
          return player;
        }),
      });
    },
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
    transitionRoundState(s) {
      let round = this.round;

      const roundScoreIndex = this.score.findIndex((r) => r.round == round);

      let newRoundScore = [...this.score];

      newRoundScore[roundScoreIndex] = {
        ...newRoundScore[roundScoreIndex],
        state: s,
      };
      this.$set(this.score, roundScoreIndex, newRoundScore[roundScoreIndex]);
      this.initBidder();
    },
    initBidder() {
      if (this.dealer == this.playerCount) {
        this.currentPlayer = 1;
        return;
      }
      return (this.currentPlayer = this.dealer + 1);
    },
    calculateRoundScore(want, got) {
      let baseScore = 10;
      if (got == want) {
        let points = want * 2;
        return baseScore + points;
      } else {
        let penalty = Math.abs(want - got) * 2;
        return baseScore - penalty;
      }
    },
    startGame() {
      if (this.validPlayers) {
        this.initRound(1);
      }
      this.dialog = false;
    },
    prevRound() {
      if (this.round > 1) {
        this.round = this.round - 1;
        this.prevDealer();
      }
    },
    prevDealer() {
      if (this.dealer === 1) {
        this.dealer = this.playerCount;
        return;
      }
      this.dealer = this.dealer - 1;
    },
    nextRound() {
      if (this.round < 20) {
        this.round = this.round + 1;
        this.nextDealer();
      }
    },
    nextDealer() {
      if (this.dealer === this.playerCount) {
        this.dealer = 1;
        return;
      }
      this.dealer = this.dealer + 1;
    },
    nextPlayer() {
      let newBidder = this.currentPlayer;
      if (this.currentPlayer == this.dealer) {
        return;
      }
      if (this.currentPlayer == this.playerCount) {
        newBidder = 1;
      } else {
        newBidder = newBidder + 1;
      }
      this.currentPlayer = newBidder;
      return;
    },
    prevPlayer() {
      let newBidder = this.currentPlayer;
      if (this.currentPlayer == 1) {
        newBidder = this.playerCount;
      } else {
        newBidder = newBidder - 1;
      }

      if (this.dealer == newBidder) {
        return;
      }
      this.currentPlayer = newBidder;
      return;
    },
    submitBid() {
      let round = this.round;
      let currentPlayer = this.currentPlayer;
      let currentBid = this.currentBid;
      const roundScoreIndex = this.score.findIndex((r) => r.round == round);

      let newRoundScore = [...this.score];

      newRoundScore[roundScoreIndex] = {
        ...newRoundScore[roundScoreIndex],
        players: newRoundScore[roundScoreIndex].players.map((player) => {
          if (player.id == currentPlayer) {
            player.want = currentBid;
            return player;
          } else {
            return player;
          }
        }),
      };
      this.$set(this.score, roundScoreIndex, newRoundScore[roundScoreIndex]);
      this.nextPlayer();
    },
    submitScore() {
      let round = this.round;
      let currentPlayer = this.currentPlayer;
      let currentScore = this.currentScore;
      const roundScoreIndex = this.score.findIndex((r) => r.round == round);

      let newRoundScore = [...this.score];

      newRoundScore[roundScoreIndex] = {
        ...newRoundScore[roundScoreIndex],
        players: newRoundScore[roundScoreIndex].players.map((player) => {
          if (player.id == currentPlayer) {
            player.got = currentScore;
            return player;
          } else {
            return player;
          }
        }),
      };
      this.$set(this.score, roundScoreIndex, newRoundScore[roundScoreIndex]);
      this.nextPlayer();
    },
    finalizeRound() {
      this.transitionRoundState("viewing");
      this.nextRound();
    },
  },
};
</script>
