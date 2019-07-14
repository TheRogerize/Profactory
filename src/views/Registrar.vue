<template>
  <v-dialog v-model="show" max-width="800px">
    <v-layout align-center justify-center fill-height>
      <v-card class="blue-grey lighten-4" light width="100%">
        <v-card-title>
          <v-layout row wrap>
            <v-flex grow pa-3>
              <v-layout row wrap align-center justify-center text-xs-center>
                <v-flex xs12>
                  <img class="img" src="../assets/aqualung2.png" alt>
                </v-flex>
                <v-flex xs12>
                  <h1>REGÍSTRATE</h1>
                </v-flex>
                <v-flex xs12>
                  <h3>* Representa los campos obligatorios</h3>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-alert :value="successMessage" type="success">{{successMessage}}</v-alert>

          <v-alert :value="errorMessage" type="error">{{errorMessage}}</v-alert>
        </v-card-title>

        <v-card-text>
          <v-layout row wrap align-center justify-center>
            <!-- NOMBRE -->
            <v-flex pa-2 xs12 sm12 md4>
              <v-text-field
                label="Nombre*"
                v-model.trim="firstName"
                :error-messages="firstNameErrors"
                :counter="100"
                required
                @input="$v.firstName.$touch()"
                @blur="$v.firstName.$touch()"
              ></v-text-field>
            </v-flex>
            <!--EMAIL-->
            <v-flex pa-2 xs12 sm12 md6>
              <v-text-field
                label="Email*"
                :error-messages="emailErrors"
                required
                v-model.trim="email"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
            </v-flex>
            <!-- APELLIDO -->
            <v-flex pa-2 xs12 sm12 md4>
              <v-text-field
                label="Apellido*"
                v-model.trim="lastName"
                :error-messages="lastNameErrors"
                :counter="100"
                required
                @input="$v.lastName.$touch()"
                @blur="$v.lastName.$touch()"
              ></v-text-field>
            </v-flex>
            <!--CONFIRMAR EMAIL-->
            <v-flex pa-2 xs12 sm12 md6>
              <v-text-field
                label="Confirmar Email*"
                v-model.trim="confirmEmail"
                :error-messages="emailMatchErrors"
                required
                @input="$v.confirmEmail.$touch()"
                @blur="$v.confirmEmail.$touch()"
              ></v-text-field>
            </v-flex>
            <!--NOMBRE USUARIO -->
            <v-flex pa-2 xs12 sm12 md4>
              <v-text-field
                label="Nombre de Usuario*"
                v-model.trim="username"
                :error-messages="usernameErrors"
                :counter="30"
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>
            </v-flex>
            <!-- FECHA DE NACIMIENTO -->
            <v-flex pa-2 xs12 sm12 md6>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Fecha de Nacimiento"
                    v-model="date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dateErrors"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="date"
                  locale="es-ve"
                  max="2004-12-31"
                  min="1935-01-01"
                  @input="menu = false"
                  @blur="$v.date.$touch()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <!--CONTRASEÑA-->
            <v-flex pa-2 xs12 sm12 md4>
              <v-text-field
                :append-icon="showPass ? 'visibility' : 'visibility_off'"
                :type="showPass ? 'text' : 'password'"
                name="input-10-2"
                :error-messages="passwordErrors"
                label="Contraseña"
                value
                class="input-group--focused"
                v-model="password"
                @click:append="showPass = !showPass"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </v-flex>
            <!-- TELEFONO -->
            <v-flex pa-2 xs12 sm12 md6>
              <v-text-field
                label="Numero de telefono"
                v-model="phone"
                mask="(###) ### - ####"
                :error-messages="phoneErrors"
                @input="$v.phone.$touch()"
                @blur="$v.phone.$touch()"
              ></v-text-field>
            </v-flex>
            <!-- CONFIRM PASSWORD -->
            <v-flex pa-2 xs12 sm12 md4>
              <v-text-field
                name="input-10-2"
                label="Confirmar Contraseña"
                :error-messages="passwordMatchError"
                value
                class="input-group--focused"
                v-model="confirmPassword"
                :append-icon="showPassConfirm ? 'visibility' : 'visibility_off'"
                :type="showPassConfirm ? 'text' : 'password'"
                @click:append="showPassConfirm = !showPassConfirm"
                @input="$v.confirmPassword.$touch()"
                @blur="$v.confirmPassword.$touch()"
              ></v-text-field>
            </v-flex>
            <!-- GENERO -->
            <v-flex pa-2 xs12 sm12 md6>
              <v-select
                label="Genero*"
                v-model="gender"
                :items="genderItems"
                item-text="text"
                item-value="value"
                :error-messages="genderErrors"
                required
                @input="$v.gender.$touch()"
                @blur="$v.gender.$touch()"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap align-center justify-center text-xs-center>
            <v-btn light flat @click.stop="show=false">
              <h2>Cerrar</h2>
            </v-btn>
            <v-btn class="cyan darken-2" large dark flat @click="submit()">
              <h2>ENVIAR</h2>
            </v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions></v-card-actions>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>
