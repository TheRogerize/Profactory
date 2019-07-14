<template>
  <v-container class="contain" fluid fill-height>
    <v-card pa-3 class="carta_principal">
      <v-layout row wrap fill-height>
        <!-- INFORMACION PROYECTO -->
        <v-flex xs12 sm7 md8>
          <v-layout row wrap>
            <!-- NOMBRE PROYECTO -->
            <v-flex align-center justify-center pa-3 xs12 md12 sm12 text-xs-center>
              <v-hover>
                <v-card
                  text-xs-center
                  slot-scope="{ hover }"
                  :class="`elevation-${hover ? 12 : 2}`"
                  class="cyan darken-1"
                  dark
                >
                  <h1>
                    {{project.title}}
                    <!-- EDITAR PROYECTO -->
                    <v-dialog persistent v-model="dialog" max-width="700px">
                      <template
                        v-slot:activator="{ on }"
                        v-if="isProjectOwner && !project.finished"
                      >
                        <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                          <v-icon v-on="on" @click="fillProjectData">edit</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-flex text-xs-center class="text-xs-center">
                          <h1 style="text-align:center;">Modificar Información de Proyecto</h1>
                        </v-flex>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-form ref="form">
                              <v-layout wrap>
                                <!-- TITULO -->
                                <v-flex xs12>
                                  <v-text-field
                                    v-model="editedProject.title"
                                    label="Nombre del Proyecto"
                                    :rules="notNullRule"
                                    :counter="50"
                                    maxlength="50"
                                    required
                                  ></v-text-field>
                                </v-flex>

                                <!-- DESCRIPCION -->
                                <v-flex xs12>
                                  <v-textarea
                                    v-model="editedProject.description"
                                    :rules="notNullRule"
                                    label="Descripción"
                                    required
                                  ></v-textarea>
                                </v-flex>

                                <!-- CATEGORIA -->
                                <v-flex row xs12 sm12 md12>
                                  <v-select
                                    v-model="editedProject.category"
                                    :items="categoryItems"
                                    item-value="value"
                                    item-text="text"
                                    :rules="notNullRule"
                                    return-object
                                  ></v-select>
                                  <!-- <v-text-field
                                    v-model="meta"
                                    @keypress="isNumber($event)"
                                    :counter="15"
                                    label="Meta"
                                    prepend-icon="monetization_on"
                                    required
                                  ></v-text-field>-->
                                </v-flex>
                              </v-layout>
                            </v-form>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                          <v-btn color="blue darken-1" flat @click="editProject">Guardar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </h1>
                </v-card>
              </v-hover>
            </v-flex>

            <v-flex pa-3 xs12 md12 sm12 text-xs-center>
              <v-card-text>
                <router-link
                  style="cursor: pointer"
                  tag="span"
                  :to="{ name: 'perfil', params: {username: project.creator}}"
                >
                  <p>
                    <strong>Creado por:</strong>
                    {{project.creator}}
                  </p>
                </router-link>
                <p>
                  <strong>Publicado el:</strong>
                  {{project.created}}
                </p>
                <p>
                  <strong>Categoria:</strong>
                  {{project.category}}
                </p>
                <p v-if="project.finished">
                  <strong>Finalizado</strong>
                </p>
              </v-card-text>
            </v-flex>
            <v-layout row wrap text-xs-center align-center justify-center>
              <v-flex xs12 md10 sm10 text-xs-center>
                <v-hover>
                  <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                    <v-card-text>
                      <h2>Descripción</h2>
                      <p style="text-align: justify;">{{project.description}}</p>
                    </v-card-text>
                  </v-card>
                </v-hover>
                <!-- FINALIZAR PROYECTO -->
                <v-flex xs12 pa-3 mt-4 v-if="isProjectOwner && !project.finished">
                  <v-dialog v-model="dialog2" max-width="600">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" round class="cyan darken-1" large dark>FINALIZAR PROYECTO</v-btn>
                    </template>
                    <v-layout text-xs-center align-center justify-center>
                      <v-card>
                        <v-flex xs12>
                          <v-card-title text-xs-center>
                            <h1>¿Estas seguro que deseas finalizar este proyecto?</h1>
                            <p>Al hacerlo no podra editar, publicar ni recibir mas donaciones</p>
                          </v-card-title>
                        </v-flex>
                        <v-btn dark class="red" @click="close">Cancelar</v-btn>
                        <v-btn dark class="cyan darken-1" @click="endProject">ACEPTAR</v-btn>
                      </v-card>
                    </v-layout>
                  </v-dialog>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
        <!-- DONACIONES DEL PROYECTO-->
        <v-flex xs12 sm5 md4>
          <Donaciones :project="project" :isProjectOwner="isProjectOwner" v-on:refresh="refresh()"/>
        </v-flex>
      </v-layout>
      <!-- CALIFICACION DEL PROYECTO -->
      <Calificaciones :project="project" :isProjectOwner="isProjectOwner" v-on:refresh="refresh()"/>
    </v-card>
  </v-container>
