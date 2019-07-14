<template>
  <v-container class="perfiles" fluid>
    <v-tabs centered grow color="cyan darken-1" dark v-model="model" class="contain">
      <v-tab :href="`#tab-${1}`">
        <h1>PROYECTOS</h1>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <!-- PERFIL MANAGER -->
      <v-tab-item
        transition="fade-transition"
        reverse-transition="fade-transition"
        :value="`tab-${1}`"
      >
        <v-container text-xs-center fluid class="contain">
          <v-flex xs12>
            <!-- PROYECTOS -->
            <v-container class="contain" fluid>
              <v-card color="transparent" flat v-if="isAccountOwner">
                <v-layout row class="contain">
                  <v-flex xs12 md4 class="pa-3">
                    <v-btn color="cyan lighten-2" dark to="/crear_proyecto">
                      <h2>CREAR UN NUEVO PROYECTO</h2>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-card
                class="proyectos"
                flat
                v-for="project in profileData.profile.profile_creator.projects"
                :key="project.slug_name"
              >
                <v-layout row wrap class="pa-4 project" :class="[finished(project.finished)]">
                  <v-flex xs12 md4>
                    <div class="caption grey--text">
                      <h3>Titulo del Proyecto</h3>
                    </div>
                    <div>
                      <h2>{{project.title}}</h2>
                    </div>
                  </v-flex>
                  <v-flex xs12 md3>
                    <!-- REDIRECCION A PERFIL DEL PROYECTO, habria que llamar a
                    la ruta del perfil del proyecto-->
                    <v-btn
                      round
                      color="light-blue lighten-1"
                      dark
                      :to="{name: 'proyectos', params: {slug_name: project.slug_name}}"
                    >
                      <h2>VER PROYECTO</h2>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 md3>
                    <div class="caption grey--text">
                      <h3>Fecha de Publicacion</h3>
                    </div>
                    <div>{{project.created}}</div>
                  </v-flex>
                  <v-flex xs12 sm4 md2>
                    <div class="caption grey--text">
                      <h3>Estado</h3>
                    </div>
                    <div>
                      <v-chip
                        small
                        class="white--text caption my-2"
                        :class="[finished(project.finished)]"
                      >{{getStatus(project.finished)}}</v-chip>
                    </div>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
              </v-card>
            </v-container>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs12>
              <h1>Reputacion como Manager de Proyectos</h1>
              <v-rating readonly v-model="profileData.profile.profile_creator.reputation"></v-rating>
              <p>{{profileData.profile.profile_creator.reputation}}/5</p>
              <v-divider></v-divider>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <!-- PERFIL TRABAJADOR -->
      <v-tab-item
        transition="fade-transition"
        reverse-transition="fade-transition"
        :value="`tab-${2}`"
      ></v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      model: "tab-1",
      ratingManager: 3,
      ratingTrabajador: 2,
      projects: [
        {
          title: "Desarrollar un Sitio Web",
          date: "13/05/2019",
          status: "Pendiente",
          content: "asd asd asd asd dgad,wlasdmodwmsamldwamo",
          link: "/"
        },
        {
          title: "Programar un videojuego",
          date: "23/02/2019",
          status: "Finalizado",
          content: "asd asd asd asd dgad,wlasdmodwmsamldwamo",
          link: "/"
        },
        {
          title: "Crear Aplicacion movil",
          date: "02/05/2019",
          status: "Pendiente",
          content: "asd asd asd asd dgad,wlasdmodwmsamldwamo",
          link: "/"
        },
        {
          title: "Crear Aplicacion movil2",
          date: "29/05/2019",
          status: "Finalizado",
          content: "asd asd asd asd dgad,wlasdmodwmsamldwamo",
          link: "/"
        }
      ]
    };
  },

  methods: {
    finished(value) {
      if (value) return "Finalizado";
      return "Pendiente";
    },
    getStatus: (value) => value ? "Finalizado" : "Pendiente"
  },

  props: {
    profileData: {
      type: Object,
      required: true
    },
    isAccountOwner: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap");
.contain {
  width: 100%;
  margin: 0;
  padding: 0;
}
.perfiles {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

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
p {
  font-size: 20px;
  font-family: "Quicksand", sans-serif;
}
.project.Pendiente {
  border-left: 4px solid #ffaa2c;
}
.project.Finalizado {
  border-left: 4px solid #3cd1c2;
}
.v-chip.Pendiente {
  background: #ffaa2c;
}
.v-chip.Finalizado {
  background: #3cd1c2;
}
</style>
