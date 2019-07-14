<template>
  <v-container class="caja_principal" v-if="!isFetching">
    <v-container class="seccion" fluid>
      <InformacionProyecto
        :project="project"
        :isProjectOwner="isProjectOwner"
        v-on:setProjectData="setProjectData"
        v-on:refresh="refresh()"
      />
    </v-container>
    <v-container class="seccion" fluid>
      <Publicaciones :project="project" :isProjectOwner="isProjectOwner"/>
    </v-container>
  </v-container>
</template>

<script>
import InformacionProyecto from "@/components/Proyecto/InformacionProyecto.vue";
import Publicaciones from "@/components/Proyecto/Publicaciones.vue";

export default {
  data() {
    return {
      isFetching: true
    };
  },
  components: { InformacionProyecto, Publicaciones },

  asyncComputed: {
    project: {
      get() {
        this.$store.commit("loading");
        const url = `${this.$store.state.host}/projects/${
          this.$route.params.slug_name
        }/`;
        return axios
          .get(url, { headers: this.$store.getters.authHeaders })
          .then(res => {
            this.$store.commit("loaded");
            return res.data;
          })
          .catch(err => {
            this.$store.commit("loaded");
            if (err.response.status === 404) this.$router.push("/not-found");
            console.log(err.response.data);
          });
      }
    }
  },

  computed: {
    isProjectOwner() {
      return this.$store.state.user.username === this.project.creator;
    }
  },

  watch: {
    project(value) {
      if (value !== null) this.isFetching = false;
    }
  },

  methods: {
    refresh() {
      // Triggers an immediate update of blogPosts
      // Will work even if an update is in progress.
      this.$asyncComputed.project.update();
    },
    setProjectData(data) {
      this.project = data;
    }
  }
};
</script>

<style scoped>
.caja_principal {
  max-width: 100%;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.seccion {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
