<template>
  <div>
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>
          Replenished
        </v-card-title>
        <v-card-text>
          Refresh page after a while.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="reload" color="primary" text>Refresh Page</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn @click="replenish" :loading="loading" :disabled="disabled" color="primary" text small>
      Replenish
    </v-btn>
  </div>
</template>

<script>
import multisend from "@/lib/multisend";
import ton from "@/lib/ton";
import {mapMutations} from "vuex";

export default {
  props: {server: String, address: String, destroyLockDate: Date},
  data: () => ({
    loading: false,
    successDialog: false,
  }),
  computed: {
    disabled() {
      return new Date() < this.destroyLockDate;
    }
  },
  methods: {
    ...mapMutations('extension', [
      'openInstallDialog',
    ]),
    async replenish() {
      this.loading = true;
      try {
        if (!await ton.isExtensionAvailableWithMinimalVersion()) {
          this.openInstallDialog();
        } else {
          await multisend.checkNetwork(this.server);
          await multisend.replenish(this.address);
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
