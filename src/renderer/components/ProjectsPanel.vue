<template>
  <FilterPanel
    :items="panelItems"
    title="Projects"
    quickCreate
    qcDefaultValue="New Project"
    @select="project => $emit('select', project)"
    @qc-submit="createProject"
    :contextOptions="[
      { name: 'Duplicate', value: 'duplicate' },
      { name: 'Delete', value: 'delete' }
    ]"
    @context-click="onItemContextClick"
  />
</template>

<script>
import ipc from "~/lib/ipc";
import FilterPanel from "~/components/FilterPanel";

export default {
  data() {
    return {
      projects: []
    };
  },
  created() {
    this.loadProjects();
  },
  components: { FilterPanel },
  computed: {
    panelItems() {
      return this.projects.map(project => {
        return {
          label: project.title,
          href: `/${project.id}`,
          project
        };
      });
    }
  },
  methods: {
    async createProject(title, id = null) {
      if (id) await ipc.callMain("put:project/clone", { title, id });
      else await ipc.callMain("put:project", { title });
      await this.loadProjects();
    },
    async loadProjects() {
      this.projects = await ipc.callMain("get:projects");
    },
    async deleteProject(id) {
      const project = await ipc.callMain("delete:project", {
        id
      });
      if (this.$route.params.project && this.$route.params.project == id)
        this.$router.replace("/");
      await this.loadProjects();
    },
    async onItemContextClick(event) {
      console.log(event);
      switch (event.option.value) {
        case "duplicate":
          return await this.createProject(
            `${event.item.project.title} (copy)`,
            event.item.project.id
          );
        case "delete":
          return await this.deleteProject(event.item.project.id);
          break;
      }
    }
  }
};
</script>
