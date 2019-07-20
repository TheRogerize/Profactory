import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Logged user information
    user: {},
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    // Utils
    loading: false,
    host: 'https://profactory.herokuapp.com',
    authChecked: false,
    contentHeaders: { 'Content-type': 'Application/json' },
    notification: {
      status: false,
      message: ''
    },

    //amount
    amount: 500,
  },
  mutations: {
    closeNotification(state) {
      state.notification.status = false;
      state.notification.message = '';
    },
    openNotification(state, message) {
      state.notification.status = true;
      state.notification.message = message;
      setTimeout(() => this.commit('closeNotification'), 6000);
    },
    setUser(state, user) {
      state.user = user;
      state.username = user.username;
      localStorage.setItem('username', state.username);
    },
    setToken(state, token) {
      state.token = token;
    },
    logout(state) {
      state.token = '';
      state.username = '';
      state.user = {};
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    loading(state) {
      state.loading = true;
    },
    loaded(state) {
      state.loading = false;
    },
    authChecking(state) {
      state.authChecked = false;
    },
    authChecked(state) {
      state.authChecked = true;
    },
    updateAmount(state, value) {
      state.amount = value;
    }
  },
  getters: {
    isAuthenticated (state) {
      return !!state.username;
    },
    authHeaders(state) {
      return {
        'Content-type': 'Application/json',
        'Authorization': `token ${state.token}`
      }
    },
  },
  actions: {
    login({ commit }, loginData) {
      commit('loading');

      return new Promise((resolve, reject) => {
        const url = `${this.state.host}/users/login/`;
        axios.post(url, loginData, {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(resp => {
          JSON.stringify(resp)
          const user = resp.data.user;
          const token = resp.data.token;

          localStorage.setItem('token', token);
          localStorage.setItem('username', user.username);
          commit('setToken', token);
          commit('setUser', user);
          commit('loaded');

          resolve(resp);
        }).catch(err => {
          commit('loaded');
          reject(err);
        })
      })
    },
    checkLogin({ commit }) {
      /*
      * Fill user information from state if username and token exists
      */
      commit('authChecking');
      const username = this.state.username;
      const token = this.state.token;

      if (username.length > 0 && token.length > 0) {
        return new Promise((resolve, reject) => {
          const url = `${this.state.host}/users/${username}/`;

          axios.get(url, {
            headers: {
              'Content-type': 'Application/json',
              'Authorization': 'token ' + token
            }
          }).then(resp => {
            commit('setUser', resp.data);
            commit('authChecked');
            resolve(resp);
          }).catch(err => {
            commit('authChecked');
            reject(err);
          });
        })
      }
      commit('authChecked');
    },
    register({ commit }, registerData) {
      commit('loading');
      return new Promise((resolve, reject) => {
        const url = `${this.state.host}/users/signup/`;
        axios.post(url, registerData, {
          headers: {
            'Content-type': 'Application/json'
          }
        })
        .then(res => {
          commit('loaded');
          resolve(res);
        })
        .catch(err => {
          commit('loaded');
          reject(err);
        });
      })
    },
    updateUser({ commit }) {
      commit('loading');
      const url = `${this.state.host}/users/${this.state.username}/`;
      return new Promise((resolve, reject) => {
        axios.get(url, { headers: this.getters.authHeaders })
        .then(resp => {
          commit('setUser', resp.data);
          commit('loaded');
          resolve(resp);
        })
        .catch(err => {
          // commit('loaded');
          reject(err);
        });
      })
    }
  }
})
