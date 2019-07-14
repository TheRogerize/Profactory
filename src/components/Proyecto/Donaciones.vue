<template>
  <v-layout xs12 text-xs-right>
    <v-flex xs12 class="donaciones">
      <v-flex pa-3 xs12 md12 sm12 text-xs-center>
        <v-hover>
          <v-card
            text-xs-center
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="indigo darken-2"
            dark
          >
            <h1>
              DONACIONES
              <v-btn slot="activator" class="v-btn--simple" color="primary" icon>
                <v-icon>monetization_on</v-icon>
              </v-btn>
            </h1>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex mx-5 xs12 md12 sm12 text-xs-center text-md-left>
        <!-- BARRA DE MONTO -->
        <label style="padding:0; margin:0;" class="blue-grey--text">
          <h3 style="font-size:18px">{{project.amount}}$ del objetivo de {{project.cost}}$</h3>
        </label>
        <v-progress-linear color="success" height="5" :value="prom"></v-progress-linear>
      </v-flex>
      <v-flex mx-5 xs12 md12 sm12 text-xs-center text-md-left>
        <label class="grey--text">Recaudados de {{project.donations}} personas.</label>
      </v-flex>
      <v-flex pa-5 xs12 md12 sm12 text-xs-center>
        <!-- BOTON DONAR/GENERAR ESTADISTICAS -->
        <v-dialog v-model="dialog" max-width="500" v-if="!isProjectOwner && !project.finished">
          <template v-slot:activator="{ on }">
            <v-btn
              large
              v-on="on"
              style="width:85%; padding:0; margin:0;"
              class="indigo darken-2"
              dark
            >DONAR</v-btn>
          </template>
          <v-card>
            <v-flex text-xs-center class="text-xs-center indigo darken-2">
              <h1 style="text-align:center; color:white">INGRESA TUS DATOS</h1>
            </v-flex>
            <v-card-text>
              <v-container grid-list-md>
                <v-form ref="form" id="payment-form">
                  <v-layout wrap>
                    <v-flex xs12>
                      <card
                        refs="card"
                        class="stripe-card"
                        :class="{ complete }"
                        stripe="pk_test_FVpIE8JG8Vjkj9VStUt6OypD00ksisCKw9"
                        :options="stripeOptions"
                        @change="cardChange($event)"
                      />
                      <!-- Used to display form errors. -->
                      <div id="card-errors" role="alert" v-text="errorMessage"></div>
                    </v-flex>
                    <v-flex xs12>
                      <Money
                        v-on:complete="complete = true"
                        v-on:uncomplete="complete = false"
                        :project="project"
                      />
                      <!-- <v-text-field
                        v-model="amount"
                        mask="###"
                        label="Monto"
                        prepend-icon="monetization_on"
                        required
                      ></v-text-field>-->
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo darken-2" flat @click="close">Cancelar</v-btn>
              <v-btn
                color="indigo darken-2"
                class="pay-with-stripe"
                @click="pay"
                :disabled="!complete"
                flat
              >ENVIAR DONACIÓN</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <GenerarReporte v-else-if="isProjectOwner"/>
      </v-flex>
    </v-flex>
  </v-layout>
</template>
<script>
// import { stripeKey, stripeOptions } from './stripeConfig.json'
import { Card, createToken } from "vue-stripe-elements-plus";
import GenerarReporte from "@/components/Proyecto/GenerarReporte.vue";
import Money from "@/components/Money.vue";

