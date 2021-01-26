<template>
  <div class="addPayeesByForm">
    <v-form v-model="valid" ref="form">
      <v-card v-for="(item,i) in payees" :key="i" class="addPayeesByForm__item" flat outlined>
        <v-card-text class="d-table">
          <div class="addPayeesByForm__item__index d-table-cell text-subtitle-1">
            {{ i + 1 }}
          </div>
          <div class="d-table-cell">
            <v-text-field v-model="payees[i].address" :rules="[rules.required,rules.address,isDuplicateAddress]"
                          label="Address"/>
          </div>
          <div class="addPayeesByForm__item__amount d-table-cell">
            <v-text-field v-model="payees[i].amount" :rules="[rules.required,rules.positive, rules.precision, rules.max]"
                          type="number" label="Amount"/>
          </div>
        </v-card-text>
        <v-btn v-if="payees.length>2" @click="$delete(payees,i)" color="error" absolute bottom right fab small>
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </v-card>
    </v-form>
    <div class="text-center ma-5">
      <v-btn v-if="payees.length<100" @click="add" bottom fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-card-actions>
      <div class="error--text" style="padding-left:8px">{{ error }}</div>
      <v-spacer/>
      <span class="addPayeesByForm__total text-h6">Total: {{ total }} TON</span>
      <v-btn @click="create" color="primary">
        <v-icon left>mdi-hand-okay</v-icon>
        Create
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
      address: value => /^0:[a-f0-9]{64}$/i.test(value) || 'Incorrect address.',
      positive: value => (new BigNumber(value)).isGreaterThan(new BigNumber(0)) || 'Should be positive value.',
      max: value => (new BigNumber(value)).isLessThanOrEqualTo(new BigNumber('1000000000')) || 'Too big.',
      precision: value => (new BigNumber(value)).dp() < 10 || 'Max decimal places is 9.',
    },
    payees: [
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf00', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf01', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf02', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf03', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf04', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf05', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf06', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf07', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf08', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf09', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf10', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf11', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf12', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf13', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf14', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf15', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf16', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf17', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf18', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf19', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf20', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf21', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf22', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf23', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf24', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf25', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf26', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf27', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf28', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf29', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf30', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf31', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf32', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf33', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf34', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf35', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf36', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf37', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf38', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf39', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf40', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf41', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf42', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf43', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf44', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf45', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf46', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf47', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf48', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf49', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf50', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf51', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf52', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf53', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf54', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf55', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf56', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf57', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf58', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf59', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf60', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf61', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf62', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf63', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf64', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf65', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf66', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf67', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf68', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf69', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf70', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf71', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf72', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf73', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf74', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf75', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf76', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf77', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf78', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf79', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf80', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf81', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf82', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf83', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf84', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf85', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf86', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf87', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf88', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf89', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf90', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf91', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf92', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf93', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf94', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf95', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf96', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf97', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf98', amount: '0.01'},
      {address: '0:9d07045458ac2c9b8201b47aaeb1c115ce8d2759ed8291ef30fbea75ae1adf99', amount: '0.01'},
    ],
    valid: true,
    error: null,
    total: 0,
  }),
  mounted() {
    for (let i = 0; i < 3; i++) {
      this.add();
    }
  },
  watch: {
    payees: {
      handler() {
        let total = new BigNumber(0);
        for (const item of this.payees) {
          const amount = new BigNumber(item.amount);
          if (!amount.isNaN()) {
            total = total.plus(amount);
          }
        }
        this.total = total.toString();
      },
      deep: true,
    }
  },
  methods: {
    add() {
      this.payees.push({address: '', amount: ''});
    },
    async create() {
      this.error = null;
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit('create', this.payees);
      } else {
        this.error = 'Some fields are incorrect.';
      }
    },
    isDuplicateAddress(value) {
      const matchesNum = this.payees.filter((item) => {
        return item.address.toLowerCase() === value.toLowerCase();
      }).length;
      return matchesNum === 1 ? true : 'Duplicate address';
    }
  },
}
</script>

<style lang="scss">
.addPayeesByForm {
  &__item {
    margin: 30px 15px;

    .d-table {
      width: 100%;
    }

    &__index {
      width: 25px;
    }

    &__amount {
      padding-left: 20px;
      width: 30%;
    }
  }

  &__total {
    margin-right: 15px;
  }
}
</style>
