<template>
  <v-container id="app2" v-if="likesTop.length > 0">
    <v-btn
      large
      style="width:85%; padding:0; margin:0;"
      class="indigo darken-2"
      dark
      @click="generatePDF"
    >REPORTE</v-btn>

    <!-- TEMPLATE -->
    <!-- <div style="display: none;">
      <h1>Project Factory</h1>
      <p>Proyectos en alza:</p>
      <table ref="table">
        <tr>
          <th>Titulo</th>
          <th>Reputacion</th>
          <th>Donaciones</th>
        </tr>
        <tr v-for="(donation, index) in donations" :key="index">
          <td>{{donation.title}}</td>
          <td>{{donation.reputation}}</td>
          <td>{{donation.donations}}</td>
        </tr>
      </table>
    </div> -->
  </v-container>
</template>

<script>
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import "jspdf-autotable";

export default {
  data() {
    return {
      title: "Ahora si!",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%"
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%"
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%"
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%"
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%"
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%"
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ],
      donations: [
        { title: "Un title", reputation: 3.4, donations: 324.3 },
        { title: "Un title 2", reputation: 4, donations: 34.3 },
        { title: "Un title 3", reputation: 2, donations: 2.3 }
      ]
    };
  },

  asyncComputed: {
    likesTop() {
      const url = `${this.$store.state.host}/projects/likesTop/`;

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    donationsTop() {
      const url = `${this.$store.state.host}/projects/donationsTop/`;

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    likesDown() {
      const url = `${this.$store.state.host}/projects/likesDown/`;

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
    donationsDown() {
      const url = `${this.$store.state.host}/projects/donationsDown/`;

      return axios
        .get(url, { headers: this.$store.getters.authHeaders })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err.response.data);
        });
    },
  },

  methods: {
    generatePDF() {
      let doc = new jsPDF();
      let template = this.$refs.table;
      // doc.fromHTML(template, 10, 10);
      //   doc.autoTable({ html: template });

      // Titulo
      doc.setFontSize(22);
      doc.text(80, 20, "Project Factory");

      // Texto
      doc.setFontSize(16);
      doc.text(20, 35, "Proyectos con mas donaciones");

      doc.setProperties({
        title: "Reporte"
      });

      doc.autoTable({
        head: [["Titulo", "fecha", "Donaciones"]],
        body: this.getBody(this.donationsTop, 'filter_amount'),
        margin: { top: 10 },
        startY: 40
      });

      doc.setFontSize(16);
      doc.text(20, 95, "Proyectos mas gustados");

      doc.autoTable({
        head: [["Titulo", "fecha", 'Total de "me gusta"']],
        body: this.getBody(this.likesTop, 'publication_likes'),
        startY: 100
      });

      doc.setFontSize(16);
      doc.text(20, 155, "Proyectos con menos donaciones");

      doc.autoTable({
        head: [["Titulo", "fecha", "Donaciones"]],
        body: this.getBody(this.donationsDown, 'filter_amount'),
        startY: 160
      });

      doc.setFontSize(16);
      doc.text(20, 215, "Proyectos menos gustados");

      doc.autoTable({
        head: [["Titulo", "fecha", 'Total de "me gusta"']],
        body: this.getBody(this.likesDown, 'publication_likes'),
        startY: 220
      });

      window.open(doc.output("bloburl"));

      // const pdf = new jsPDF();
      // html2canvas(this.$refs.template).then(canvas => {
      //     var image = canvas.toDataURL('image/png');
      //     pdf.addImage(image, 'JPEG', 15, 40, 300, 500);
      //     pdf.save('facture.pdf');
      // });
    },
    getBody(array, field) {
      let body = [];
      for (let item of array) {
        if(item[field] == null) item[field] = 0;
        body.push([item.title, item.created, item[field]]);
      }
      return body;
    }
  }
};
</script>