<template>
  <splitpanes v-if="project">
    <pane size="30" min-size="10">
      <FilterPanel
        :items="panelItems"
        :title="project.title"
        backButton
        quickCreate
        qcDefaultValue="New Command"
        :contextOptions="[
          { name: 'Duplicate', value: 'duplicate' },
          { name: 'Delete', value: 'delete' }
        ]"
        @qc-submit="createCommand"
        @back="$store.commit('App/toggleShowProjects', true)"
        @context-click="onItemContextClick"
      >
        <template v-slot:heading>
          <a
            class="settings-button"
            @click="showSettingsModal = true"
            title="Settings"
          >
            <Icon i="settings" :size="24"></Icon>
          </a>
        </template>
      </FilterPanel>
    </pane>
    <pane size="70">
      <nuxt-child :project="project" />
      <ProjectSettingsModal
        v-if="showSettingsModal"
        :project="project"
        @close="showSettingsModal = false"
        @save="saveSettings"
      />
    </pane>
  </splitpanes>
</template>

<script>
import ipc from "~/lib/ipc";
import Icon from "~/components/Icon";
import httpMethods from "~/lib/httpMethods";
import FilterPanel from "~/components/FilterPanel";
import ProjectSettingsModal from "~/components/ProjectSettingsModal";

export default {
  components: { FilterPanel, Icon, ProjectSettingsModal },
  data() {
    return {
      project: null,
      commands: [],
      showSettingsModal: false
    };
  },
  async fetch({ store, params }) {
    await store.dispatch("App/INIT");
  },
  async created() {
    await this.loadProject(this.$route.params.project);
    this.loadCommands();
  },
  head() {
    return {
      title: this.windowTitle
    };
  },
  computed: {
    panelItems() {
      return this.commands.map(command => {
        return {
          label: command.title,
          href: `/${this.project.id}/${command.id}`,
          tag: this.methodType(command.args),
          command
        };
      });
    },
    windowTitle() {
      if (this.project) return `${this.project.title} - HTTPie`;
      return "HTTPie";
    }
  },
  methods: {
    methodType(args) {
      let type = "GET";
      httpMethods.some(m => {
        if (args.indexOf(m) >= 0) {
          type = m;
          return true;
        }
        return false;
      });
      return type;
    },
    async loadProject(id) {
      this.project = await ipc.callMain("get:project", id);
    },
    async loadCommands() {
      this.commands = await ipc.callMain("get:commands", this.project.id);
    },
    async createCommand(title, args = "--follow\nGET\n") {
      const command = await ipc.callMain("put:command", {
        title,
        args,
        project: this.project.id
      });
      this.commands.push(command);
      this.$router.push(`/${this.project.id}/${command.id}`);
      this.loadCommands();
    },
    async deleteCommand(id) {
      const command = await ipc.callMain("delete:command", {
        id
      });
      if (this.$route.params.command && this.$route.params.command == id)
        this.$router.replace(`/${this.project.id}`);
      await this.loadCommands();
    },
    async saveSettings({ id, title, environment }) {
      this.project = await ipc.callMain("post:project", {
        id,
        title,
        environment
      });
      this.loadProject(id);
      this.showSettingsModal = false;
    },
    back() {
      this.$router.replace("/projects");
    },
    async onItemContextClick(event) {
      console.log(event);
      switch (event.option.value) {
        case "duplicate":
          return await this.createCommand(
            `${event.item.command.title} (copy)`,
            event.item.command.args
          );
        case "delete":
          return await this.deleteCommand(event.item.command.id);
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.splitpanes--vertical > .splitpanes__pane:first-child {
  max-height: 100vh;
  overflow: auto;
}
</style>
