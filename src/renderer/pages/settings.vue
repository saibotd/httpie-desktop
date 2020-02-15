<template>
  <form class="wrap" @submit.prevent="save()">
    <fieldset>
      <legend>Connection</legend>
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
    <fieldset v-if="config.connection.dbtype == 'sqlite'">
      <legend>SQLite</legend>
      <div class="field">
        <label class="label">File name</label>
        <div class="control">
          <input class="input" type="text" v-model="config.sqlite.dbname" />
        </div>
      </div>
    </fieldset>
    <fieldset v-if="config.connection.dbtype == 'mysql'">
      <legend>MySQL</legend>
      <div class="field">
        <label class="label">Host</label>
        <div class="control">
          <input class="input" type="text" v-model="config.mysql.dbhost" />
        </div>
      </div>
      <div class="field">
        <label class="label">Port</label>
        <div class="control">
          <input
            class="input"
            type="number"
            v-model="config.mysql.dbport"
            placeholder="3306"
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" type="text" v-model="config.mysql.dbname" />
        </div>
      </div>
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input class="input" type="text" v-model="config.mysql.dbuser" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="text" v-model="config.mysql.dbpass" />
        </div>
      </div>
    </fieldset>
    <button class="button is-primary">Save changes</button>
  </form>
</template>

<script>
import { cloneDeep } from "lodash";
import ipc from "~/lib/ipc";

export default {
  async fetch({ store, params }) {
    await store.dispatch("App/INIT");
  },
  created() {
    this.config = cloneDeep(this.$store.state.App.config);
  },
  data() {
    return {
      config: {},
      dbtypes: [
        { value: "sqlite", label: "SQLite" },
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
      const r = await ipc.callMain("post:relaunch");
      console.log(r);
    }
  }
};
</script>
