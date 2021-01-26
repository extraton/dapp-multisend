<template>
  <v-app>
    <v-snackbar v-model="snack.isShow">{{ snack.text }}</v-snackbar>
    <install-extension-dialog/>
    <div>
      <v-app-bar>
        <v-icon left>mdi-diamond-stone</v-icon>
        <v-toolbar-title>extraTON.Multisend</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn href="https://t.me/extraton" target="_blank" text outlined>
          <v-icon left>mdi-telegram</v-icon>
          <span>Support</span>
        </v-btn>
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tabs-slider color="#272727"/>
            <v-tab :to="{name: 'main'}" exact>Home</v-tab>
            <v-tab :to="{name: 'about'}">About</v-tab>
            <v-spacer/>
            <div class="alsoTry align-center">
              <span class="text--primary subtitle-1">Also try:</span>
              <a :href="alsoTryRandom.url" target="_blank" class="alsoTry__link">
                {{ alsoTryRandom.name }}
              </a>
            </div>
          </v-tabs>
        </template>
      </v-app-bar>
    </div>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import InstallExtensionDialog from "@/components/InstallExtensionDialog";
export default {
  components: {InstallExtensionDialog},
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
