/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  mode: "spa", // or 'universal'
  router: {
    linkActiveClass: "is-active"
  },
  head: {
    title: "HTTPie"
  },
  loading: false,
  plugins: [
    { src: "~/plugins/splitpanes", mode: "client" },
    { src: "~/plugins/vue-json-pretty", mode: "client" },
    { src: "~/plugins/textarea-autosize", mode: "client" },
    { src: "~/plugins/click-outside", mode: "client" },
    { src: "~/plugins/context-menu", mode: "client" }
  ],
  buildModules: [],
  modules: ["portal-vue/nuxt"],
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
