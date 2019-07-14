<template>
  <v-container class="crear">
    <v-card width="100%" style="max-width:1000px;" height="100%">
      <v-card-text class="cyan lighten-2">
        <h1 style="text-align:center; color:white;">CREAR UN NUEVO PROYECTO</h1>
      </v-card-text>
      <v-divider/>
      <v-divider/>
      <v-container class="form">
        <v-form ref="form">
          <v-layout row wrap text-xs-center align-center justify-center>
            <v-flex wrap pa-4 xs12 sm12 md12 style="max-width:500px">
              <v-text-field
                v-model="project.title"
                label="Ingresa tu titulo para el proyecto"
                :rules="notNullRule"
                :counter="50"
                maxlength="50"
                required
              ></v-text-field>
            </v-flex>

            <v-flex class="descripcion" pa-4 xs12 text-xs-center align-center justify-center>
              <v-textarea
                label="Descripción de Proyecto"
                :rules="notNullRule"
                v-model="project.description"
              ></v-textarea>
            </v-flex>
            <v-flex pa-4 xs12 sm12 md6 wrap align-center justify-center text-xs-center>
              <v-select
                label="Selecciona una categoria"
                v-model="project.category"
                :items="categoryItems"
                item-value="value"
                item-text="text"
                return-object
                :rules="notNullRule"
                required
              ></v-select>
            </v-flex>

            <v-flex pa-4 xs12 md6 align-center justify-center text-xs-center>
              <v-text-field
                required
                v-model="project.slug_name"
                label="Nombre Único"
                :counter="8"
                maxlength="8"
                :rules="slugRules"
              ></v-text-field>
            </v-flex>
            <v-flex pa-4 xs12 md6 align-center justify-center text-xs-center>
              <Money
                v-on:complete="complete = true"
                v-on:uncomplete="complete = false"
              />
            </v-flex>
          </v-layout>
          <v-layout text-xs-center>
            <v-flex pa-4 xs12>
              <v-btn large class="cyan lighten-2" dark @click="createProject">
                <h2>CREAR PROYECTO</h2>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Money from "@/components/Money.vue";

export default {
  data: () => ({

    complete: true,

    project: {
      title: "",
      description: "",
      category: null,
      slug_name: "",
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

    // Rules
    notNullRule: [v => !!v || "Campo requerido"],
    slugRules: [
      v => !!v || "Campo requerido",
      v => /^([a-zA-Z0-9-_]+)$/g.test(v) || "Caracteres no permitidos"
    ]
  }),

  components: { Money },

  methods: {
    createProject() {
      if (this.$refs.form.validate() && this.complete) {
        const url = `${this.$store.state.host}/projects/`;
        this.$store.commit("loading");

        let data = {
          title: this.project.title,
          description: this.project.description,
          category: this.project.category.value,
          slug_name: this.project.slug_name,
          cost: this.$store.state.amount
        };

        axios
          .post(url, data, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.$store.commit("loaded");
            this.$store.dispatch('updateUser');
            this.$router.push(`/proyectos/${res.data.slug_name}`);
          })
          .catch(err => {
            if (err.response.data) {
              this.$store.commit(
                "openNotification",
                "El nombre unico ya esta siendo usado"
              );
            }
            console.log(err.response.data);
            this.$store.commit("loaded");
          });
      }
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
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap");

.publicacion {
  background: #0097a7;
  border-radius: 10px;
  width: 100%;
}
.descripcion {
  max-width: 500px;
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
  font-size: 35px;
}
h2 {
  font-family: "Quicksand", sans-serif;
  font-size: 20px;
}
h3 {
  font-family: "Quicksand", sans-serif;
  font-size: 16px;
}
</style>
