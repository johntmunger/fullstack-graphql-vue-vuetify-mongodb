import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import FormAlert from './components/Shared/FormAlert.vue';

// Register global component
Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

// setup ApolloClient
export const defaultClient = new ApolloClient({
    uri: 'http://localhost:4002/graphql',

    // include the authorization token with requests to the backend
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        // if no token in localStorage, add it
        if(!localStorage.token){
            localStorage.setItem('token', '')
        }

        // operation adds the token to an authorization header, which is sent to the backend
        operation.setContext({
            headers: {
                authorization: localStorage.getItem('token')
            }
        })
    },
    onError: ({ graphQLErrors, networkError }) => {
        if(networkError) {
            console.log('[networkError]', networkError);
        }

        if(graphQLErrors) {
            for (let err of graphQLErrors) {
                console.dir(err);
                if (err.name === "AuthenticationError") {
                    // set auth err in state (to show in snackbar)
                    store.commit('setAuthError', err);
                    // signout the user
                    store.dispatch('signOutUser');
                }
            }
        }
    }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
    provide: apolloProvider.provide(),
    router,
    store,
    vuetify,
    render: h => h(App),
    created() {
        // execute getCurrentUser query
        this.$store.dispatch('getCurrentUser');
    }
}).$mount('#app')
