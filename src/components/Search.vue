<template>
  <v-text-field
    class="mt-2"
    v-model="search"
    style="max-width:300px;"
    flat
    label="Buscar"
    prepend-inner-icon="search"
    solo-inverted
    :search="search"
    @keypress.13="resultados"
  ></v-text-field>
</template>
<script>
export default {
  data() {
    return {
      search: ""
    };
  },
  methods: {
    resultados() {
      this.$router.push("/views/resultados");
    }
  }
};
</script>
