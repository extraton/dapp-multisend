<template>
  <div>
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>
          Transfer created
        </v-card-title>
        <v-card-text>
          <p>If you use multisig wallet, you can confirm it in <a href="https://vouch.extraton.io"
                                                                                    target="_blank">extraTON.Vouch</a>.
          </p>
          <p>See results in <a :href="explorerLink" target="_blank">explorer</a>.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="reload" color="primary" text>Refresh Page</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn @click="distribute" :loading="loading" :disabled="disabled" color="primary">
      Send + Distribute + Destroy
    </v-btn>
  </div>
</template>

<script>
import multisend from "@/lib/multisend";
import ton from "@/lib/ton";
import {mapMutations} from "vuex";

export default {
  props: {server: String, address: String, amount: String, explorerLink: String},
  data: () => ({
    loading: false,
    successDialog: false,
    disabled: false,
  }),
  methods: {
    ...mapMutations('extension', [
      'openInstallDialog',
    ]),
    async distribute() {
      this.loading = true;
      try {
        if (!await ton.isExtensionAvailableWithMinimalVersion()) {
          this.openInstallDialog();
        } else {
          await multisend.checkNetwork(this.server);
          await multisend.send(this.address, this.amount);
          this.disabled = true;
          this.successDialog = true;
        }
      } catch (e) {
        console.error(e);
        if (e.code !== 1000/*Canceled by user*/) {
          this.$snack.danger({text: undefined !== e.text ? e.text : 'Unknown error'})
        }
      } finally {
        this.loading = false;
      }
    },
    reload() {
      window.location.reload();
    }
  }
}
</script>

<style lang="scss">
</style>
