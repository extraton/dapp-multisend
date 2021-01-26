<template>
  <div>
    <confirm-payees v-if="payees.length>0" @canceled="refreshPayees" :payees="payees" :total="total"/>
    <add-payees v-else @created="refreshPayees"/>
  </div>
</template>

<script>
import AddPayees from "@/components/AddPayees";
import ConfirmPayees from "@/components/ConfirmPayees";
import BigNumber from 'bignumber.js';
import {payeeRepository} from "@/db/repository/payeeRepository";

export default {
  components: {AddPayees, ConfirmPayees},
  data: () => ({
    total: '0',
    payees: [],
  }),
  mounted() {
    this.refreshPayees();
  },
  methods: {
    async refreshPayees() {
      this.payees = await payeeRepository.getAll();
      let total = new BigNumber('0');
      for (let payee of this.payees) {
        total = total.plus(new BigNumber(payee.amount));
      }
      this.total = total.toString();
    }
  },
}
</script>
<style lang="scss">
.home {
}
</style>
