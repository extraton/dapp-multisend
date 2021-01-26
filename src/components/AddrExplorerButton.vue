<template>
  <v-tooltip v-if="link" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :href="link" target="_blank" icon small>
        <v-icon small>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
    <span>Open in explorer</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    link: String,
  },
}
</script>
