<template>
  <div class="text-xs-center">
    <v-dialog v-model="this.$store.state.loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Por favor, espere.
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
    name: 'loading'
}
</script>
