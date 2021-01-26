<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" v-clipboard="link" @click="$snack.success({text: 'Copied'})" icon>
        <v-icon>mdi-link-variant</v-icon>
      </v-btn>
    </template>
    <span>Copy Link</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {link: String},
}
</script>
