import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 1,
        id: null,
        userName:null,
        roleId:null,
        roleName:null
    },
    mutations: {
        increment(state){
            state.count++;
        },
        reset(state){
          state.count=1;
          state.id=null;
          state.userName=null;
        }
    }
})