export default {
  data: () => ({
    amount: 5,
    TDC: {
      number: "",
      owner: "",
      expiration: {
        month: "",
        year: ""
      }
    },
    value: "0",
    acum: 50,
    cont: 2,
    dialog: false, //DONAR
    items: [
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        Nombre: "Hebert",
        Mensaje:
          " Wish I could come, but I'm out of town this weekend., Wish I could come, but I'm out of town this weekend. Wish I could come, but I'm out of town this weekend.",
        ratingcomentario: 1
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        Nombre: "Roy",
        Mensaje: " sdd jwj lajdlkdkals klwd",
        ratingcomentario: 2
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        Nombre: "Hebert",
        Mensaje:
          " asdwads wdak adkawkl wlkd ak ldask awd awdjasjd jwj lajdlkdkals klwd",
        ratingcomentario: 1
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        Nombre: 'Summer BBQ <span class="grey--text text--lighten-1"></span>',
        Mensaje: "Wish I could come, but I'm out of town this weekend.",
        ratingcomentario: 3
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        Nombre: "Oui oui",
        Mensaje: "Do you have Paris recommendations? Have you ever been?",
        ratingcomentario: 4
      }
    ],

    // Stripe
    complete: false,
    stripeOptions: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    },
    errorMessage: ""
  }),

  components: { Card, Money, GenerarReporte },

  // beforeDestroy() {
  //   this.$refs.card.$destroy();
  // },

  props: {
    project: {
      required: true,
      type: Object
    },
    isProjectOwner: {
      required: true,
      type: Boolean
    }
  },

  methods: {
    close() {
      this.dialog = false;
    },

    // Stripe
    pay() {
      createToken().then(res => {
        // Validacion de errores
        if (!res.hasOwnProperty("error")) {
          this.$store.commit("loading");

          // URL de PHP
          const urlPhp = `http://localhost/stripe/index.php?stripeToken=${
            res.token.id
          }&amount=${this.$store.state.amount * 100}`;

          // Primer request a Php
          axios
            .post(urlPhp, {})
            .then(res => {
              // Si el pago es creado, entonces hacemos el request a django
              console.log("respuesta de PHP:", res);
              if (res.data === 1) {
                const urlDjango = `${this.$store.state.host}/projects/${
                  this.project.slug_name
                }/donations/`;

                let data = {
                  // stripeToken: res.token.id,
                  amount: this.$store.state.amount
                };

                axios
                  .post(urlDjango, data, {
                    headers: this.$store.getters.authHeaders
                  })
                  .then(res => {
                    console.log("respuesta de Django:", res.data);
                    this.$store.commit("loaded");
                    this.close();
                    this.$emit("refresh");
                    this.$store.commit(
                      "openNotification",
                      "Pago realizado con exito"
                    );
                  })
                  .catch(err => {
                    console.log(err.response.data);
                  });
              }
            })
            .catch(err => {
              console.log(err.response.data);
              this.$store.commit("loaded");
              this.$store.commit("openNotification", "Ha ocurrido un error");
            });
        }
      });
    },
    cardChange(e) {
      if (e.error) {
        this.errorMessage = e.error.message;
        this.complete = false;
      } else {
        this.errorMessage = "";
        this.complete = true;
      }
    }
  },

  computed: {
    cardNumberFormatted: function() {
      var numberChunks = this.card.number.match(/.{1,4}/g);

      if (numberChunks) return numberChunks.join(" ");
      else return "";
    },
    cardExpiration: function() {
      if (!this.card.expiration.month || !this.card.expiration.year) return "";

      return this.card.expiration.month + "/" + this.card.expiration.year;
    },

    prom() {
      return (this.project.amount / this.project.cost) * 100;
    },

    months: function() {
      return [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
      ];
    },
    years: function() {
      var years = [];
      var currentYear = new Date().getFullYear() % 2000;

      for (var i = 0; i < 18; i++) years.push(currentYear + i);

      return years;
    }
  }
};
</script>
<style scoped>
.contain {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0px;
}
.carta_principal {
  margin: 0;
  padding: 0;
}
.donaciones {
  height: 100%;
}
.calificaciones {
  background: #f5f5f5;
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
  color: #616161;
  font-size: 17px;
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
  font-size: 18px;
  color: #9ccc65;
}
label {
  font-size: 16px;
}
.inputPrice input[type="number"] {
  -moz-appearance: textfield;
}
.inputPrice input::-webkit-outer-spin-button,
.inputPrice input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.scroll {
  overflow-y: auto;
}
.base {
  color: #32325d;
  font-family: '"Helvetica Neue", Helvetica, sans-serif';
  font-size: 16px;
  /* color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      } */
}
</style>
