<template>
  <div>
    <v-layout class="white" fluid align-center justify-center row elevation-5>
      <v-flex shrink pa-5>
        <v-container class="contain" fluid>
          <v-card flat color="transparent">
            <v-layout align-center justify-center>
              <v-card color="transparent" flat>
                <!-- CAMBIAR IMAGEN -->
                <image-input v-on:input="uploadImage" v-if="isAccountOwner">
                  <div slot="activator">
                    <v-layout align-center justify-center>
                      <v-avatar
                        size="150px"
                        v-ripple
                        v-if="!profileData.profile.picture"
                        class="cyan lighten-3 mb-3"
                      >
                        <img src="@/assets/aqualung.png" alt="avatar">
                      </v-avatar>

                      <v-avatar size="150px" v-ripple class="mb-3" v-else>
                        <img :src="profileData.profile.picture" alt="avatar">
                      </v-avatar>
                    </v-layout>
                  </div>
                </image-input>
                <!-- VER IMAGEN -->
                <v-layout align-center justify-center v-else>
                  <v-avatar
                    size="150px"
                    v-ripple
                    v-if="!profileData.profile.picture"
                    class="cyan lighten-3 mb-3"
                  >
                    <img src="@/assets/aqualung.png" alt="avatar">
                  </v-avatar>

                  <v-avatar size="150px" v-ripple class="mb-3" v-else>
                    <img :src="profileData.profile.picture" alt="avatar">
                  </v-avatar>
                </v-layout>
                <v-layout justify-center row v-if="isAccountOwner">
                  <h3 v-if="!profileData.profile.picture">Haz click arriba para asignar un avatar</h3>
                  <h3 v-else>Haz click arriba para cambiar el avatar</h3>
                </v-layout>
                <v-slide-x-transition>
                  <div v-if="avatar && saved == false">
                    <v-btn class="primary" @click="uploadImage" :loading="saving">Guardar Avatar</v-btn>
                  </div>
                </v-slide-x-transition>
                <v-layout align-center justify-center row wrap>
                  <!-- USERNAME-->
                  <v-flex xs12 md12 sm12 class="text-xs-center">
                    <h1>{{profileData.username}}</h1>
                  </v-flex>
                  <v-divider></v-divider>
                  <!-- FOLLOW/SEGUIR-->
                  <v-flex xs12 class="textocentral" v-if="!isAccountOwner">
                    <v-btn
                      :loading="followBtnLoading"
                      :dark="isNotFollowedYet"
                      :disabled="!isNotFollowedYet"
                      round
                      large
                      class="blue darken-1"
                      @click="follow()"
                    >
                      <h3 v-if="isNotFollowedYet">SEGUIR</h3>
                      <h3 v-else>SEGUIDO</h3>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-layout>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <!-- Dialog para editar usuario -->
    <v-dialog v-model="dialog" max-width="600px" v-if="isAccountOwner">
      <v-card>
        <v-card-title class="textocentral">
          <h1>Modificar Información de Usuario</h1>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="form">
              <v-layout wrap>
                <!-- Username -->
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="datosPerfil.editedItem.username"
                    label="Usuario"
                    maxlength="30"
                    counter="30"
                    required
                  ></v-text-field>
                </v-flex>
                <!-- Email -->
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="datosPerfil.editedItem.email"
                    label="Email"
                    maxlength="80"
                    counter="80"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-flex>
                <!-- Nombre -->
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="datosPerfil.editedItem.nombre"
                    label="Nombre"
                    maxlength="100"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <!-- Apellido -->
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="datosPerfil.editedItem.apellido"
                    label="Apellido"
                    maxlength="100"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <!-- Telefono -->
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="datosPerfil.editedItem.telefono"
                    :mask="mask"
                    :rules="phoneRules"
                    label="Telefono"
                  ></v-text-field>
                </v-flex>
                <!-- Genero -->
                <v-flex xs12 sm6 md4>
                  <v-select
                    label="Genero*"
                    v-model="datosPerfil.editedItem.genero"
                    :items="genderItems"
                    item-text="text"
                    item-value="value"
                    :return-object="true"
                    :rules="genderRules"
                    required
                  ></v-select>
                </v-flex>
                <!-- Fecha de nacimiento -->
                <v-flex xs12 sm6>
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
                        v-model="datosPerfil.editedItem.fecha"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="datosPerfil.editedItem.fecha"
                      locale="es-ve"
                      max="2004-12-31"
                      min="1935-01-01"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <!-- Biografia -->
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    v-model="datosPerfil.editedItem.biografia"
                    label="Biografia (opcional)"
                    box
                    :counter="150"
                    :maxlength="150"
                    light
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Informacion basica -->
    <v-data-table :items="datosPerfil.datosTabla" class="elevation-1" hide-actions>
      <template v-slot:items="props">
        <v-layout class="contain">
          <v-card flat color="transparent" class="contain">
            <v-flex xs12 sm12 md12>
              <v-card-text>
                <h1>
                  Información Básica
                  <v-btn
                    slot="activator"
                    class="v-btn--simple"
                    color="success"
                    icon
                    v-if="isAccountOwner"
                  >
                    <v-icon @click="editItem()">edit</v-icon>
                  </v-btn>
                </h1>
              </v-card-text>
            </v-flex>
            <v-divider></v-divider>

            <v-card-text class="informacion">
              <v-layout row wrap align-center justify-center>
                <!-- USERNAME -->
                <v-flex xs12 md3 sm6>
                  <h2>
                    <v-icon>person</v-icon>NOMBRE DE USUARIO
                  </h2>
                  <v-input class="sinicon">
                    <h3>{{profileData.username}}</h3>
                  </v-input>
                </v-flex>

                <!-- NOMBRE -->
                <v-flex xs12 md3 sm6>
                  <h2>NOMBRE</h2>
                  <v-input class="sinicon">
                    <h3>{{profileData.first_name}}</h3>
                  </v-input>
                </v-flex>

                <!-- APELLIDO -->
                <v-flex xs12 md3 sm6>
                  <h2>APELLIDO</h2>
                  <v-input class="sinicon">
                    <h3>{{profileData.last_name}}</h3>
                  </v-input>
                </v-flex>

                <!-- GENERO -->
                <v-flex xs12 md3 sm6>
                  <h2>GENERO</h2>
                  <v-input class="sinicon">
                    <h3>{{profileData.profile.gender}}</h3>
                  </v-input>
                </v-flex>

                <!-- EMAIl -->
                <v-flex xs12 md4 sm6>
                  <h2>
                    <v-icon>email</v-icon>CORREO ELECTRONICO
                  </h2>
                  <v-input class="sinicon">
                    <v-flex align-start>
                      <h3>{{profileData.email}}</h3>
                    </v-flex>
                  </v-input>
                </v-flex>

                <!-- FECHA DE NACIMIENTO -->
                <v-flex xs12 md4 sm6>
                  <h2>
                    <!-- CAMBIAR EL ICON -->
                    <v-icon>email</v-icon>FECHA DE NACIMIENTO
                  </h2>
                  <v-input class="sinicon">
                    <v-flex align-start>
                      <h3>{{profileData.profile.born_date}}</h3>
                    </v-flex>
                  </v-input>
                </v-flex>

                <!-- TELEFONO -->
                <v-flex xs12 md4 sm12>
                  <h2>
                    <v-icon>phone</v-icon>NUMERO DE TELEFONO
                  </h2>
                  <v-input class="sinicon">
                    <h3>{{profileData.phone_number}}</h3>
                  </v-input>
                </v-flex>
              </v-layout>

              <!-- BIOGRAFIA -->
              <v-layout text-xs-left>
                <v-flex xs12>
                  <h2>
                    <v-icon>accessibility</v-icon>BIOGRAFIA
                  </h2>
                  <v-input class>
                    <v-card-text>
                      <h3 v-if="profileData.profile.biography">{{profileData.profile.biography}}</h3>
                      <h3 v-else>Este usuario no tiene biografia.</h3>
                    </v-card-text>
                  </v-input>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-card-text>
          </v-card>
        </v-layout>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ImageInput from "./ImageInput.vue";
