<template>
  <v-container class="caja_principal" fluid v-if="!isFetching">
    <v-container class="otros" fluid>
      <Informacion
        :profileData="profileData"
        :isAccountOwner="isAccountOwner"
        v-on:refresh="refresh()"
      />
    </v-container>

    <v-container class="perfiles" fluid>
      <Perfiles :profileData="profileData" :isAccountOwner="isAccountOwner"/>
    </v-container>

    <v-container class="otros" fluid>
      <Seguidores :followers="profileData.followers"/>
    </v-container>

    <v-container class="otros" fluid>
      <Seguidos :followeds="profileData.followeds"/>
    </v-container>

    <v-container class="otros" fluid v-if="isAccountOwner">
      <Solicitudes :follow_requests="profileData.follow_requests" v-on:refresh="refresh()"/>
    </v-container>

    <notification/>
  </v-container>
</template>
<script>
/* eslint-disable */
import Perfiles from "../components/Perfiles.vue";
import Seguidores from "../components/Seguidores.vue";
import Seguidos from "../components/Seguidos.vue";
import Solicitudes from "../components/Solicitudes.vue";
import Informacion from "../components/Informacion.vue";
import notification from "@/components/notification.vue";

export default {
  name: "App",

  data() {
    return {
      updated: false,
      isFetching: true,
      //AVATAR USUARIO
      avatar: null,
      saving: false,
      saved: false,
      info: null,
      //TABS PERFILES
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },
  //EJEMPLO AXIOS

  // beforeMount() {
  //   // Loading profile data
  //   this.loadProfile();
  //   // axios
  //   //   .get("https://api.coindesk.com/v1/bpi/currentprice.json")
  //   //   .then(response => (this.info = response));
  // },

  computed: {
    isAccountOwner() {
      return this.$store.state.user.username === this.$route.params.username;
    }
    // profileData() {
    //   if (this.isAccountOwner) {
    //     this.$store
    //       .dispatch("updateUser")
    //       .then(res => {
    //         return this.$store.state.user;
    //       })
    //       .catch(err => {
    //         console.log(err.response.data);
    //       });
    //   } else {
    //     this.$store.commit("loading");
    //     this.isFetching = true;
    //     const url = `${this.$store.state.host}/users/${
    //       this.$route.params.username
    //     }`;
    //     axios
    //       .get(url, { headers: this.$store.getters.authHeaders })
    //       .then(res => {
    //         return res.data;
    //         this.isFetching = false;
    //         this.$store.commit("loaded");
    //       })
    //       .catch(err => {
    //         if (err.response.status === 404) this.$router.push("/not-found");
    //         this.isFetching = false;
    //         this.$store.commit("loaded");
    //       });
    //   }
    // }
  },

  asyncComputed: {
    profileData: {
      get() {
        this.$store.commit("loading");
        const url = `${this.$store.state.host}/users/${
          this.$route.params.username
        }`;
        return axios
          .get(url, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.$store.commit("loaded");
            if (this.isAccountOwner) this.$store.commit("setUser", res.data);
            return res.data;
          })
          .catch(err => {
            this.$store.commit("loaded");
            if (err.response.status === 404) this.$router.push("/not-found");
          });
      }
      // default: 'Loading...'
    }
  },

  components: {
    Seguidores,
    Seguidos,
    Perfiles,
    Solicitudes,
    Informacion,
    notification
  },

  watch: {
    avatar: {
      handler: function() {
        this.saved = false;
      },
      deep: true
    },
    $route(to, from) {
      this.loadProfile();
    },
    profileData(value) {
      if (value !== null) this.isFetching = false;
    }
  },

  methods: {
    uploadImage() {
      this.saving = true;
      setTimeout(() => this.savedAvatar(), 1000);
    },
    savedAvatar() {
      this.saving = false;
      this.saved = true;
    },
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    },
    //TABS
    complete(index) {
      this.list[index] = !this.list[index];
    },
    loadProfile() {
      if (!this.isAccountOwner) {
        this.$store.commit("loading");
        this.isFetching = true;
        const url = `${this.$store.state.host}/users/${
          this.$route.params.username
        }`;
        axios
          .get(url, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.profileData = res.data;
            this.isFetching = false;
            this.$store.commit("loaded");
          })
          .catch(err => {
            if (err.response.status === 404) this.$router.push("/not-found");
            this.isFetching = false;
            this.$store.commit("loaded");
          });
      }
    },
    refresh() {
      // Triggers an immediate update of blogPosts
      // Will work even if an update is in progress.
      this.$asyncComputed.profileData.update();
    }
  }
};
</script>
<style scoped>
.perfiles {
  margin: 0;
  padding: 0;
  width: 100%;
}
.otros {
  margin: 0;
  padding: 0;
  width: 100%;
}

.caja_principal {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.caja_perfil {
  width: 100%;
  padding: 0;
  margin: 0;
  max-height: 35%;
}

.text {
  text-align: center;
  font-family: "Quicksand", sans-serif;
  font-size: 18px;
}
p {
  text-align: left;
  font-family: "Quicksand", sans-serif;
  color: black;
  font-size: 20px;
}
h1 {
  text-align: left;
  font-family: "Quicksand", sans-serif;
  font-size: 25px;
}

input-usage .v-input__prepend-outer,
input-usage .v-input__append-outer,
input-usage .v-input__slot,
input-usage .v-messages {
  border: 1px dashed rgba(0, 0, 0, 0.4);
}
</style>
