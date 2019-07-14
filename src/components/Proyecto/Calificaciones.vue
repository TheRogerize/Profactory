<template>
  <v-container class="calificaciones_contain" fluid fill-height>
    <v-layout row wrap fill-height xs7>
      <v-flex md8 xs12></v-flex>
      <v-flex md12 xs12 sm12 class="calificaciones">
        <v-layout row wrap>
          <v-flex mt-5 xs12 md12 sm12 text-xs-center>
            <v-hover>
              <v-card
                text-xs-center
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 12 : 2}`"
                class="cyan darken-2"
                dark
              >
                <h1 style="font-size: 30px">CALIFICACIONES</h1>
              </v-card>
            </v-hover>
          </v-flex>
          <v-flex pa-1 md12 sm12 xs12 text-xs-center text-md-center align-center justify-center>
            <v-layout row wrap text-xs-center align-center justify-center>
              <v-flex pa-3 xs12 md12 sm12>
                <h2>Calificación del Proyecto</h2>
                <v-rating readonly v-model="project.reputation" color="amber" large></v-rating>
                {{project.reputation}}
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center text-xs-center style="padding:10px; margin:15px">
          <v-card text-xs-center class="scroll" max-height="300px">
            <template v-for="(calification, index) in project.califications">
              <!-- <v-card-title
                :key="calification._from"
              >{{ calification._from }}</v-card-title>-->

              <!-- <v-divider  :key="index" :inset="calification.inset"></v-divider> -->

              <v-card-title :key="calification._from" avatar @click="''">
                <!-- <v-list-tile-avatar>
                  <img :src="item.avatar">
                </v-list-tile-avatar>-->
                <v-card-title style="padding:0; margin:0;">
                  <h2 style="font-size: 20px">
                    <v-card-title v-html="calification._from"></v-card-title>
                  </h2>
                </v-card-title>
                <v-card-text style="text-align:justify" v-html="calification.comment"></v-card-text>
                <v-list-tile-sub-title>
                  <v-rating readonly v-model="calification.stars" half-increments color="amber"></v-rating>
                  {{calification.stars}}
                </v-list-tile-sub-title>
              </v-card-title>
              <v-divider :key="index"></v-divider>
            </template>
          </v-card>
        </v-layout>
        <v-layout text-xs-center align-center justify-center>
          <v-flex pa-3 xs12 md12 sm12>
            <v-dialog
              v-model="dialog"
              max-width="400px"
              v-if="project.finished && !isProjectOwner && !project.calified"
            >
              <template v-slot:activator="{ on }">
                <v-btn class="cyan darken-2" v-on="on" round dark>CALIFICAR PROYECTO</v-btn>
              </template>
              <v-card>
                <v-flex text-xs-center class="text-xs-center">
                  <h1 style="text-align:center;">CALIFICA ESTE PROYECTO!</h1>
                </v-flex>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 text-xs-center>
                      <v-rating half-increments v-model="calification.stars" color="amber" hover></v-rating>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                      <v-textarea
                        v-model="calification.comment"
                        label="Deja tu opinión sobre el proyecto!"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" flat @click="createCalification">Enviar Calificación</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    rating: 5,
    meta: 25000,
    value: "0",
    acum: 50,
    cont: 2,
    dialog: false, // CALIFICAR

    // Calification
    calification: {
      stars: 0,
      comment: ""
    }
  }),

  props: {
    project: {
      required: true,
      type: Object
    },
    isProjectOwner: {
      required: true,
      type: Boolean
    }
  },

  methods: {
    createCalification() {
      const url = `${this.$store.state.host}/projects/${
        this.project.slug_name
      }/califications/`;
      // this.$store.commit("loading");

      axios
        .post(url, this.calification, {
          headers: this.$store.getters.authHeaders
        })
        .then(res => {
          this.$emit('refresh');
          // this.project.califications.unshift(res.data);
          // this.project.calified = true;
          // this.$store.commit("loaded");
          this.close();
          this.$store.commit(
            "openNotification",
            "Calificacion enviada con exito"
          );
        })
        .catch(err => {
          console.log(err.response.data);
          this.$store.commit("loaded");
          this.$store.commit("openNotification", "Ha ocurrido un error");
        });
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
<style scoped>
.calificaciones_contain {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.contain {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0px;
}
.carta_principal {
  margin: 0;
  padding: 0;
}
.donaciones {
  height: 100%;
}
.calificaciones {
  background: #f5f5f5;
  height: 100%;
}

.sinicon {
  padding: 20px;
}
.textocentral {
  text-align: center;
}
p {
  font-family: "Quicksand", sans-serif;
  color: #616161;
  font-size: 17px;
}
h1 {
  font-family: "Quicksand", sans-serif;
  font-size: 25px;
}
h2 {
  font-family: "Quicksand", sans-serif;
  font-size: 20px;
  color: #546e7a;
}
h3 {
  font-family: "Quicksand", sans-serif;
  font-size: 18px;
  color: #9ccc65;
}
label {
  font-size: 16px;
}
.inputPrice input[type="number"] {
  -moz-appearance: textfield;
}
.inputPrice input::-webkit-outer-spin-button,
.inputPrice input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.scroll {
  overflow-y: auto;
}
</style>