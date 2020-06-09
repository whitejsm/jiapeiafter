import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 1,
        id: null,
        userName:null
    },
    mutations: {
        increment(state){
            state.count++;
        }
    }
})
