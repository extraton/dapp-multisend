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
    payees: [],
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
