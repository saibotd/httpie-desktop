<template>
  <nav class="panel">
    <p class="panel-heading">
      <a v-if="backButton" @click="$emit('back')" class="back-button">
        <Icon i="chevron-left" :size="24"></Icon>
      </a>
      <span>{{ title }}</span>
      <span class="actions">
        <slot name="heading"></slot>
        <a
          v-if="quickCreate"
          class="add-button"
          @click="qcActive = !qcActive"
          title="Add"
        >
          <Icon i="plus-square" :size="24"></Icon>
        </a>
      </span>
    </p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          placeholder="Search"
          v-model="searchTerm"
        />
        <span class="icon is-left">
          <Icon i="search"></Icon>
        </span>
      </p>
      <slot name="after-search"></slot>
    </div>
    <form
      @submit.prevent="qcSubmit"
      class="panel-block is-active"
      v-if="qcActive"
    >
      <span class="panel-icon">
        <Icon i="file-plus"></Icon>
      </span>
      <input class="input" v-model="qcValue" ref="qcInput" />
    </form>
    <div class="items">
      <nuxt-link
        v-for="item in sortedFilteredItems"
        :key="item.id"
        :to="item.href"
        @click.native="$emit('select', item)"
        @contextmenu.native="handleContextClick($event, item)"
        :class="['panel-block', { 'is-active': item.active }]"
      >
        <span class="panel-icon" v-if="item.icon">
          <Icon :i="item.icon"></Icon>
        </span>
        <span class="tag is-info" v-if="item.tag">{{ item.tag }}</span>
        <span>{{ item.label }}</span>
      </nuxt-link>
      <vue-simple-context-menu
        :elementId="'vue-simple-context-menu'"
        v-if="contextOptions"
        :options="contextOptions"
        :ref="'vueSimpleContextMenu'"
        @option-clicked="contextOptionClicked"
      />
    </div>
  </nav>
</template>

<script>
import { orderBy } from "lodash";
import Icon from "~/components/Icon";

export default {
  components: {
    Icon
  },
  props: {
    title: String,
    items: Array,
    backButton: Boolean,
    quickCreate: Boolean,
    qcDefaultValue: String,
    contextOptions: Array
  },
  watch: {
    qcActive(state) {
      if (!state) return;
      this.qcValue = this.qcDefaultValue;
      setTimeout(() => {
        this.$refs.qcInput.focus();
        this.$refs.qcInput.select();
        this.$refs.qcInput.addEventListener("blur", () => {
          this.qcActive = false;
        });
      }, 1);
    }
  },
  data() {
    return {
      searchTerm: "",
      qcValue: "",
      qcActive: false
    };
  },
  computed: {
    sortedFilteredItems() {
      return orderBy(
        this.filteredItems,
        [item => item.label.toLowerCase()],
        ["asc"]
      );
    },
    filteredItems() {
      if (!this.searchTerm) return this.items;
      return this.items.filter(
        item =>
          item.label.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0
      );
    }
  },
  methods: {
    qcSubmit() {
      this.$emit("qc-submit", this.qcValue);
      this.qcActive = false;
    },
    handleContextClick(event, item) {
      if (!this.contextOptions || !this.$refs.vueSimpleContextMenu) return;
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },
    contextOptionClicked(event) {
      this.$emit("context-click", event);
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-heading {
  display: flex;
  justify-content: space-between;
  .back-button {
    margin-left: -10px;
  }
  .actions {
    display: flex;
    a {
      margin-left: 5px;
    }
  }
}
.tag {
  font-size: 70%;
  min-width: 4em;
  margin-right: 8px;
}
</style>
