<template>
  <portal to="modal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Project settings</p>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="_project.title" />
            </div>
          </div>
          <div class="field">
            <label class="label">Environment</label>

            <div class="control environment">
              <div class="row">
                <label>Key</label>
                <label>Value</label>
                <label>Actions</label>
              </div>
              <div class="row" v-for="(pair, i) in environment" :key="i">
                <input class="input" v-model="pair.key" />
                <input class="input" v-model="pair.value" />
                <div class="actions">
                  <a @click="copyEnvironmentRow(pair, i)" class="copy-button">
                    <Icon i="copy" :size="24"></Icon>
                  </a>
                  <a @click="deleteEnvironmentRow(i)" class="delete-button">
                    <Icon i="trash-2" :size="24"></Icon>
                  </a>
                </div>
              </div>
              <button
                class="button add-button is-small is-link is-outlined"
                @click="addEnvironmentRow()"
                title="Add"
              >
                <Icon i="plus-square" :size="18"></Icon>Add
              </button>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="save()">Save changes</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </portal>
</template>

<script>
import { clone } from "lodash";
import Icon from "~/components/Icon";

export default {
  components: {
    Icon
  },
  props: {
    project: Object
  },
  data() {
    return {
      _project: null,
      environment: []
    };
  },
  created() {
    this._project = clone(this.project);
    this.environment = this._project.environment || [];
  },
  methods: {
    addEnvironmentRow() {
      this.environment.push({
        key: "",
        value: ""
      });
    },
    deleteEnvironmentRow(index) {
      this.environment = this.environment.filter(
        (pair, _index) => index != _index
      );
    },
    copyEnvironmentRow(_pair, index) {
      const pair = clone(_pair);
      pair.key += "-copy";
      this.environment.splice(index + 1, 0, pair);
    },
    save() {
      this._project.environment = this.environment;
      this.$emit("save", this._project);
    }
  }
};
</script>

<style lang="scss" scoped>
.environment {
  .row {
    display: flex;
    margin-bottom: 5px;
    label {
      text-align: center;
      width: 100%;
      font-size: 80%;
    }
    > :first-child {
      width: 25%;
      margin-right: 5px;
    }
    > :last-child {
      width: 50px;
    }
    .actions {
      margin-left: 5px;
      display: flex;
      align-items: center;
      a {
        transform: scale(0.8);
      }
    }
  }
}
</style>
