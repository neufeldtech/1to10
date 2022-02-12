<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>One to Ten</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon @click.stop="newGame">mdi-autorenew</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Game />
    </v-main>
  </v-app>
</template>

<script>
import Game from "./components/Game";

export default {
  name: "App",

  components: {
    Game,
  },
  methods: {
    newGame() {
      if (confirm("Are you sure you want to start a new game?")) {
        localStorage.clear();
        window.location.reload();
      }
    },
  },
};
</script>
