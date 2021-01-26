<template>
  <div class="addr">
    <div>
      <addr-copy-button :address="address"/>
    </div>

    <div>
      <span class="text-overline">
        {{ address.substr(0, 8) }}...{{ address.substr(-6) }}
      </span>
    </div>

    <div>
      <addr-explorer-button :link="link"/>
    </div>
  </div>
</template>

<script>
import AddrCopyButton from "@/components/AddrCopyButton";
import AddrExplorerButton from "@/components/AddrExplorerButton";

export default {
  components: {AddrExplorerButton, AddrCopyButton},
  props: {address: String, explorer: String},
  computed: {
    link() {
      return `https://${this.explorer}/accounts/accountDetails?id=${this.address}`;
    }
  },
}
</script>

<style lang="scss">
.addr {
  display: flex;
  align-items: center;

  &__name a {
    text-decoration: none;
  }
}
</style>
