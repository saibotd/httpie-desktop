<template>
  <i ref="target" class="feather-icon" aria-hidden="true"></i>
</template>

<script>
import feather from "feather-icons";

export default {
  props: {
    i: String,
    size: Number
  },
  mounted() {
    feather.replace();
    this.$refs.target.innerHTML = feather.icons[this.i].toSvg({
      "stroke-width": 1,
      width: this.size || 20,
      height: this.size || 20
    });
  }
};
</script>

<style lang="scss" scoped>
i {
  display: flex;
  justify-content: center;
  min-width: 20px;
}
</style>