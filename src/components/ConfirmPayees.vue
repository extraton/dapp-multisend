<template>
  <payees-table title="Confirm Payees" :payees="payees" :total="total">
    <template v-slot:toolbar-right-corner>
      <v-btn @click="cancel" color="error" small>
        <v-icon left>mdi-delete</v-icon>
        Cancel
      </v-btn>
    </template>
    <template v-slot:bottom>
      <div class="text-center pa-5">
        <v-card flat outlined>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-text-field v-model="refundAddress" :rules="[rules.required,rules.address]" label="Refund Address"/>
            </v-form>
          </v-card-text>
        </v-card>
        <div style="margin-top:30px">
          <v-btn @click="confirm" :loading="isConfirming" color="primary">
            <v-icon left>mdi-hand-okay</v-icon>
            Confirm and Deploy
          </v-btn>
        </div>
        <div class="text--secondary">
          1 TON + fee
        </div>
      </div>
    </template>
  </payees-table>
</template>

<script>
import ton from '@/lib/ton';
import {mapMutations} from "vuex";
import {payeeRepository} from "@/db/repository/payeeRepository";
import multisend from "@/lib/multisend";
import PayeesTable from "@/components/PayeesTable";

export default {
  components: {PayeesTable},
  props: {payees: Array, total: String},
  data: () => ({
    headers: [
      {text: '#', align: 'center', sortable: false, filterable: false,},
      {text: 'Address', value: 'address', sortable: false, filterable: false,},
      {text: 'Amount', value: 'amount', sortable: true, filterable: false,},
    ],
    isConfirming: false,
    rules: {
      required: value => !!value || 'Required.',
      address: value => /^0:[a-f0-9]{64}$/i.test(value) || 'Incorrect address.',
    },
    refundAddress: '',
    valid: true,
    ton,
  }),
  methods: {
    ...mapMutations('extension', [
      'openInstallDialog',
    ]),
    async confirm() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.isConfirming = true;
      try {
        if (!await ton.isExtensionAvailableWithMinimalVersion()) {
          this.openInstallDialog();
        } else {
          const network = await ton.getNetwork();
          const server = this.getServer(network);
          const contract = await multisend.deploy(this.payees, this.refundAddress);
          await payeeRepository.truncate();
          await this.$router.push({name: 'contract', params: {address: contract.address, server}});
        }
      } catch (e) {
        console.error(e);
        if (e.code !== 1000/*Canceled by user*/) {
          this.$snack.danger({text: undefined !== e.text ? e.text : 'Unknown error'})
        }
      } finally {
        this.isConfirming = false;
      }
    },
    cancel() {
      payeeRepository.truncate();
      this.$emit('canceled');
    },
    getServer(network) {
      switch (network.id) {
        case 1:
          return 'main.ton.dev';
        case 2:
          return 'net.ton.dev';
        default:
          throw {text: 'Unknown Network'};
      }
    }
  },
}
</script>

<style lang="scss">
.confirmPayees {
  .d-table-cell {
    padding: 0 3px;
  }
}
</style>
