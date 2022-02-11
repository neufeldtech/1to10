<template>
  <v-dialog v-model="showPlayerModal" persistent max-width="600px">
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
                v-model="players['p1']['name']"
                label="Player 1"
                hint="This player will be the first dealer"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="players['p2']['name']"
                label="Player 2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="players['p3']['name']"
                label="Player 3"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="players['p4']['name']"
                label="Player 4"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="submitPlayers"
          :disabled="!enoughPlayers"
          color="blue darken-1"
          text
        >
          Start
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "PlayersModal",
  methods: {
    submitPlayers() {
      let validatedPlayers = {};
      for (var p in this.players) {
        let player = this.players[p];
        if (player.name.length > 0) {
          validatedPlayers[p] = player;
        }
      }
      this.$store.commit({
        type: "newGame",
        players: validatedPlayers,
      });
    },
  },
  computed: {
    ...mapGetters(["showPlayerModal"]),
    enoughPlayers() {
      if (
        this.players["p1"].name.length > 0 &&
        this.players["p2"].name.length > 0 &&
        this.players["p3"].name.length > 0
      ) {
        return true;
      }
      return false;
    },
  },

  data() {
    return {
      players: {
        p1: {
          id: 1,
          name: "",
        },
        p2: {
          id: 2,
          name: "",
        },
        p3: {
          id: 3,
          name: "",
        },
        p4: {
          id: 4,
          name: "",
        },
      },
    };
  },
};
</script>