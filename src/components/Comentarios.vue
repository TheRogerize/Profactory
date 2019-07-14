<template>
  <v-container class="timeline" style="max-width: 500px;">
    <v-container class="publicacion">
      <v-form
        ref="comment_form"
        v-model="valid"
        lazy-validation
        class="white mb-3 pa-3"
        style="border-radius:10px"
      >
        <v-layout row wrap>
          <v-flex xs12 md8 sm9>
            <v-text-field
              v-model="mensaje"
              label="Deja tu comentario"
              required
              :rules="comentarioRules"
              outline
              @keydown.enter="createComent"
            ></v-text-field>
          </v-flex>

          <!-- <v-layout align-start justify-start> -->
          <v-flex mb-5 xs12 md3 sm2 text-xs-right>
            <v-btn small dark round @click="createComment" ref="form" class="cyan lighten-2">
              <h2>COMENTAR</h2>
            </v-btn>
          </v-flex>
          <!-- </v-layout> -->
        </v-layout>
      </v-form>
    </v-container>

    <!-- <v-slide-x-transition group> -->
    <v-flex color="green accent-3" small v-if="comments.length > 0">
      <!--PANEL DE TODOS LOS COMENTARIOS-->
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content>
          <template v-slot:header>
            <h2 class="grey--text text-xs-center">Comentarios</h2>
          </template>

          <v-flex xs12 v-for="(comment, index) in comments" :key="index">
            <v-card class="white">
              <v-container fluid grid-list-md class="publicacion">
                <!--CONTENEDOR AUTOR DE PUBLICACION Y MENSAJE-->
                <v-container style="padding:0; margin:0;">
                  <!--AVATAR DE PUBLICACION-->
                  <v-layout row wrap align-start text-xs-left class="autor">
                    <v-flex xs12 sm2 md2 dark text-xs-center>
                      <!-- <image-input v-model="avatar"> -->
                      <v-avatar size="54px" v-if="!comment.user.profile.picture">
                        <img src="@/assets/aqualung.png" alt="avatar">
                      </v-avatar>
                      <v-avatar size="54px" v-else class="mb-3">
                        <img :src="$store.state.host+comment.user.profile.picture" alt="avatar">
                      </v-avatar>
                      <!-- </image-input> -->
                    </v-flex>
                    <!--AUTOR DE PUBLICACION-->
                    <v-flex text-xs-left xs12 sm10 md10>
                      <v-card-text>
                        <router-link
                          tag="span"
                          style="cursor: pointer;"
                          :to="{name: 'perfil', params: {username: comment.user.username}}"
                        >
                          <h2>-{{comment.user.username}}</h2>
                        </router-link>
                      </v-card-text>
                    </v-flex>
                    <v-flex align-content-end sm2 v-if="isCommentOwner(comment)">
                      <v-card-text>
                        <v-btn slot="activator" class="v-btn--simple" color="success" icon>
                          <v-icon @click="openDialog(comment, index)">edit</v-icon>
                        </v-btn>
                      </v-card-text>
                    </v-flex>
                    <v-divider></v-divider>
                    <!--PROYECTO DE PUBLICACION-->
                    <!-- <v-layout align-center justify-center>
                        <v-flex align-center justify-center text-xs-center xs12 sm12 md12>
                          <v-label>Un proyecto 1</v-label>
                        </v-flex>
                    </v-layout>-->
                    <!--MENSAJE DE PUBLICACION-->
                    <v-card-text>
                      <v-flex xs12 v-text="comment.comment"></v-flex>
                    </v-card-text>
                    <!-- <v-layout align-end justify-end>
                        <p>Likes: {{likes}}</p>
                        <v-btn fab flat @click="like">
                          <v-icon>{{icon}}</v-icon>
                        </v-btn>
                    </v-layout>-->
                  </v-layout>
                </v-container>
              </v-container>

              <v-layout align end justify-end>
                <v-flex xs5 text-xs-right v-text="comment.created"></v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
    <!-- </v-slide-x-transition> -->

    <!-- EDITAR COMENTARIO -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h1>Modificar comentario</h1>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="form">
              <v-layout wrap>
                <!-- Descripcion -->
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model="commentEdit.description" label="Comentario" box light></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="red darken-1" flat @click="deleteComment">Eliminar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click="editComment">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    valid: false,
    // snackbar: false,
    textSnack: "Debes ingresar un comentario primero!",
    timeout: 6000,
    comentarios1: [],
    mensaje: "",
    icon: "favorite_outline",
    likes: 0,
    nonce: 0,
    avatar: null,
    mostrar: true,
    panel: [false],

    commentEdit: {
      index: null,
      id: null,
      description: ""
    },

    // mostrar: false,
    botonMostrar: "MOSTRAR COMENTARIOS",
    comentarioRules: [v => !!v || "Campo requerido"]
  }),

  computed: {
    comentarios() {
      return this.comentarios1.slice().reverse();
    }
  },

  methods: {
    //FUNCION SUBMIT PARA COMENTAR
    createComment() {
      if (this.$refs.comment_form.validate()) {
        const url = `${this.$store.state.host}/publications/${
          this.id
        }/comments/`;

        let data = { comment: this.mensaje };
        axios
          .post(url, data, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.comments.unshift(res.data);
            this.$refs.comment_form.reset();
            this.panel[0] = true;
            this.$store.commit("openNotification", "Comentario enviado");
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    editComment() {
      const url = `${this.$store.state.host}/publications/${this.id}/comments/${
        this.commentEdit.id
      }/`;

      let data = { comment: this.commentEdit.description };
      axios
        .put(url, data, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.comments[this.commentEdit.index].comment = res.data.comment;
          this.closeDialog();
          this.$store.commit("openNotification", "Actualizado con exito");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    deleteComment() {
      const url = `${this.$store.state.host}/publications/${this.id}/comments/${
        this.commentEdit.id
      }/`;

      axios
        .delete(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.comments.splice(this.commentEdit.index, 1);
          this.closeDialog();
          this.$store.commit("openNotification", "Eliminado con exito");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },

    openDialog(comment, index) {
      this.commentEdit.index = index;
      this.commentEdit.id = comment.id;
      this.commentEdit.description = comment.comment;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },

    isCommentOwner(comment) {
      return comment.user.username === this.$store.state.user.username;
    },

    mostrarboton() {
      if (this.mostrar == false) {
        this.mostrar = true;
        this.panel = [...Array(this.comentarios).keys()].map(_ => true);
        this.botonMostrar = "OCULTAR";
      } else {
        this.mostrar = false;
        this.panel = [];
        this.botonMostrar = "MOSTRAR COMENTARIOS";
      }
    },
    // Reset the panel
    like() {
      if (this.icon == "favorite_outline") {
        this.icon = "favorite";
        this.likes++;
      } else if (this.icon == "favorite") {
        this.icon = "favorite_outline";
        this.likes--;
      }
    }
  },

  props: {
    comments: {
      required: true,
      type: Array
    },
    id: {
      required: true,
      type: Number
    }
  }
};
</script>
<style scoped>
.publicacion {
  padding: 0;
  margin: 0;
  width: 100%;
}
</style>
