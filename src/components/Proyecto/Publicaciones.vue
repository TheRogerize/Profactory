<template>
  <v-layout row wrap text-xs-center align-center justify-center>
    <v-flex pa-3 class="cyan darken-2" mt-5 mb-5 xs12 md12 sm12 text-xs-center text-md-center>
      <h1 style="color:white;">PUBLICACIONES</h1>
    </v-flex>
    <v-flex xs12 sm12 md7>
      <v-container
        class="contain"
        style=" max-width:700px; padding:15px; margin-bottom:30px; height:100%"
      >
        <timeline
          :timeline="project.publications"
          :projectItems="projectItems"
          :isProjectOwner="isProjectOwner"
          :projectFinished="project.finished"
        />
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import timeline from "@/components/timeline.vue";
import { mapState } from "vuex";

export default {
  data: () => ({
    title: "Insertar una",
    imageName: "",
    imageUrl: "",
    imageFile: "",
    //Esto es un aviso de error, no le pares xD
    snackbar: false,
    snackbar2: false,
    textSnack: "Debes ingresar una descripcion para poder publicar!",
    textSnack2: "Debes seleccionar uno de tus proyectos para poder publicar!",
    timeout: 6000,
    //Ya, ahora si XD
    events: [],
    nonce: 0,
    avatar: null,
    icon: "favorite_outline",
    imageData: "",
    likes: 0,

    //PUBLICAR
    valid: true,
    descripcion: "",
    items: ["Elaboracion de Sitio Web", "Construccion de viviendas"],
    descripcionRules: [v => !!v || snackbar],
    projectRules: [v => !!v || snackbar2]
  }),

  components: { timeline },

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

  computed: {
    ...mapState(["user"]),
    projectItems() {
      return [{ text: this.project.title, value: this.project.slug_name }];
    }
  },

  methods: {
    //FUNCION SUBMIT PARA PUBLICAR
    postear() {
      if (this.descripcion == "") {
        this.snackbar = true;
      }
      if (this.project == "") {
        this.snackbar2 = true;
      }
      if (this.$refs.form.validate()) {
        //TEST
        const time = new Date().toTimeString();
        this.events.push({
          id: this.nonce++,
          text: this.descripcion,
          time: time.replace(
            /:\d{2}\sGMT-\d{4}\s\((.*)\)/,
            (match, contents, offset) => {
              return ` ${contents
                .split(" ")
                .map(v => v.charAt(0))
                .join("")}`;
            }
          )
        });
        this.descripcion = "";
        this.project = "";
        this.imageUrl = "";
      }
    },
    like() {
      if (this.icon == "favorite_outline") {
        this.icon = "favorite";
        this.likes++;
      } else if (this.icon == "favorite") {
        this.icon = "favorite_outline";
        this.likes--;
      }
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
    }
  }
  /* eslint-disable */
};

/* eslint-disable */
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap");

.publicacion {
  background: #0097a7;
  border-radius: 10px;
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
  font-size: 30px;
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
