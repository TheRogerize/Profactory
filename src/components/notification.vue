<template>
  <v-snackbar :value="this.notification.status" :timeout="time" @timeupdate="consola()">
    {{ this.notification.message }}
    <v-btn dark flat @click="close()">Cerrar</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "notification",
  data() {
    return {
      time: 6000
    }
  },
  methods: {
    close() {
      this.$store.commit("closeNotification");
    }
  },
  computed: {
    ...mapState(["notification"])
  }
};
</script>


