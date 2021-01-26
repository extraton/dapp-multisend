<template>
  <v-data-table
    :headers="headers"
    :items="payees"
    :mobile-breakpoint="100"
    :items-per-page="1000"
    :sort-by="['amount']"
    :sort-desc="['desc']"
    hide-default-footer
  >
    <template v-slot:top>
      <slot name="top">
        <v-toolbar color="transparent" flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer/>
          <slot name="toolbar-right-corner"/>
        </v-toolbar>
      </slot>
    </template>
    <template v-slot:item="{item, index}">
      <tr>
        <td class="text-center">{{ index + 1 }}</td>
        <td>{{ item.address }}</td>
        <td>{{ ton.convertFromNanoToView(item.amount) }}</td>
      </tr>
    </template>
    <template v-slot:footer>
      <div class="text-end text-h6 pa-3">Total: {{ ton.convertFromNanoToView(total) }} TON</div>
      <slot name="bottom"/>
    </template>
  </v-data-table>
</template>

<script>
import ton from '@/lib/ton';

export default {
  props: {title: String, payees: Array, total: String},
  data: () => ({
    headers: [
      {text: '#', align: 'center', sortable: false, filterable: false,},
      {text: 'Address', value: 'address', sortable: false, filterable: false,},
      {text: 'Amount', value: 'amount', sortable: true, filterable: false,},
    ],
    isConfirming: false,
    ton,
  }),
}
</script>

<style lang="scss">
</style>
