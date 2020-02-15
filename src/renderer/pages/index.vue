<template>
  <div class="container">
    <div class="quicklaunch">
      <nav>
        <a @click.prevent="$store.commit('App/toggleShowProjects', true)">
          Open Projects
        </a>
      </nav>
    </div>
    <div class="pie">
      <img src="../assets/pie.svg" />
    </div>
  </div>
</template>

<script>
import ProjectsPanel from "~/components/ProjectsPanel";
import ipc from "~/lib/ipc";

export default {
  mounted() {
    this.$store.commit("App/toggleShowProjects", true);
  },
  components: { ProjectsPanel },
  async fetch({ store, params }) {
    await store.dispatch("App/INIT");
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.pie {
  position: absolute;
  right: 0;
  bottom: 0;
  img {
    opacity: 0.5;
    margin: 25px;
    width: 150px;
    max-width: 100%;
  }
}
</style>
