import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';

import { defaultClient as apolloClient } from '../main.js';
import { GET_CURRENT_USER, ADD_POST, GET_POSTS, SIGNIN_USER, SIGNUP_USER, GET_USER_POSTS, DELETE_USER_POST, UPDATE_USER_POST, INFINITE_SCROLL_POSTS } from '../queries.js';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        posts: [],
        userPosts: [],
        user: null,
        loading: false,
        error: null,
        authError: null,
    },
    mutations: {
        setPosts: (state, payload) => { 
            state.posts = payload;
        },
        setUser: (state, payload) => { 
            state.user = payload;
        },
        setUserPosts: (state, payload) => {
            state.userPosts = payload;
        },
        setLoading: (state, payload) => {
            state.loading = payload
        },
        setError: (state, payload) => {
            state.error = payload
        },
        setAuthError: (state, payload) => {
            state.authError = payload
        },
        clearUser: state => (state.user = null),
        clearError: state => (state.error = null),
    },
    actions: {
        getCurrentUser: ({ commit }) => {
            commit('setLoading', true);
            apolloClient.query({
                query: GET_CURRENT_USER
            })
            .then(({ data }) => {
                commit('setLoading', false);
                // add user data to state
                commit('setUser', data.getCurrentUser);
                // console.log('Current user data', data.getCurrentUser)
            })
            .catch(err => {
                commit('setLoading', false);
                console.log(err);
            })
        },
        getPosts: ({ commit }) => {
            commit('setLoading', true);
            apolloClient
            .query({
                query: GET_POSTS,

            }).then(({ data }) => {
                commit('setPosts', data.getPosts);
                commit('setLoading', false);
            })
            .catch(err => {
                commit('setLoading', false);
                console.log(err);
            })
        },
        getUserPosts: ({ commit }, payload) => {
            apolloClient.query({
                query: GET_USER_POSTS,
                variables: payload
            }).then(( { data }) => {
                // console.log(data.getUserPosts);
                commit('setUserPosts', data.getUserPosts);
            }).catch(err => {
                console.log(err)
            })
        },
        addPost: ({ commit }, payload) => {
            apolloClient
            .mutate({
                mutation: ADD_POST,
                variables: payload,
                update: (cache, { data: { addPost } }) => {
                    // read the query
                    const data = cache.readQuery({ query: GET_POSTS });
                    data.getPosts.unshift(addPost);
                    // write upated data back to the query
                    cache.writeQuery({
                        query: GET_POSTS,
                        data
                    });
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    addPost: {
                        __typename: 'Post',
                        // make sure added to beginning of array with a negative id
                        _id: -1,
                        ...payload
                    }
                },
                // rerun any queries after performing mutation to get fresh data
                refetchQueries: [
                    {
                        query: INFINITE_SCROLL_POSTS,
                        variables: {
                            pageNum: 1,
                            pageSize: 2
                        }
                    },
                ]
            })
            .then(({ data }) => {
                console.log(data.addPost);
            })
            .catch(err => {
                console.log(err);
            })
        },
        updateUserPost: ({ state, commit }, payload) => {
            apolloClient
                .mutate({
                    mutation: UPDATE_USER_POST,
                    variables: payload
                })
                .then(({ data }) => {

                    console.log(state.userPosts);
                    console.log(data.updateUserPost);

                    const index = state.userPosts.findIndex(
                    post => post._id === data.updateUserPost._id
                );
                const userPosts = [
                  ...state.userPosts.slice(0, index),
                  data.updateUserPost,
                  ...state.userPosts.slice(index + 1)
                ];
                
                commit("setUserPosts", userPosts);
              })
              .catch(err => {
                console.error(err);
            });
        },  
        signUpUser: ({ commit }, payload) => {
            // clear error mutation
            commit('clearError');

            apolloClient
            .mutate({
                mutation: SIGNUP_USER,
                variables: payload
            })
            .then(({ data }) => {
                localStorage.setItem("token", data.signUpUser.token);
                // reload the page after authentication
                router.go();
            })
            .catch(err => {
                commit('setError', err);
                console.log(err);
            })
        },
        deleteUserPost: ({ state, commit }, payload) => {
            apolloClient.mutate({
                mutation: DELETE_USER_POST,
                variables: payload,
                update: (cache, { data }) => {
                    console.log(cache, data);
                }
            }).then(({ data }) => {
                const index = state.userPosts.findIndex(
                    post => post._id === data.deleteUserPost._id
                );
                const userPosts = [
                    ...state.userPosts.slice(0, index),
                    ...state.userPosts.slice(index + 1)
                ];

                commit("setUserPosts", userPosts);
            })
            .catch(err => {
                console.log(err);
            })
        },
        signInUser: ({ commit }, payload) => {
            // clear error mutation
            commit('clearError');

            apolloClient
            .mutate({
                mutation: SIGNIN_USER,
                variables: payload
            })
            .then(({ data }) => {
                localStorage.setItem("token", data.signInUser.token);
                // reload the page after authentication
                router.go();
            })
            .catch(err => {
                commit('setError', err);
                console.log(err);
            })
        },
        signOutUser: async ({ commit }) => {
            // clear user in state
            commit('clearUser');

            // remove the token in local storage
            localStorage.removeItem('token');

            // end the session
            await apolloClient.resetStore();

            // reset to home route
            router.push('/signin');
        }
    },
    getters: {
        posts: state => state.posts,
        userPosts: state => state.userPosts,
        user: state => state.user,
        loading: state => state.loading,
        error: state => state.error,
        authError: state => state.authError,
    }
})
