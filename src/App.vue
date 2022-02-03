<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>One to Ten</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon @click.stop="newGame">mdi-autorenew</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld drawerState="drawer" />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: false,
  }),
  methods: {
    newGame() {
      if (confirm("Are you sure you want to start a new game?")) {
        localStorage.clear();
        window.location.reload();
      }
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
