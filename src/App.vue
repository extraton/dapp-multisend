<template>
  <v-app>
    <v-snackbar v-model="snack.isShow">{{ snack.text }}</v-snackbar>
    <v-container>
      <v-alert type="error">
        Project Closed!
        <br/>See details in official <a href="https://extraton.io" target="_blank">site</a>.
      </v-alert>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    snack: {isShow: false, text: ''},
    alsoTry: [
      {name: 'extraTON.Staking', url: 'https://depools.extraton.io/'},
      {name: 'extraTON.Vouch', url: 'https://vouch.extraton.io/'},
      {name: 'extraTON.DoD', url: 'https://dod.extraton.io/'},
    ],
    alsoTryRandom: null,
  }),
  created() {
    this.alsoTryRandom = this.alsoTry[Math.floor(Math.random() * this.alsoTry.length)];
    this.$snack.listener = function (text) {
      this.snack.text = text;
      this.snack.isShow = false;
      this.snack.isShow = true;
    }.bind(this);
  },
};
</script>

<style lang="scss">
.alsoTry {
  display: flex;
  margin-right: 15px;

  &__link {
    margin-left: 5px;
  }
}
@media screen and (max-width: 500px) {
  .alsoTry {
    display: none!important;
  }
}
</style>
