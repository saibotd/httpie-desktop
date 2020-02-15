<template>
  <div v-if="commandResult">
    <div v-if="commandResult.err" class="notification is-warning">
      {{ commandResult.err }}
    </div>
    <bulma-accordion
      :slide="{ duration: '200ms', timerFunc: 'ease' }"
      dropdown
      :initialOpenItem="parsedOutput.length ? parsedOutput.length : null"
    >
      <bulma-accordion-item v-for="(item, i) in parsedOutput" :key="i">
        <h5 class="title is-6 has-text-weight-normal" slot="title">
          <span class="tag is-dark">{{ i + 1 }}.</span>
          {{ item.type }}
        </h5>
        <ResultItem slot="content" :item="item" />
      </bulma-accordion-item>
    </bulma-accordion>
  </div>
  <div class="wrap pie" v-else>
    <img src="../assets/pie.svg" />
  </div>
</template>

<script>
import ResultItem from "./ResultItem";
import { BulmaAccordion, BulmaAccordionItem } from "vue-bulma-accordion";

export default {
  components: {
    ResultItem,
    BulmaAccordion,
    BulmaAccordionItem
  },
  props: {
    commandResult: Object,
    parsedOutput: Array
  }
};
</script>

<style lang="scss" scoped>
.pie {
  height: 100%;
  display: flex;
  align-content: center;

  img {
    opacity: 0.5;
    margin: auto;
    width: 150px;
    max-width: 100%;
  }
}
</style>
