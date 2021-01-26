<template>
  <v-card>
    <v-card-title>Add Payees</v-card-title>
    <v-tabs
      v-model="tab"
      centered
      icons-and-text
      fixed-tabs
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#by-form">
        By Form
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-tab>
      <v-tab href="#from-csv-file">
        From CSV File
        <v-icon>mdi-file-delimited</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="by-form">
        <add-payees-by-form @create="create"/>
      </v-tab-item>
      <v-tab-item value="from-csv-file">
        <add-payees-from-csv-file/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import AddPayeesByForm from "@/components/AddPayeesByForm";
import AddPayeesFromCsvFile from "@/components/AddPayeesFromCsvFile";
import ton from "@/lib/ton";
import {payeeRepository} from "@/db/repository/payeeRepository";

export default {
  components: {AddPayeesFromCsvFile, AddPayeesByForm},
  data: () => ({
    tab: null,
  }),
  methods: {
    create(items) {
      let payees = [];
      for (const item of items) {
        const address = item.address.toLowerCase();
        const amount = ton.convertToNano(item.amount);
        payees.push({address, amount});
      }
      payeeRepository.bulkAdd(payees);

      this.$emit('created');
    }
  },
}
</script>

<style lang="scss">
.addPayees {
}
</style>