import { mapState } from "vuex";
import loading from "@/components/loading.vue";
import notification from "@/components/notification.vue";

export default {
  name: "Informacion",
  components: { loading, notification },

  props: {
    profileData: {
      type: Object,
      required: true,
      default: null
    },
    isAccountOwner: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      menu: false,
      avatar: null,
      saving: false,
      saved: false,
      dialog: false,
      generos: ["Masculino", "Femenino", "Prefiero no decirlo"],
      mask: "(###) ### - ####",
      bio: "asdawds",
      seguidos: 4,
      seguidores: 5,
      followBtnLoading: false,
      headers: [
        { text: "Nombre", align: "left", sortable: false, value: "Nombre" },
        { text: "Username", value: "Username" },
        { text: "Apellido", value: "Apellido" },
        { text: "Genero", value: "Genero" },
        { text: "Email", value: "Email" },
        { text: "Telefono", value: "Telefono" },
        { text: "Pais", value: "Pais" },
        { text: "Biografia", value: "Biografia" }
      ],
      datosPerfil: {
        datosTabla: [],
        editedItem: this.profileData
      },
      genderItems: [
        { text: "Masculino", value: 0 },
        { text: "Femenino", value: 1 },
      ],

      //RULES
      nameRules: [
        v => !!v || "Campo requerido",
        v => (v && v.length <= 15) || "Limite excedido",
        v =>
          /[A-Za-z\sáéíóúñÁÉÍÓÚÑ']/.test(v) ||
          "Debes ingresar Caracteres Validos"
      ],
      emailRules: [
        v => !!v || "Campo requerido",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Debes ingresar un Email Valido"
      ],
      genderRules: [v => v !== null || "Campo requerido."],
      userRules: [
        v => !!v || "Campo requerido",
        v => (v && v.length > 30) || "Limite excedido"
      ],
      phoneRules: [
        v => !!v || "Campo requerido",
        v => (v && v.length >= 10) || "Numero incompleto"
      ]
    };
  },

  components: { ImageInput },

  watch: {
    dialog(val) {
      val || this.close();
    },
    avatar: {
      handler: function() {
        this.saved = false;
      },
      deep: true
    }
  },

  mounted() {
    this.initialize_table();
    if (this.isAccountOwner) this.initialize_editedItem();
  },

  methods: {
    initialize_table() {
      this.datosPerfil.datosTabla.push({
        username: "asdf"
      });
    },
    initialize_editedItem() {
      this.datosPerfil.editedItem = {
        username: this.profileData.username,
        nombre: this.profileData.first_name,
        apellido: this.profileData.last_name,
        genero: {
          text: this.profileData.profile.gender,
          value: this.profileData.profile.gender == "Masculino" ? 0 : 1
        },
        fecha: this.profileData.profile.born_date,
        email: this.profileData.email,
        telefono: this.profileData.phone_number,
        biografia: this.profileData.profile.biography
      };
    },
    uploadImage(formData) {
      const url = `${this.$store.state.host}/users/${
        this.profileData.username
      }/profile/`;

      axios
        .patch(url, formData, {
          headers: this.$store.getters.authHeaders
        })
        .then(res => {
          this.$emit("refresh");
          this.savedAvatar();
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    savedAvatar() {
      this.saving = false;
      this.saved = true;
    },
    editItem() {
      this.initialize_editedItem();
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.initialize_editedItem();
    },
    follow() {
      this.followBtnLoading = true;
      const url = `${this.$store.state.host}/users/${
        this.profileData.username
      }/follow/`;
      axios
        .post(url, {}, { headers: this.$store.getters.authHeaders })
        .then(res => {
          this.followBtnLoading = false;
          this.$store.commit("openNotification", "Solicitud enviada");
        })
        .catch(err => {
          console.log(err.response.data);
          this.$store.commit("openNotification", "Ya enviaste una solicitud");
          this.followBtnLoading = false;
        });
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$store.commit("loading");

        let data = {
          username: this.datosPerfil.editedItem.username,
          email: this.datosPerfil.editedItem.email,
          phone_number: this.datosPerfil.editedItem.telefono,
          first_name: this.datosPerfil.editedItem.nombre,
          last_name: this.datosPerfil.editedItem.apellido,
          profile: {
            gender: this.datosPerfil.editedItem.genero.value,
            biography: this.datosPerfil.editedItem.biografia,
            born_date: this.datosPerfil.editedItem.fecha
          }
        };

        const url = `${this.$store.state.host}/users/${this.user.username}/`;
        // Peticiones http
        axios
          .put(url, data, {
            headers: this.$store.getters.authHeaders
          })
          .then(res => {
            this.$store.commit("setUser", res.data);
            this.$router.push(res.data.username);
            this.$emit("refresh");
            this.$store.commit("loaded");
            this.$store.commit(
              "openNotification",
              "Sus datos se han actualizado con exito"
            );
            this.dialog = false;
          })
          .catch(err => {
            // Handling errors
            if (["phone_number"] in err.response.data) {
              this.$store.commit(
                "openNotification",
                "Este numero de telefono ya esta siendo usado"
              );
            }
            if (["email"] in err.response.data) {
              this.$store.commit(
                "openNotification",
                "Este correo ya esta siendo usado"
              );
            }
            if (["username"] in err.response.data) {
              this.$store.commit(
                "openNotification",
                "Este nombre de usuario ya esta siendo usado"
              );
            }
            console.log(err.response.data);
            this.$store.commit("loaded");
          });
      }
    },
    consola(item) {
      console.log(item);
    }
  },

  computed: {
    ...mapState(["user"]),
    isNotFollowedYet() {
      for (let followed of this.user.followeds) {
        if (this.profileData.username == followed.followed.username) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}

.contain {
  width: 100%;
  height: 100%;
}
.sinicon {
  padding: 20px;
}
.textocentral {
  text-align: center;
}
p {
  font-family: "Quicksand", sans-serif;
  color: black;
  font-size: 14px;
}
h1 {
  font-family: "Quicksand", sans-serif;
  font-size: 25px;
}
h2 {
  font-family: "Quicksand", sans-serif;
  font-size: 20px;
  color: #546e7a;
}
h3 {
  font-family: "Quicksand", sans-serif;
  font-size: 16px;
}
</style>
