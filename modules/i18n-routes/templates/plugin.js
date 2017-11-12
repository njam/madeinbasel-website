import Vue from 'vue'
import VueI18n from 'vue-i18n'
import './i18n-routes.middleware'

Vue.use(VueI18n)

export default ({app, store}) => {
  registerStoreModule(store, 'i18n-routes', {
    namespaced: true,
    state: () => ({
      language: null
    }),
    mutations: {
      setLanguage (state, language) {
        if (options.languages.indexOf(language) === -1) {
          throw new Error('Invalid language: ' + language)
        }
        state.language = language
        app.i18n.locale = language
      }
    }
  })

  let messages = {}
  options.languages.forEach((lang) => {
    messages[lang] = require('~/assets/locale/' + lang + '.json')
  })
  app.i18n = new VueI18n({
    locale: store.state['i18n-routes'].language,
    fallbackLocale: options.languages[0],
    messages: messages,
    silentTranslationWarn: true
  })


  let mixinMethods = {
    localePath: function (url) {
      return '/' + store.state['i18n-routes'].language + url
    },
    detectLanguage: function () {
      let languageList = []
      if (typeof navigator !== 'undefined') {
        if (navigator.userLanguage) {
          languageList.unshift(navigator.userLanguage.substring(0, 2))
        }
        if (navigator.language) {
          languageList.unshift(navigator.language.substring(0, 2))
        }
      }
      let language = languageList.find((language) => {
        return (options.languages.indexOf(language) !== -1)
      })
      return language || options.languages[0]
    }
  }
  Vue.use({
    install (app) {
      app.mixin({
        methods: mixinMethods
      })
    }
  })
}

function registerStoreModule (store, name, definition) {
  // See https://github.com/vuejs/vuex/issues/789#issuecomment-305241136
  if (store.state[name]) {
    const currentState = store.state[name]
    const moduleState = definition.state
    definition.state = () => {
      definition.state = moduleState
      return currentState
    }
  }
  store.registerModule(name, definition)
}

const options = <%= serialize(options) %>