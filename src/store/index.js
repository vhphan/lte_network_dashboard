import Vue from 'vue'
import Vuex from 'vuex'

import edb from './modules/edb'
import error from './modules/error'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    edb,
    error,
  }
})