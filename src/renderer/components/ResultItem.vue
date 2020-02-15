<template>
  <div class="result-item">
    <div class="inner" v-if="item.type == 'request' || item.type == 'header'">
      <pre><code>{{item.content}}</code></pre>
    </div>
    <div v-else>
      <div class="tabs">
        <ul>
          <li :class="{ 'is-active': tabIndex == 0 }">
            <a @click="tabIndex = 0">Preview</a>
          </li>
          <li :class="{ 'is-active': tabIndex == 1 }">
            <a @click="tabIndex = 1">Raw</a>
          </li>
        </ul>
      </div>
      <div v-if="tabIndex == 0">
        <iframe
          sandbox
          v-if="item.type == 'body' && typeof item.content == 'string'"
          :src="
            `data:text/html;charset=utf-8,${encodeURIComponent(item.content)}`
          "
        />
        <vue-json-pretty
          v-if="item.type == 'body' && typeof item.content != 'string'"
          :data="item.content"
        />
      </div>
      <div v-if="tabIndex == 1">
        <pre class="raw"><code>{{raw}}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  computed: {
    raw() {
      return typeof this.item.content != "string"
        ? JSON.stringify(this.item.content)
        : this.item.content;
    }
  }
};
</script>

<style lang="scss" scoped>
h4 {
  text-align: center;
}
iframe {
  display: block;
  width: 100%;
  background: white;
  height: 50vh;
}
.tabs {
  margin-bottom: 0;
}
.raw {
  max-height: 50vh;
}
</style>

<style lang="scss">
.result-item * {
  user-select: text;
}
</style>
