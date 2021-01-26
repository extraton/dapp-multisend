<template>
  <div class="contract">
    <card-loading v-if="loading"/>
    <v-card v-else-if="isAddressNotFound">
      <v-card-text class="text-center text-h6 pa-15">
        <div>Contract not found or successfully executed.</div>
        <div>Check it in <a :href="explorerLink" target="_blank">explorer</a>.</div>
      </v-card-text>
    </v-card>
    <template v-else>
      <v-card>
        <v-card-title>
          <span>Deployed Contract</span>
          <v-spacer/>
          <share :link="window.location.href"/>
        </v-card-title>
        <v-card-text>
          <v-simple-table class="contract__info">
            <template v-slot:default>
              <tbody>
              <tr>
                <td>Address:</td>
                <td>
                  <addr :address="$route.params.address" :explorer="explorer"/>
                </td>
              </tr>
              <tr>
                <td>Network:</td>
                <td>{{ $route.params.server }}</td>
              </tr>
              <tr>
                <td>Balance:</td>
                <td>{{ ton.convertFromNanoToView(addressData.balance) }} TON</td>
              </tr>
              <tr>
                <td>Payees:</td>
                <td>{{ payees.length }}</td>
              </tr>
              <tr>
                <td>Total Amount:</td>
                <td>{{ ton.convertFromNanoToView(total) }} TON</td>
              </tr>
              <tr>
                <td>Refund Address:</td>
                <td>
                  <addr :address="refundAddr" :explorer="explorer"/>
                </td>
              </tr>
              <tr>
                <td>Destroying Locked Until:</td>
                <td>{{ destroyLockDate.toLocaleString() }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center ma-5">
            <distribute :server="$route.params.server" :address="$route.params.address" :amount="total"
                        :explorerLink="explorerLink"/>
          </div>
        </v-card-text>
        <v-card-actions>
          <replenish :server="$route.params.server" :address="$route.params.address"/>
          <v-spacer/>
          <destroy :server="$route.params.server" :address="$route.params.address" :destroyLockDate="destroyLockDate"/>
        </v-card-actions>
      </v-card>
      <payees-table :payees="payees" :total="total" class="contract__payees" title="Payees"/>
    </template>
  </div>
</template>

<script>
import multisend from "@/lib/multisend";
import ton from "@/lib/ton"
import PayeesTable from "@/components/PayeesTable";
import CardLoading from "@/components/CardLoading";
import Addr from "@/components/Addr";
import Distribute from "@/components/Distribute";
import Share from "@/components/Share";
import Destroy from "@/components/Destroy";
import Replenish from "@/components/Replenish";

export default {
  components: {Replenish, Destroy, Share, Distribute, Addr, PayeesTable, CardLoading},
  data: () => ({
    addressData: null,
    loading: true,
    isAddressNotFound: false,
    payees: [],
    refundAddr: null,
    destroyLockDate: null,
    total: '0',
    ton,
    window
  }),
  computed: {
    explorer() {
      switch (this.$route.params.server) {
        case 'main.ton.dev':
          return 'ton.live';
        case 'net.ton.dev':
          return 'net.ton.live';
        default:
          throw {text: 'Unknown Network'};
      }
    },
    explorerLink() {
      return `https://${this.explorer}/accounts/accountDetails?id=${this.$route.params.address}`;
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        this.addressData = await multisend.findAddressData(this.$route.params.server, this.$route.params.address);
        if (null === this.addressData || this.addressData.acc_type !== 1) {
          this.isAddressNotFound = true;
        } else {
          const data = await multisend.findData(this.$route.params.server, this.addressData);
          this.total = data['value0']['total'];
          this.payees = [];
          this.refundAddr = data['value0']['refundAddr'];
          this.destroyLockDate = new Date(parseInt(data['value0']['destroyLockTs'] + '000') + new Date().getTimezoneOffset());
          for (let i in data['value0']['addresses']) {
            this.payees.push({address: data['value0']['addresses'][i], amount: data['value0']['amounts'][i]});
          }
        }
      } catch (e) {
        console.error(e);
        if (e.code === 414/*Unknown Contract*/) {
          this.isAddressNotFound = true;
        } else {
          this.$snack.danger({text: e.toString()});
        }
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>

<style lang="scss">
.contract {
  &__payees {
    margin-top: 15px;
  }

  &__info {
    td:first-child {
      text-align: right;
      width: 50%;
    }

    td:last-child {
      text-align: left;
    }
  }
}
</style>
