<template>
  <portal to="modal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Settings</p>
          <button
            class="delete"
            aria-label="close"
            @click="$emit('close')"
          ></button>
        </header>
        <section class="modal-card-body" v-if="config">
          <fieldset>
            <div class="field">
              <label class="label">HTTPie executable</label>
              <div class="control">
                <input class="input" type="text" v-model="config.binPath" />
              </div>
            </div>
            <div class="field">
              <label class="label">
                <input type="checkbox" v-model="config.autoRun" />
                Autorun
              </label>
              <label class="label">
                <input type="checkbox" v-model="config.saveOnRun" />
                Save on run
              </label>
            </div>
          </fieldset>
          <fieldset>
            <div class="field">
              <label class="label">DB type</label>
              <div class="control">
                <div class="select">
                  <select v-model="config.connection.dbtype">
                    <option
                      v-for="option in dbtypes"
                      :key="option.value"
                      :value="option.value"
                      >{{ option.label }}</option
                    >
                  </select>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset v-if="config.connection.dbtype == 'sqljs'">
            <div class="field">
              <label class="label">File name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="config.sqljs.location"
                />
              </div>
            </div>
          </fieldset>
          <fieldset v-if="config.connection.dbtype == 'mysql'">
            <div class="field">
              <label class="label">Host</label>
              <div class="control">
                <input class="input" type="text" v-model="config.mysql.host" />
              </div>
            </div>
            <div class="field">
              <label class="label">Port</label>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  v-model="config.mysql.port"
                  placeholder="3306"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="config.mysql.database"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="config.mysql.username"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="config.mysql.password"
                />
              </div>
            </div>
          </fieldset>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="save()">
            Save changes
          </button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </footer>
      </div>
    </div>
  </portal>
</template>

<script>
import { cloneDeep } from "lodash";
import ipc from "~/lib/ipc";

export default {
  async created() {
    await this.$store.dispatch("App/INIT");
    this.config = cloneDeep(this.$store.state.App.config);
  },
  data() {
    return {
      config: null,
      dbtypes: [
        { value: "sqljs", label: "SQLite" },
        { value: "mysql", label: "MySQL" }
      ]
    };
  },
  methods: {
    change(legend, key, value) {
      this.config[legend][key] = value;
    },
    async save() {
      this.$store.commit("App/setConfig", this.config);
      this.config = cloneDeep(this.$store.state.App.config);
      const restart = confirm(
        "Changes to the DB settings require a restart. Restart now?"
      );
      if (restart) await ipc.callMain("post:relaunch");
      else this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
fieldset {
  margin-bottom: 10px;
}
</style>
