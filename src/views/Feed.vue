<template>
  <div class="app">
    <v-container fluid fill-height class="contain">
      <v-layout row wrap>
        <v-flex md7 sm12 xs12>
          <timeline :timeline="timeline" :projectItems="projectItems" v-on:refresh="refresh()"/>
        </v-flex>

        <!-- INFORMACION DE USUARIO -->
        <v-flex md5>
          <v-container grid-list-xl>
            <aside class="hidden-sm-and-down">
              <v-layout class="login">
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    class="mx-auto"
                    flat
                    color="transparent"
                  >
                    <v-card-title>
                      <v-layout row>
                        <v-flex grow pa-1>
                          <span class="headline">
                            <v-card-text class="text-md-center">
                              <v-avatar size="150px" v-if="!user.profile.picture">
                                <img src="@/assets/aqualung.png" alt="avatar">
                              </v-avatar>
                              <v-avatar size="150px" v-else>
                                <img class="cyan lighten-3 mb-3" :src="user.profile.picture">
                              </v-avatar>
                              <h1>{{user.username}}</h1>
                            </v-card-text>
                          </span>
                          <v-card-actions class="justify-center">
                            <v-btn
                              class="hidden-sm-and-down"
                              color="cyan darken-1"
                              dark
                              round
                              :to="{ name: 'perfil', params: {username:user.username}}"
                            >
                              <v-icon>person</v-icon>
                              <h2>Mi Perfil</h2>
                            </v-btn>
                          </v-card-actions>
                        </v-flex>
                      </v-layout>
                    </v-card-title>
                    <v-card-actions class="justify-center">
                      <v-btn
                        class="hidden-sm-and-down"
                        color="cyan lighten-2"
                        dark
                        to="/crear_proyecto"
                      >
                        <v-icon>create_new_folder</v-icon>
                        <h2>CREAR UN NUEVO PROYECTO</h2>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-layout>
            </aside>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import { scrypt } from "crypto";
import imageInput from "@/components/ImageInput.vue";
import timeline from "@/components/timeline.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "Insertar una",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      //Esto es un aviso de error, no le pares xD
      // snackbar: false,
      // snackbar2: false,
      // textSnack: "Debes ingresar una descripcion para poder publicar!",
      // textSnack2: "Debes seleccionar uno de tus proyectos para poder publicar!",
      timeout: 6000,
      //Ya, ahora si XD
      events: [],
      nonce: 0,
      avatar: null,
      icon: "favorite_outline",
      imageData: "",

      //PUBLICAR
      valid: true,
      publication: {
        description: "",
        project: ""
      },
      publicationEdit: {
        index: null,
        id: null,
        description: ""
      },
      descripcionRules: [v => !!v || "Campo requerido"],
      projectRules: [v => !!v || "Campo requerido"]
    };
  },

  components: { imageInput, timeline },

  computed: {
    ...mapState(["user"]),
    projectItems() {
      let projects = [];
      for (let project of this.user.profile.profile_creator.projects) {
        if(!project.finished) {
          projects.push({ text: project.title, value: project.slug_name });
        }
      }
      return projects;
    }
  },

  asyncComputed: {
    timeline: {
      get() {
        const url = `${this.$store.state.host}/publications/`;
        return axios
          .get(url, { headers: this.$store.getters.authHeaders })
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    }
  },

  methods: {
    consola(item) {
      console.log(item);
    },
    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }

        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    refresh() {
      // Triggers an immediate update of blogPosts
      // Will work even if an update is in progress.
      this.$asyncComputed.timeline.update();
    }
  }
  /* eslint-disable */
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap");

.publicacion {
  border-radius: 10px;
  background: #0097a7;
  width: 100%;
}
.comentarios {
  background: #0097a7;
  margin: 0px;
  padding: 0px;
  width: 100%;
}
.contain {
  width: 100%;
}
.caja {
  border-radius: 50%;
}
.login {
  background: transparent;
  border-left-color: #4dd0e1;
  border-left-style: solid;
  border-left-width: 2px;
}
aside {
  height: 100vh;
}
.textocentral {
  text-align: center;
}
.textoleft {
  border-bottom-color: #4dd0e1;
  border-bottom-style: solid;
  border-bottom-width: 2px;
}
.autor {
  border-radius: 10px;
  background: white;
}
p {
  font-family: "Quicksand", sans-serif;
  color: black;
  font-size: 14px;
}
h1 {
  font-family: "Quicksand", sans-serif;
  font-size: 25px;
}
h2 {
  font-family: "Quicksand", sans-serif;
  font-size: 20px;
}
h3 {
  font-family: "Quicksand", sans-serif;
  font-size: 16px;
}
.button {
  width: 100%;
  padding: 0;
  margin: 0;
}

.bordes {
  border-radius: 100px;
}

.d-flex {
  height: 100%;
}
</style>


