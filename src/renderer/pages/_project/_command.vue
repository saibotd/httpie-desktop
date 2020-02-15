<template>
  <splitpanes :push-other-panes="false" v-if="command">
    <pane>
      <div class="wrap">
        <div class="buttons">
          <div class="field has-addons">
            <p class="control">
              <button
                :class="['button', { 'is-dark': saved, 'is-warning': !saved }]"
                @click="save()"
              >
                <i class="icon-disc" aria-hidden="true"></i>
                <Icon i="save"></Icon>Save
              </button>
            </p>
            <p class="control">
              <button class="button is-primary" @click="run()">
                <Icon i="send"></Icon>
                {{ $store.state.App.config.saveOnRun ? "Save & Run" : "Run" }}
              </button>
            </p>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <textarea-autosize
              ref="textarea"
              class="textarea"
              :min-height="5"
              v-model="command.args"
            ></textarea-autosize>
            <div class="variables" v-if="project.environment && project.environment.length">
              <span
                class="tag is-dark"
                v-for="item in project.environment"
                :key="item.key"
                :title="item.value"
                @click="insertVariable(item.key)"
              >{{ item.key }}</span>
            </div>
            <label>
              <input type="checkbox" :checked="followRedirects" @change="toggleFollowRedirects" />
              Follow redirects
            </label>
          </div>
        </div>
      </div>
    </pane>
    <pane>
      <CommandResult :commandResult="commandResult" :parsedOutput="parsedOutput" />
    </pane>
  </splitpanes>
</template>

<script>
import ipc from "~/lib/ipc";
import parseHttPieOutput from "~/lib/parseHttPieOutput";
import Icon from "~/components/Icon";
import CommandResult from "~/components/CommandResult";

export default {
  components: {
    Icon,
    CommandResult
  },
  props: {
    project: Object
  },
  data() {
    return {
      command: null,
      commandResult: null,
      saved: true
    };
  },
  head() {
    return {
      title: this.windowTitle
    };
  },
  async created() {
    await this.load();
    await this.autoRun();
  },
  watch: {
    "$route.params": {
      async handler(params) {
        await this.load();
        await this.autoRun();
      }
    },
    "command.args": {
      handler(newValue, oldValue) {
        if (!oldValue) return;
        this.saved = newValue == oldValue;
      },
      deep: true
    }
  },
  computed: {
    parsedOutput() {
      if (!this.commandResult) return null;
      return parseHttPieOutput(this.commandResult.out);
    },
    args() {
      if (!this.command || !this.command.args) return "";
      let args = this.command.args;
      if (!this.project.environment) return args;
      this.project.environment.forEach(item => {
        const replace = `{${item.key}}`;
        while (args.indexOf(replace) > 0)
          args = args.replace(replace, item.value);
      });
      return args;
    },
    followRedirects() {
      if (!this.args) return false;
      return this.args.indexOf("--follow") >= 0;
    },
    windowTitle() {
      if (this.command)
        return `${this.command.title} - ${this.project.title} - HTTPie`;
      return `${this.project.title} - HTTPie`;
    }
  },
  methods: {
    async load(params = this.$route.params) {
      this.commandResult = null;
      if (!params.command) return (this.command = null);
      this.command = await ipc.callMain("get:command", params.command);
      this.saved = true;
    },
    async run(saveOnRun = true) {
      this.commandResult = null;
      this.commandResult = await ipc.callMain("post:command/run", this.args);
      if (saveOnRun && this.$store.state.App.config.saveOnRun) this.save();
    },
    async save() {
      this.command = await ipc.callMain("post:command", this.command);
      this.saved = true;
    },
    async autoRun() {
      if (
        this.$store.state.App.config.autoRun &&
        this.args.toLowerCase().indexOf("http") >= 0
      )
        await this.run(false);
    },
    insertVariable(variableName) {
      this.$refs.textarea.$el.focus();
      document.execCommand("insertText", false, `{${variableName}}`);
    },
    toggleFollowRedirects() {
      if (this.followRedirects)
        this.command.args = this.command.args.replace("--follow", "");
      else
        this.command.args = (this.command.args + "\n--follow").replace(
          /\n\s*\n/g,
          "\n"
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  font-family: monospace;
  &.is-warning {
    color: black;
  }
}
.variables {
  margin: 5px -2px;
  display: flex;
  flex-wrap: wrap;
  h2 {
    margin: 2px 0;
    opacity: 0.6;
  }
  .tag {
    margin: 2px;
  }
}

h5 {
  font-family: monospace;
}
.buttons {
  float: right;
}

.splitpanes--vertical > .splitpanes__pane {
  max-height: 100vh;
  overflow: auto;
}
</style>
