<template>
  <v-card elevation="1">
    <v-card-title>Now Playing Round {{ currentRound }}</v-card-title>
    <v-card-text class="mb-0 pb-0">
      <p>Tap below after all cards have been played</p>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-actions>
      <v-col cols="12">
        <v-btn @click="scoreRound" small color="primary" elevation="2">
          <v-icon> mdi-check </v-icon>Round Complete</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PlayingCard",
  methods: {
    ...mapActions(["scoreRound"]),
  },
  computed: {
    ...mapGetters(["currentRound"]),
  },
};
</script>