<template>
  <nav class="cyan darken-1">
    <v-navigation-drawer dark absolute class="hidden-md-and-up" v-model="sideNav">
      <v-toolbar class="cyan darken-1">
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              <h2>{{appName}}</h2>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <!-- Menu 1 con el home, login y registro -->
      <v-list v-if="!isAuthenticated">
        <v-list-tile @click.stop="showLoginForm=true, sideNav=false">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            <h2>Iniciar Sesion</h2>
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="showRegistrarForm=true, sideNav=false">
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            <h2>Regístrate</h2>
          </v-list-tile-title>
        </v-list-tile>

        <!-- <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-badge color="red" v-if="item.badge">
            <span slot="badge">{{ item.badge }}</span>
            <span>{{ item.title }}</span>
          </v-badge>
          <v-list-tile-content v-else>{{ item.title }}</v-list-tile-content>
        </v-list-tile>-->
      </v-list>
      <!-- Menu 2 con el feed, perfil y cerrar sesion -->
      <v-list v-if="isAuthenticated">
        <v-list-tile v-for="item in menuItems2" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-badge color="red" v-if="item.badge">
            <span slot="badge">{{ item.badge }}</span>
            <span>{{ item.title }}</span>
          </v-badge>
          <v-list-tile-content v-else>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <!-- Perfil -->
        <v-list-tile :to="{ name: 'perfil', params: {username : this.username} }">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Mi pefil</v-list-tile-content>
        </v-list-tile>
        <!-- Cerrar sesion -->
        <v-list-tile @click="cerrarSesion()">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Cerrar Sesión</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan darken-1" dark>
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-md-and-up"></v-toolbar-side-icon>
      <router-link to>
        <v-avatar class="hidden-sm-and-down">
          <img src="../assets/project.png" alt>
        </v-avatar>
      </router-link>

      <v-toolbar-title>
        <router-link to tag="span" style="cursor: pointer">
          <h1 class="hidden-sm-and-down">{{ appName }}</h1>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- menuItems1 = PRIMER MENU: Inicio, Login y Registro -->
      <v-toolbar-items class="hidden-sm-and-down" v-if="!isAuthenticated">
        <v-btn flat large @click.stop="showLoginForm=true">
          <v-icon>person</v-icon>
          <h2>INICIAR SESIÓN</h2>
          <Login v-model="showLoginForm"/>
        </v-btn>
        <!-- REGISTRATE -->
        <v-btn flat large @click.stop="showRegistrarForm=true">
          <v-icon>person_add</v-icon>
          <h2>REGÍSTRATE</h2>
          <Registrar v-model="showRegistrarForm"/>
        </v-btn>
        
        <!-- <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link" left>
          <v-icon left>{{ item.icon }}</v-icon>
          <v-badge color="red" v-if="item.badge">
            <span slot="badge">{{ item.badge }}</span>
            <span>{{ item.title }}</span>
          </v-badge>
          <span v-else>{{ item.title }}</span>
        </v-btn> -->
      </v-toolbar-items>
      <!-- menuItems2 = SEGUNDO MENU: Feed, Mi Perfil ... Cerrar Sesion. -->
      <v-toolbar-items class="hidden-sm-and-down" v-if="isAuthenticated">
        <v-btn flat v-for="item in menuItems2" :key="item.title" :to="item.link" left>
          <v-icon left>{{ item.icon }}</v-icon>
          <v-badge color="red" v-if="item.badge">
            <span slot="badge">{{ item.badge }}</span>
            <span>{{ item.title }}</span>
          </v-badge>
          <span v-else>{{ item.title }}</span>
        </v-btn>
        <!-- Perfil -->
        <v-btn flat :to="{ name: 'perfil', params: { username: this.username } }" left>
          <v-icon left>person</v-icon>
          <span>Mi perfil</span>
        </v-btn>
        <!-- Cerrar sesion -->
        <v-btn flat to @click="cerrarSesion()" left>
          <v-icon left>power_settings_new</v-icon>
          <span>Cerrar Sesión</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>
<script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>

<script>
import { setTimeout } from "timers";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import { mapGetters, mapMutations, mapState } from "vuex";
// import Search from "@/components/Search.vue";
import Registrar from "../views/Registrar.vue";
import Login from "../views/Login.vue";

export default {
  data: () => ({
    sideNav: true,
    // Nuevas variables
    showLoginForm: false,
    showRegistrarForm: false,
    dialog: false,
    dialog2: false,
    // ----------------
    appName: "PROFACTORY",
    menuItems: [
      { icon: "home", title: "Inicio", link: "/" },
      { icon: "call_made", title: "Iniciar Sesión", link: "/login" },
      { icon: "person", title: "Registrarse", link: "/registrar" }
    ],
    menuItems2: [
      { icon: "search", title: "Buscar", link: "/busqueda" },
      { icon: "home", title: "Publicaciones", link: "/feed" }
      // {
      //   icon: "person",
      //   title: "Mi Perfil",
      //   link: { name: "perfil", params: { username: username } }
      // }
      // {
      //   icon: "power_settings_new",
      //   title: "Cerrar Sesión",
      //   link: "",
      //   action: "cerrarSesion"
      // }
    ]
  }),

  components: {
    Login,
    Registrar
  },

  computed: {
    ...mapGetters(["isAuthenticated"]),
    ...mapState(["username"])
  },

  methods: {
    ...mapMutations(["logout"]),
    cerrarSesion() {
      this.logout();
      this.$router.push("/");
    }
  },

};
</script>
<style scoped>
.v-toolbar-items label span {
  font-size: 25px;
}
nav {
  min-height: 65px;
}
img {
  border-radius: 10%;
}
.card {
  border-radius: 10%;
}

.login {
  background: #00acc1;
  border-radius: 5%;
  font-family: "Quicksand", sans-serif;
}
a {
  color: inherit;
  font-size: inherit;
  text-decoration: none;
  font-family: "Quicksand", sans-serif;
}
.logo {
  width: 54px;
  height: 54px;
  padding-bottom: 10%;
}
h1 {
  font-size: 30px;
  font-family: "Quicksand", sans-serif;
}
h2 {
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
}
.toolbar {
  background: #00acc1;
}
.dialogs {
  color: transparent;
}
</style>






