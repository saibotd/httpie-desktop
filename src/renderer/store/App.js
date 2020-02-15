import ipc from "~/lib/ipc";

export const state = () => ({
  config: {},
  showProjects: false
});

export const mutations = {
  setConfig(state, config) {
    state.config = config;
    ipc.callMain("post:config", config);
  },
  toggleShowProjects(state, show = null) {
    if (show === null) show = !state.showProjects;
    state.showProjects = show;
  }
};

export const getters = {};

export const actions = {
  async INIT({ commit }) {
    const config = await ipc.callMain("get:config");
    commit("setConfig", config);
  }
};
