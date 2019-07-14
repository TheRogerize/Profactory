<template>
  <v-card>
    <v-card-title style="padding:0px; padding-top: 15px; margin:0px; width:100%;">
      <v-flex xs12 text-xs-center class="cyan darken-1">
        <h1 style="color:white;">RESULTADOS DE BUSQUEDA</h1>
        <v-divider/>
      </v-flex>
      <v-spacer></v-spacer>
      <v-layout style="padding-left:25px;padding-right:25px;" row wrap align-center justify-start>
        <v-flex xs12 md4 text-xs-center>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar"
            single-line
            hide-details
            v-bind="search"
          ></v-text-field>
        </v-flex>
        <v-flex pa-1 xs12 md3 text-xs-center>
          <v-btn class="cyan lighten-1" large round dark @click="resultados()">{{model}}</v-btn>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-divider></v-divider>

    <!-- USUARIOS -->
    <v-container fluid style="width:100%; " v-if="resultado==true && !isFetchingUsers">
      <v-card style="width:100%; padding-bottom:15px;">
        <v-data-iterator
          :items="users"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          :search="search"
          row
          wrap
        >
          <template v-slot:item="props">
            <v-flex xs12 sm12 md12>
              <v-card-title text-xs-center>
                <v-layout row wrap align-center justify-center text-xs-center text-md-center>
                  <v-flex text-xs-center text-sm-center text-md-left md-1>
                    <!-- AVATAR -->
                    <v-avatar v-if="props.item.profile.picture">
                      <img :src="props.item.profile.picture">
                    </v-avatar>
                    <v-avatar v-else>
                      <img src="@/assets/aqualung.png">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs12 sm12 md1>
                    <router-link
                      tag="span"
                      style="cursor: pointer"
                      :to="{name: 'perfil', params: { username: props.item.username}}"
                    >
                      <h1 text-style="color:indigo darken-4">{{ props.item.username }}</h1>
                    </router-link>
                  </v-flex>
                  <v-flex xs12 sm4 md3>
                    <v-label>Seguidores:</v-label>
                    {{ props.item.followers.length }}
                  </v-flex>
                  <v-flex xs12 sm4 md3>
                    <v-label>Seguidos:</v-label>
                    {{ props.item.followeds.length }}
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-label>Reputacion: {{props.item.profile.profile_creator.reputation}}</v-label>
                    <v-rating
                      style="padding-left:15px"
                      color="amber"
                      readonly
                      half-increments
                      v-model="props.item.profile.profile_creator.reputation"
                    ></v-rating>
                  </v-flex>
                </v-layout>
              </v-card-title>

              <v-divider></v-divider>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-card>
    </v-container>

    <!-- PROYECTOS -->
    <v-container
      fluid
      fill-height
      style="width:100%;"
      v-if="resultado==false && !isFetchingProjects"
    >
      <v-card style="width:100%; padding-bottom:15px;">
        <v-data-iterator
          :items="projects"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          :search="search"
          :content-props="{ row: true, wrap: true }"
          row
          wrap
        >
          <template v-slot:item="props">
            <v-flex xs12 sm12 md12 style="width:100%; height:100%;">
              <v-hover>
                <v-card
                  height="100%"
                  :class="`ma-1 text-xs-center pa-3
            project ${props.item.estado} elevation-${hover ? 12 : 2}`"
                  slot-scope="{ hover }"
                >
                  <v-layout row wrap align-center justify-center>
                    <v-flex xs12 sm6 md3>
                      <v-label>Título de Proyecto</v-label>
                      <h1>{{props.item.title}}</h1>
                    </v-flex>
                    <v-flex xs12 sm6 md2>
                      <v-label>Autor</v-label>
                      <router-link
                        tag="span"
                        style="cursor: pointer"
                        :to="{name: 'perfil', params: { username: props.item.creator}}"
                      >
                        <h2>{{props.item.creator}}</h2>
                      </router-link>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-label>Categoría</v-label>
                      <h2>{{props.item.category}}</h2>
                    </v-flex>
                    <v-flex xs12 sm3 md2>
                      <h1>
                        <v-label>Estado:</v-label>
                      </h1>
                      <v-chip
                        small
                        :class="`${props.item.finished} white--text caption my-2`"
                      >{{getText(props.item.finished)}}</v-chip>
                    </v-flex>
                    <v-flex xs12 sm3 md2>
                      <v-btn
                        flat
                        dark
                        class="cyan lighten-1"
                        :to="{ name: 'proyectos', params: {slug_name:props.item.slug_name}}"
                      >VISITAR</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-hover>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-card>
    </v-container>
  </v-card>
</template>
<script>
import Search from "@/components/Search.vue";

export default {
  data: () => ({
    isFetchingUsers: true,
    isFetchingProjects: true,
    search: "",
    model: "USUARIOS",
    resultado: true,
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    },
    //PESTANA USUARIOS
    items: [
      {
        name: "Angy",
        nombre: "Angeline",
        apellido: "Matos",
        seguidos: 24,
        seguidores: 87,
        rating: 3.0
      },
      {
        name: "Roger",
        nombre: "Roy",
        apellido: "Gutierrez",
        seguidos: 37,
        seguidores: 129,
        rating: 2
      },
      {
        name: "Eclair",
        nombre: "Eclaire",
        apellido: "Hernandez",
        seguidos: 23,
        seguidores: 337,
        rating: 3.2
      },
      {
        name: "Carl",
        nombre: "Carlos",
        apellido: "Mendoza",
        seguidos: 67,
        seguidores: 413,
        rating: 4.3
      },
      {
        name: "Dig",
        nombre: "Diego",
        apellido: "Parente",
        seguidos: 49,
        seguidores: 327,
        rating: 3.9
      },
      {
        name: "heberts",
        nombre: "Hebert",
        apellido: "Ferrer",
        rating: 0.0,
        seguidos: 94,
        seguidores: 50
      },
      {
        name: "Juan",
        nombre: "Juan",
        apellido: "Rios",
        seguidos: 98,
        seguidores: 38,
        rating: 0
      },
      {
        name: "Dieg",
        nombre: "Diego",
        apellido: "Perez",
        seguidos: 87,
        rating: 2.5,
        seguidores: 562
      },
      {
        name: "Asdrubal",
        nombre: "Asdrubal",
        apellido: "Pacheco",
        seguidos: 51,
        seguidores: 326,
        rating: 4.9
      },
      {
        name: "Ana",
        nombre: "Ana",
        apellido: "Gutierrez",
        seguidos: 65,
        seguidores: 54,
        rating: 1.4
      }
    ],
    // PESTANA PROYECTOS
    projects: [
      {
        title: "Programacion web",
        autor: "Roger",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      {
        title: "Nuevo Software",
        autor: "Hebert",
        categoria: "Informatica",
        estado: "Pendiente"
      },
      {
        title: "Diseño e ilustraciones.",
        autor: "Ana",
        categoria: "Diseño",
        estado: "Pendiente"
      },
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      ,
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      },
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Tecnologia",
        estado: "Finalizado"
      },
      {
        title: "Aplicacion movil",
        autor: "Ange",
        categoria: "Informatica",
        estado: "Finalizado"
      }
    ]
  }),

  asyncComputed: {
    users() {
      const url = `${this.$store.state.host}/users/`;

      this.$store.commit("loading");

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.$store.commit("loaded");
          return res.data;
        })
        .catch(err => {
          this.$store.commit("loaded");
          this.$store.commit("openNotification", "Ha ocurrido un error");
          console.log(err.response.data);
        });
    },

    projects() {
      const url = `${this.$store.state.host}/projects/`;

      this.$store.commit("loading");

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.$store.commit("loaded");
          return res.data;
        })
        .catch(err => {
          this.$store.commit("loaded");
          this.$store.commit("openNotification", "Ha ocurrido un error");
          console.log(err.response.data);
        });
    }
  },

  watch: {
    users(value) {
      if (value !== null) this.isFetchingUsers = false;
    },
    projects(value) {
      if (value !== null) this.isFetchingProjects = false;
    }
  },

  methods: {
    resultados() {
      if (this.resultado == true) {
        this.resultado = false;
        this.model = "PROYECTOS";
      } else {
        this.resultado = true;
        this.model = "USUARIOS";
      }
    },
    getText: value => (value ? "Finalizado" : "Pendiente")
  },
  components: { Search }
};
</script>
<style scoped>
h1 {
  font-size: 30px;
  font-family: "Quicksand", sans-serif;
}
h2 {
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
}
.project.false {
  border-left: 4px solid #ffaa2c;
}
.project.true {
  border-left: 4px solid #3cd1c2;
}
.v-chip.false {
  background: #ffaa2c;
}
.v-chip.true {
  background: #3cd1c2;
}
.tabs {
  height: 100vh;
  width: 100%;
}
</style>

