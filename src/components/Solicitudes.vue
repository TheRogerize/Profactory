<template>
  <v-card>
    <v-card-title class="indigo white--text headline">
      <h1>SOLICITUDES</h1>
    </v-card-title>
    <v-container text-xs-center class="solicitudes">
      <v-card flat v-for="(request, index) in follow_requests" :key="request.code">
        <v-layout row wrap pa-3>
          <v-flex xs12 sm6 md3>
            <div class="caption grey--text">
              <h3>Nombre de Usuario</h3>
            </div>
            <div>
              <h2>{{request.follower.username}}</h2>
            </div>
          </v-flex>
          <!-- FECHA DE PETICION -->
          <v-flex xs12 sm6 md3>
            <div class="caption grey--text">
              <h3>Fecha de Solicitud</h3>
            </div>
            <div>
              <h2>{{request.created}}</h2>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <!-- REDIRECCION A PERFIL DEL PROYECTO, habria que llamar a la ruta del perfil del proyecto-->
            <v-btn
              round
              color="light-blue lighten-1"
              dark
              :to="{ name:'perfil', params: { username: request.follower.username } }"
            >
              <h2>VER PERFIL DE USUARIO</h2>
            </v-btn>
          </v-flex>
          <!-- BOTONES DE SOLICITUDES -->
          <v-layout text-xs-center align-center justify-center>
            <v-flex xs6 sm6 md3>
              <div class="d-flex">
                <v-tooltip top content-class="top">
                  <v-btn
                    slot="activator"
                    class="v-btn--simple"
                    color="success"
                    @click="changeStatus(request.code, 'accept', index)"
                    icon
                    large
                  >
                    <v-icon color="green lighten-3">check_circle</v-icon>
                  </v-btn>
                  <span>Aceptar</span>
                </v-tooltip>
                <v-tooltip top content-class="top">
                  <v-btn
                    slot="activator"
                    class="v-btn--simple"
                    color="error"
                    @click="changeStatus(request.code, 'reject', index)"
                    icon
                    large
                  >
                    <v-icon color="red lighten-3">cancel</v-icon>
                  </v-btn>
                  <span>Rechazar</span>
                </v-tooltip>
              </div>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-divider></v-divider>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tabs: 0,
      update: false,
      list: {
        0: false,
        1: false,
        2: false
      },
      solicitudes: [
        { user: "Roy Gutierrez", date: "13/05/2019", status: "Pendiente" },
        { user: "Hebert Ferrer", date: "05/05/2019", status: "Aceptado" },
        { user: "Angeline Matos", date: "24/05/2019", status: "Rechazado" }
      ]
    };
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    changeStatus(code, action, index) {
      const url = `${this.$store.state.host}/users/${
        this.$store.state.user.username
      }/follow/${code}/${action}/`;

      // this.$store.commit("loading");
      axios
        .put(url, {}, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.$emit("refresh");
          // this.$store.commit("loaded");
          this.$store.commit(
            "openNotification",
            action === "accept" ? "Solicitud aceptada" : "Solicitud rechazada"
          );
          // this.follow_requests.splice(index, 1);
        })
        .catch(err => {
          console.log(err.response.data);
          // this.$store.commit("loaded");
        });
    }
  },
  props: {
    follow_requests: {
      type: Array,
      required: true,
      default: null
    }
  }
};
</script>
<style >
h1 {
  font-size: 32px;
  font-family: "Quicksand", sans-serif;
}
h2 {
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
}
h3 {
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
}
v-container {
  width: 100%;
}
.solicitudes {
  width: 100%;
  padding: 0;
  margin: 0;
}

.v-chip.Pendiente {
  background: #ffaa2c;
}
.v-chip.Finalizado {
  background: #3cd1c2;
}
.v-chip.Rechazado {
  background: tomato;
}
.v-chip.Aceptado {
  background: lightgreen;
}
</style>