</template>
<script>
import Donaciones from "./Donaciones.vue";
import Calificaciones from "./Calificaciones.vue";
export default {
  data: () => ({
    rating: 3,
    meta: 25000,
    value: "0",
    acum: 50,
    cont: 2,
    editedProject: {
      title: "",
      description: "",
      category: null
    },
    categoryItems: [
      { text: "Arte", value: 0 },
      { text: "Tecnología", value: 1 },
      { text: "Informática", value: 2 },
      { text: "Electrónica", value: 3 },
      { text: "Deportes", value: 4 },
      { text: "Diseño", value: 5 },
      { text: "Negocio", value: 6 },
      { text: "Comunidad", value: 7 },
      { text: "Educación", value: 8 },
      { text: "Videojuegos", value: 9 },
      { text: "Industria", value: 10 },
      { text: "Música", value: 11 },
      { text: "Fotografía", value: 12 },
      { text: "Literatura", value: 13 },
      { text: "Científico", value: 14 },
      { text: "Animales", value: 15 },
      { text: "Naturaleza", value: 16 },
      { text: "Caridad", value: 17 }
    ],
    dialog: false, //EDITAR PROYECTO
    dialog2: false, // FINALIZAR PROYECTO

    // Edit Project rules
    notNullRule: [v => !!v || "Campo requerido"]
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
    // CRUD PROJECT BASIC INFORMATION
    fillProjectData() {
      // this.dialog = true;
      this.editedProject.title = this.project.title;
      this.editedProject.description = this.project.description;
      this.editedProject.category = {
        text: this.project.category,
        value: this.getValue()
      };
    },
    getValue() {
      switch (this.project.category) {
        case "Arte":
          return 0;
          break;
        case "Tecnología":
          return 1;
          break;
        case "Informática":
          return 2;
          break;
        case "Electrónica":
          return 3;
          break;
        case "Deportes":
          return 4;
          break;
        case "Diseño":
          return 5;
          break;
        case "Negocio":
          return 6;
          break;
        case "Comunidad":
          return 7;
          break;
        case "Educación":
          return 8;
          break;
        case "Videojuegos":
          return 9;
          break;
        case "Industria":
          return 10;
          break;
        case "Música":
          return 11;
          break;
        case "Fotografía":
          return 12;
          break;
        case "Literatura":
          return 13;
          break;
        case "Científico":
          return 14;
          break;
        case "Animales":
          return 15;
          break;
        case "Naturaleza":
          return 16;
          break;
        case "Caridad":
          return 17;
          break;
      }
    },
    editProject() {
      const url = `${this.$store.state.host}/projects/${
        this.project.slug_name
      }/`;
      this.$store.commit("loading");

      let data = {
        title: this.editedProject.title,
        description: this.editedProject.description,
        category: this.editedProject.category.value
      };

      axios
        .put(url, data, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.$emit("setProjectData", res.data);
          this.$store.commit("loaded");
          this.close();
          this.$store.commit("openNotification", "Actualizado con exito");
        })
        .catch(err => {
          console.log(err.response.data);
          this.$store.commit("loaded");
          this.$store.commit("openNotification", "Ha ocurrido un error");
        });
    },

    endProject() {
      const url = `${this.$store.state.host}/projects/${
        this.project.slug_name
      }/finish/`;
      this.$store.commit("loading");

      axios
        .put(url, {}, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.$emit("setProjectData", res.data);
          this.$store.commit("loaded");
          this.close();
          this.$store.commit(
            "openNotification",
            "El proyecto se ha finalizado con exito"
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
      this.dialog2 = false;
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    refresh() {
      this.$emit("refresh");
    }
  },

  components: { Donaciones, Calificaciones }
};
</script>
<style scoped>
.contain {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0px;
}
.carta_principal {
  margin: 0;
  padding: 0;
  width: 100%;
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