<script>
import { setTimeout } from "timers";
import {
  required,
  maxLength,
  email,
  minLength,
  sameAs,
  alpha
} from "vuelidate/lib/validators";
import { scrypt } from "crypto";

const unique = field =>
  function(v) {
    if (v === "") return true;

    return new Promise((resolve, reject) => {
      const url = `${this.$store.state.host}/users/${field}/`;
      axios.get(url).then(resp => {
        let results = [];
        for (let obj of resp.data) {
          results.push(obj[field]);
        }
        resolve(!results.includes(v));
      });
    });
  };

export default {
  data: () => ({
    // Nuevas variables
    dialog: true,
    valid: true,
    // ---
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    username: "",
    date: "",
    menu: false,
    password: "",
    confirmPassword: "",
    phone: "",
    gender: null,
    genderItems: [
      { text: "Masculino", value: 0 },
      { text: "Femenino", value: 1 },
    ],
    showPass: false,
    showPassConfirm: false,
    errorMessage: "",
    successMessage: ""
  }),

  validations: {
    firstName: {
      required,
      maxLength: maxLength(100),
      alpha
    },
    lastName: {
      required,
      maxLength: maxLength(100),
      alpha
    },
    email: {
      required,
      maxLength: maxLength(80),
      email,
      unique: unique("email")
    },
    confirmEmail: {
      required,
      sameAsEmail: sameAs("email")
    },
    username: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(30),
      unique: unique("username")
    },
    date: { required },
    phone: {
      required,
      minLength: minLength(10),
      unique: unique("phone_number")
    },
    gender: { required },
    password: {
      required,
      minLength: minLength(5)
    },
    confirmPassword: {
      required,
      sameAsPass: sameAs("password")
    }
  },

  props: {
    value: Boolean
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$store
          .dispatch("register", {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            username: this.username,
            born_date: this.date,
            password: this.password,
            password_confirmation: this.confirmPassword,
            phone_number: this.phone,
            gender: this.gender
          })
          .then(response => {
            let loginData = {
              email: this.email,
              password: this.password
            };

            this.$store
              .dispatch("login", loginData)
              .then(res => {
                this.show = false;
                this.$router.push("/feed");
              })
              .catch(err => {
                console.log(err);
              });
            this.$store.commit("openNotification", "Registrado Exitosamente");
          })
          .catch(err => {
            // Error handling
            if (err.response) {
              if (err.response.status == 500) {
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
    },
    clear() {
      
    },
    consola() {
      console.log(this.gender);
    }
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
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push("Campo requerido");
      !this.$v.firstName.maxLength && errors.push("Limite excedido");
      !this.$v.firstName.alpha && errors.push("Solo se admiten letras");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Campo requerido");
      !this.$v.lastName.maxLength && errors.push("Limite excedido");
      !this.$v.lastName.alpha && errors.push("Solo se admiten letras");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("Campo requerido");
      !this.$v.email.maxLength && errors.push("Limite excedido");
      !this.$v.email.email && errors.push("Email invalido");
      !this.$v.email.unique && errors.push("Email en uso");
      return errors;
    },
    emailMatchErrors() {
      const errors = [];
      if (!this.$v.confirmEmail.$dirty) return errors;
      !this.$v.confirmEmail.required && errors.push("Campo requerido");
      !this.$v.confirmEmail.sameAsEmail &&
        errors.push("Los emails deben coincidir");
      return errors;
    },
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push("Campo requerido");
      !this.$v.username.minLength && errors.push("Minimo 3 caracteres");
      !this.$v.username.maxLength && errors.push("Limite excedido");
      !this.$v.username.unique && errors.push("Usuario en uso");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Campo requerido");
      !this.$v.password.minLength && errors.push("Minimo 5 caracteres");
      return errors;
    },
    passwordMatchError() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required && errors.push("Campo requerido");
      !this.$v.confirmPassword.sameAsPass &&
        errors.push("Las contrasenas deben coincidir");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.required && errors.push("Campo requerido");
      !this.$v.phone.minLength && errors.push("Numero incompleto");
      !this.$v.phone.unique && errors.push("Telefono en uso");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.date.$dirty) return errors;
      !this.$v.date.required && errors.push("Campo requerido");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.gender.$dirty) return errors;
      !this.$v.gender.required && errors.push("Campo requerido");
      return errors;
    }
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
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
</style>
