<template>
  <v-app class="grey lighten-4">
    <Navbar/>

    <v-main>
      <v-alert
          color="red"
          dismissible
          type="error"
          v-if="$store.state.error.show"
      >
        {{ $store.state.error.text }}
      </v-alert>
      <router-view></router-view>
    </v-main>
    <v-snackbar
        v-model="snackbar"
        :timeout="snackbarTimeout"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import EventBus, {ACTIONS} from './eventBus';
import {showSnackbar} from './globalActions';
import Navbar from './components/Navbar'

export default {
  components: {Navbar},
  name: 'App',
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 5000
    }
  },
  mounted() {
    EventBus.$on(ACTIONS.SNACKBAR, (message) => {
      this.snackbar = true;
      this.snackbarText = message;
    });
  },
  created() {
    setTimeout(function () {
      showSnackbar('Welcome');
    }, 1000);
  }
}
</script>