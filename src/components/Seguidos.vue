<template>
  <v-card>
    <v-card-title class="indigo white--text headline" text-xs-center>
      <h1>SEGUIDOS</h1>
    </v-card-title>
    <v-layout row wrap justify-space-between pa-3>
      <v-flex xs12 sm6 md3>
        <v-treeview
          :items="items"
          :active.sync="active"
          :open.sync="open"
          activatable
          active-class="primary--text"
          class="grey lighten-5"
          open-on-click
          transition
        >
          <template v-slot:prepend="{ item, active }">
            <v-icon v-if="!item.children" :color="active ? 'primary' : ''">mdi-account</v-icon>
          </template>
        </v-treeview>
      </v-flex>
      <v-flex text-xs-center xs12 sm6 md9>
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >Selecciona un usuario</div>
          <v-card v-else :key="selected.id" class="pa-2" flat max-width="600px">
            <v-card-text>
              <v-avatar v-if="selected.avatar" size="88">
                <v-img :src="selected.avatar" class="mb-4"></v-img>
              </v-avatar>
              <v-avatar v-else size="88">
                <!-- TRAER AVATAR POR DEFECTO -->
                <img src="@/assets/aqualung.png">
                <!-- <v-img src="@/assets/aqualung.png" class="mb-4"></v-img> -->
              </v-avatar>
              <h3 class="headline mb-2">{{ selected.full_name }}</h3>
              <div class="blue--text mb-2">{{ selected.email }}</div>
              <router-link
                tag="span"
                style="cursor: pointer"
                :to="{ name: 'perfil', params: { username: selected.name }}"
              >
              <div class="blue--text subheading font-weight-bold">{{ selected.name }}</div>
              </router-link>
            </v-card-text>
            <v-divider></v-divider>
            <v-layout tag="v-card-text" text-xs-center wrap>
              <v-flex tag="strong" xs12 text-xs-center mr-3 mb-2>Telefono:</v-flex>
              <v-flex text-xs-center xs12 mr-3 mb-2>{{ selected.phone }}</v-flex>
              <v-flex tag="strong" xs12 text-xs-center mr-3 mb-2>Genero:</v-flex>
              <v-flex xs12 text-xs-center mr-3 mb-2>{{ selected.gender }}</v-flex>
            </v-layout>
          </v-card>
        </v-scroll-y-transition>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
// const avatars = [
//   "?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban",
//   "?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun",
//   "?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong",
//   "?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair",
//   "?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly"
// ];

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  data() {
    return {
      active: [],
      avatar: null,
      open: [],
    }
  },

  props: {
    followeds: {
      type: Array,
      required: true
    }
  },

  computed: {
    users() {
      let array = [];
      for (let followed of this.followeds) {
        let new_followed = {
          name: followed.followed.username,
          full_name:
            followed.followed.first_name + " " + followed.followed.last_name,
          email: followed.followed.email,
          phone: followed.followed.phone_number,
          gender: followed.followed.profile.gender,
          avatar: followed.followed.profile.picture
        };
        array.push(new_followed);
      }
      return array;
    },
    items() {
      return [
        {
          name: "Usuarios",
          children: this.users
        }
      ];
    },
    selected() {
      if (!this.active.length) return undefined;

      const id = this.active[0];

      return this.users.find(user => user.id === id);
    }
  },

  // watch: {
  //   selected: "randomAvatar"
  // },

  methods: {
    // fetchUsers(item) {
    //   // Remove in 6 months and say
    //   // you've made optimizations! :)
    //   // await pause(1500);

    //   // return fetch("https://jsonplaceholder.typicode.com/users")
    //   //   .then(res => res.json())
    //   //   .then(json => item.children.push(...json));

    //   return item.children.push(this.profileData.followeds);

    // },
    randomAvatar() {
      this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
    }
  }
};
</script>
<style scoped>
h1 {
  font-size: 32px;
  font-family: "Quicksand", sans-serif;
}
h2 {
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
}
h3 {
  font-size: 14px;
  font-family: "Quicksand", sans-serif;
}
v-container {
  width: 100%;
}
</style>
