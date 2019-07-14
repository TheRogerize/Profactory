<template>
  <v-dialog v-model="show" max-width="500px">
    <v-layout align-center justify-center fill-height>
      <v-card class="blue-grey lighten-4" style="border-radius:20px" light>
        <v-layout align-center justify-center row wrap>
          <!-- AVATAR -->
          <v-flex pa-3>
            <v-layout row wrap align-center justify-center text-xs-center>
              <v-flex xs12>
                <img class="img" src="../assets/aqualung2.png" alt>
              </v-flex>
              <v-flex xs12>
                <h1>INGRESA TUS DATOS</h1>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-layout wrap align-center justify-center>
                <v-flex pa-3 xs12 md8 wrap>
                  <v-text-field
                    label="Ingresa tu correo electronico*"
                    type="email"
                    v-model.trim="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout wrap align-center justify-center>
                <v-flex pa-3 xs12 md8>
                  <v-text-field
                    label="Contraseña*"
                    v-model="password"
                    :rules="passwordRules"
                    :append-icon="showPass ? 'visibility' : 'visibility_off'"
                    @click:append="showPass = !showPass"
                    :type="showPass ? 'text' : 'password'"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <notification/>

              <v-layout wrap align-center justify-center>
                <v-btn light flat @click.stop="show=false">
                  <h2>Cerrar</h2>
                </v-btn>
                <v-btn class="cyan darken-2" large dark flat @click="submit()" :disabled="!valid">
                  <h2>Iniciar</h2>
                </v-btn>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<!--<script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>-->
<script>
import loading from "@/components/loading.vue";
import notification from "@/components/notification.vue";

export default {
  components: { loading, notification },

  data: () => ({
    showPass: false,
    valid: false,
    email: "",
    password: "",
    logginError: "",
    // Rules
    passwordRules: [v => !!v || "Debes ingresar una Contraseña"],
    emailRules: [
      v => !!v || "Se Requiere ingresar un Email",
      v =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Debes ingresar un Email Valido"
    ]
  }),

  props: {
    value: Boolean
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
  },

  methods: {
    submit() {
      // Validate form
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("login", {
            email: this.email,
            password: this.password
          })
          .then(data => {
            this.show = false;
            this.$router.push("/feed");
          })
          .catch(err => {
            // Error handling
            if (err.response) {
              if (err.response.status == 400) {
                this.$store.commit(
                  "openNotification",
                  "Credenciales invalidas."
                );
              } else if (err.response.status == 500) {
                this.$store.commit(
                  "openNotification",
                  "Ha ocurrido un error en el servidor"
                );
              }
            } else if (err.request) {
              this.$store.commit(
                "openNotification",
                "Ha ocurrido un fallo en la conexion con el servidor"
              );
            } else {
              console.log(err);
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.contain {
  max-width: 100%;
}

.login {
  width: 50%;
}
h1 {
  font-size: 30px;
  font-family: "Quicksand", sans-serif;
}
h2 {
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
}
p {
  color: red;
  font-family: "Quicksand", sans-serif;
  font-size: 25px;
}
</style>
