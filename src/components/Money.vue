<template>
  <v-container>
    <div class="v-input v-text-field theme--light">
      <div class="v-input__control">
        <div class="v-input__slot">
          <money
            aria-label="Regular"
            v-bind="money"
            v-model="localAmount"
            class="base"
            @input="moneyValidator"
          ></money>
        </div>
      </div>
    </div>
    <div class="errors" v-text="errorMoney" color="red"></div>
  </v-container>
</template>

<script>
import { Money } from "v-money";
import { mapState } from 'vuex';

export default {
  data() {
    return {
      localAmount: 500,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "$ ",
        precision: 2,
        masked: false,
        allowBlank: false,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
      },
      errorMoney: ""
    };
  },

  props: {
    project: {
      required: false,
      default: 0
    },
  },

  methods: {
    moneyValidator() {
      this.$store.commit('updateAmount', this.localAmount);
      if (this.project !== 0) {
        if (this.amount > Number((this.project.cost - this.project.amount).toFixed(2))) {
          this.errorMoney =
            "el monto no puede superar lo que le falta al proyecto para llegar a la meta";
          this.$emit('uncomplete');
        } else if (this.amount < 5) {
          this.errorMoney = "El monto minimo deben ser 5$";
          this.$emit('uncomplete');
        } else {
          this.errorMoney = "";
          this.$emit('complete');
        }
      } else {
        if (this.amount > 250000) {
          this.errorMoney =
            "el monto no puede superar los 250.000$";
          this.$emit('uncomplete');
        } else if (this.amount < 500) {
          this.errorMoney = "El monto minimo deben ser 500$";
          this.$emit('uncomplete');
        } else {
          this.errorMoney = "";
          this.$emit('complete');
        }
      }
    }
  },

  computed: {
    ...mapState(['amount'])
  }
};
</script>