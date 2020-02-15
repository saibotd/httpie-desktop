<template>
  <portal to="modal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Projects</p>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <ProjectsPanel @select="$emit('close')" />
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </portal>
</template>

<script>
import { cloneDeep } from "lodash";
import ipc from "~/lib/ipc";
import ProjectsPanel from "./ProjectsPanel";

export default {
  components: {
    ProjectsPanel
  }
};
</script>

<style lang="scss" scoped>
.modal-card-body {
  padding: 10px;
}
</style>
