<template>
  <v-container class="contain" style="max-width: 650px; height:100%">
    <v-timeline dense clipped>
      <v-timeline-item
        fill-dot
        class="white--text mb-5"
        color="green accent-1"
        large
        v-if="isProjectOwner && !projectFinished"
      >
        <template v-slot:icon>
          <span></span>
        </template>
        <v-container class="publicacion">
          <v-form ref="public_form" v-model="valid">
            <v-layout row wrap>
              <v-layout row wrap align-start text-xs-left class="white" style="border-radius:10px">
                <!-- Seleccionar proyecto -->
                <v-flex xs12 mb-4>
                  <v-select
                    label="Selecciona un proyecto"
                    v-model="publication.project"
                    :items="projectItems"
                    no-data-text="No tienes proyectos"
                    item-text="text"
                    item-value="value"
                    return-object
                    required
                    :rules="projectRules"
                    class="descripcion"
                  ></v-select>
                </v-flex>
                <!-- Descripcion -->
                <v-flex mb-5 xs12 md12 sm12>
                  <v-textarea
                    v-model="publication.description"
                    label="Cuentanos sobre tu proyecto"
                    required
                    no-resize
                    :rules="descripcionRules"
                    @keydown.enter="createPublication"
                    class="descripcion"
                  ></v-textarea>
                </v-flex>
                <!-- Imagen -->
                <image-input v-on:input="onFilePicked" class="my-3">
                  <div slot="activator">
                    <v-flex mt-5 xs12 sm12 md12 text-xs-left>
                      <v-text-field
                        text-xs-left
                        class="descripcion"
                        label="Adjuntar imagen"
                        v-model="imageName"
                        prepend-icon="attach_file"
                      ></v-text-field>
                    </v-flex>
                  </div>
                </image-input>
                <v-flex text-xs-center xs12 sm12 md12>
                  <img
                    class="cyan darken-1"
                    :src="imageUrl"
                    width="150"
                    height="150"
                    v-if="imageUrl"
                  >
                </v-flex>

                <v-flex xs12 md12 sm12 text-xs-right>
                  <v-btn small dark round @click="createPublication()" class="cyan lighten-2">
                    <h2>PUBLICAR</h2>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-form>
        </v-container>
      </v-timeline-item>

      <v-slide-x-transition group v-if="timeline && timeline.length > 0">
        <v-timeline-item
          v-for="(publication, index) in timeline"
          :key="publication.id"
          class="mb-3"
          color="green accent-3"
          small
        >
          <v-hover>
            <v-card
              color="cyan darken-2"
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 12 : 2}`"
              flat
              class="cyan darken-2"
              style="border-radius:10px"
            >
              <v-container fluid grid-list-md class="publicacion">
                <!--CONTENEDOR AUTOR DE PUBLICACION Y MENSAJE-->
                <v-container style="padding:0; margin:0;">
                  <!--AVATAR DE PUBLICACION-->
                  <v-layout row wrap align-start text-xs-left class="autor">
                    <v-flex xs12 sm2 md2 dark text-xs-center>
                      <v-avatar size="64px" v-if="!publication.user.profile.picture">
                        <img src="@/assets/aqualung.png" alt="avatar">
                      </v-avatar>
                      <v-avatar size="64px" v-else class="mb-3">
                        <img
                          :src="$store.state.host+publication.user.profile.picture"
                          alt="avatar"
                        >
                      </v-avatar>
                    </v-flex>
                    <!--AUTOR DE PUBLICACION-->
                    <v-flex text-xs-left xs12 sm10 md8>
                      <v-card-text>
                        <router-link
                          v-if="publication.user"
                          tag="span"
                          style="cursor: pointer"
                          :to="{name: 'perfil', params: {username: publication.user.username}}"
                        >
                          <h2>-{{publication.user.username}}</h2>
                        </router-link>
                        <h2 v-else>-El usuario ya no existe</h2>
                      </v-card-text>
                    </v-flex>
                    <!-- EDITAR -->
                    <v-flex
                      align-content-end
                      xs2
                      v-if="isPublicationOwner(publication) && !publication.project.finished"
                    >
                      <v-card-text>
                        <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                          <v-icon @click="openDialog(publication, index)">edit</v-icon>
                        </v-btn>
                      </v-card-text>
                    </v-flex>
                    <!--PROYECTO DE PUBLICACION-->
                    <v-layout align-center justify-center>
                      <v-flex align-center justify-center text-xs-center xs12 sm12 md12>
                        <router-link
                          v-if="publication.user"
                          tag="span"
                          style="cursor: pointer;"
                          :to="{name: 'proyectos', params: {slug_name: publication.project.slug_name}}"
                        >
                          <v-label>{{publication.project.title}}</v-label>
                        </router-link>
                      </v-flex>
                    </v-layout>
                    <!--MENSAJE DE PUBLICACION-->
                    <v-card-text>
                      <v-flex xs12 v-text="publication.description"></v-flex>
                    </v-card-text>
                    <v-flex text-xs-center align-center justify-center xs12 v-if="publication.picture">
                      <!-- SE ESCONDE EN PANTALLAS XS -->
                      <img class="hidden-xs-only" style="width:400px;" :src="publication.picture">
                      <!-- SE ESCONDE EN PANTALLAS SM A MAS GRANDES -->
                      <img class="hidden-sm-and-up" style="width:170px;" :src="publication.picture">
                    </v-flex>
                    <v-layout align-end justify-end>
                      <p>Me gusta: {{publication.likes}}</p>
                      <v-btn fab flat @click="like(publication)">
                        <v-icon>{{liked(publication.liked)}}</v-icon>
                      </v-btn>
                    </v-layout>
                    <v-flex xs12 text-xs-right v-text="publication.created"></v-flex>
                  </v-layout>
                </v-container>
              </v-container>
              <v-divider></v-divider>
              <v-container fluid class="comentarios">
                <v-flex xs12 text-xs-center>
                  <v-card-text class="white--text">
                    <h1>COMENTARIOS</h1>
                  </v-card-text>
                </v-flex>
              </v-container>

              <v-divider></v-divider>
              <Comentarios :comments="publication.comments" :id="publication.id"/>
            </v-card>
          </v-hover>
        </v-timeline-item>
      </v-slide-x-transition>
      <v-container v-else>Empieza a seguir personas para ver publicaiones!</v-container>
    </v-timeline>

    <!-- EDITAR PUBLICACION -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h1>Modificar publicacion</h1>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="form">
              <v-layout wrap>
                <!-- Descripcion -->
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model="publicationEdit.description" label="Descripcion" box light></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="red darken-1" flat @click="deletePublication">Eliminar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click="editPublication">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Comentarios from "@/components/Comentarios.vue";
import imageInput from "@/components/ImageInput.vue";

export default {
  data() {
    return {
      dialog: false,
      title: "Insertar una",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      fd: new FormData(),
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
      likes: 0,

      //PUBLICAR
      valid: false,
      publication: {
        description: "",
        project: ""
      },
      publicationEdit: {
        index: null,
        project: "",
        id: null,
        description: ""
      },
      descripcionRules: [v => !!v || "Campo requerido"],
      projectRules: [v => !!v || "Campo requerido"]
    };
  },

  components: { Comentarios, imageInput },

  computed: {
    ...mapState(["user"])
  },

  methods: {
    consola(item) {
      console.log(item);
    },
    //CRUD PUBLICATION
    createPublication() {
      if (this.$refs.public_form.validate()) {
        //TEST
        const url = `${this.$store.state.host}/projects/${
          this.publication.project.value
        }/publications/`;

        this.fd.append("description", this.publication.description);

        // Primera request para agregar datos JSON
        axios
          .post(url, this.fd, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.$refs.public_form.reset();
            this.imageUrl = "";
            this.imageName = "";
            this.$store.commit(
              "openNotification",
              "Publicacion creada con exito"
            );
            this.timeline.unshift(res.data);
            // // Segunda request para agregar la imagen
            // axios.post(url, this.fd, { headers: this.$store.getters.authHeaders })
            // .then(res => {
            // })
            // .catch(err => {
            //   console.log(err.response.data);
            // });
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    editPublication() {
      const url = `${this.$store.state.host}/projects/${
        this.publicationEdit.project
      }/publications/${this.publicationEdit.id}/`;

      let data = {
        description: this.publicationEdit.description
      };

      axios
        .put(url, data, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.timeline[this.publicationEdit.index].description =
            res.data.description;
          this.closeDialog();
          this.$store.commit("openNotification", "Actualizado con exito");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    deletePublication() {
      const url = `${this.$store.state.host}/projects/${
        this.publicationEdit.project
      }/publications/${this.publicationEdit.id}/`;

      axios
        .delete(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.timeline.splice(this.publicationEdit.index, 1);
          this.closeDialog();
          this.$store.commit("openNotification", "Eliminada con exito");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },

    like(publication) {
      if (!publication.liked) {
        const url = `${this.$store.state.host}/publications/${
          publication.id
        }/likes/`;
        axios
          .post(url, {}, { headers: this.$store.getters.authHeaders })
          .then(res => {
            publication.likes++;
            publication.liked = true;
          })
          .catch(err => {
            console.log(err.response.data);
          });
      } else {
        const url = `${this.$store.state.host}/publications/${
          publication.id
        }/likes/dislike/`;
        axios
          .delete(url, { headers: this.$store.getters.authHeaders })
          .then(res => {
            publication.likes--;
            publication.liked = false;
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    isPublicationOwner(publication) {
      return publication.user.username === this.user.username;
    },
    openDialog(publication, index) {
      this.publicationEdit.index = index;
      this.publicationEdit.project = publication.project.slug_name
        ? publication.project.slug_name
        : this.$route.params.slug_name;
      this.publicationEdit.id = publication.id;
      this.publicationEdit.description = publication.description;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(formData, imageFile) {
      // const files = e.target.files;
      // if (files[0] !== undefined) {
      this.imageName = imageFile.name;
      //   if (this.imageName.lastIndexOf(".") <= 0) {
      //     return;
      //   }

      const fr = new FileReader();
      fr.readAsDataURL(imageFile);
      fr.addEventListener("load", () => {
        this.imageUrl = fr.result;
        this.fd = formData;
      });
      // } else {
      //   this.imageName = "";
      //   this.imageFile = "";
      //   this.imageUrl = "";
      // }
    },
    liked(already_liked) {
      if (already_liked) return "favorite";
      return "favorite_outline";
    }
  },

  props: {
    timeline: {
      type: Array
    },
    projectItems: {
      required: true,
      type: Array
    },
    isProjectOwner: {
      required: false,
      default: true
    },
    projectFinished: {
      required: false,
      default: false
    }
  }
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
  padding: 5px;
  margin-right: 0;
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
.img {
  max-width: 200px;
  max-height: 300px;
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

.descripcion {
  height: 40px;
}
</style>
