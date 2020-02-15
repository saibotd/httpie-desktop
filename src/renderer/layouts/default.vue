<template>
  <div class="app-container">
    <transition name="projects-trans">
      <div
        class="projects-overlay"
        v-if="$store.state.App.showProjects"
        @click.self="$store.commit('App/toggleShowProjects', false)"
      >
        <div class="projects-menu">
          <ProjectsPanel
            @select="$store.commit('App/toggleShowProjects', false)"
          />
        </div>
      </div>
    </transition>
    <splitpanes>
      <pane size="100">
        <nuxt />
      </pane>
    </splitpanes>
    <portal-target name="modal"></portal-target>
    <SettingsModal
      v-if="showSettingsModal"
      @close="showSettingsModal = false"
    ></SettingsModal>
  </div>
</template>

<script>
import ipc from "~/lib/ipc";
import SettingsModal from "~/components/SettingsModal";
import ProjectsPanel from "~/components/ProjectsPanel";

export default {
  components: {
    SettingsModal,
    ProjectsPanel
  },
  data() {
    return {
      showSettingsModal: false
    };
  },
  mounted() {
    ipc.answerMain("get:projects", () => {
      this.$store.commit("App/toggleShowProjects", true);
      this.showSettingsModal = false;
    });
    ipc.answerMain("get:settings", () => {
      this.showSettingsModal = true;
    });
  }
};
</script>

<style lang="scss">
@import "~/assets/theme.scss";
.app-container {
  height: 100vh;
}
.projects-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 10;
  min-height: 100vh;
  background: rgba($color: #000000, $alpha: 0.5);

  .projects-menu {
    width: 30%;
    overflow: auto;
    max-width: 400px;
    max-height: 100vh;
    min-height: 100vh;
    background: #363636;
    transition: transform 0.3s;
  }
}
.projects-trans-enter-active,
.projects-trans-leave-active {
  transition: opacity 0.2s;
}
.projects-trans-enter, .projects-trans-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  .projects-menu {
    transform: translateX(-100%);
  }
}
</style>

<style lang="scss" scoped>
.splitpanes--vertical > .splitpanes__pane:first-child {
  max-height: 100vh;
  overflow: auto;
}
</style>
