<script>
import { mapGetters } from "vuex";

export default {
    name: "Header",
    computed: {
        ...mapGetters(['user']),
        navItems() {
            let items = [
                { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
                { icon: 'mdi-lock-open', title: 'Sign In', link: '/signin'},
                { icon: 'mdi-plus-circle', title: 'Sign Up', link: '/signup'}
            ];

            if (this.user) {
                items = [
                    { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
                    { icon: 'mdi-plus-circle', title: 'Create Post', link: '/addpost'},
                    { icon: 'mdi-account-box', title: 'Profile', link: '/profile'},
                ]
            }

            return items
        }
    },
    data: () => ({
        sideNav: false,
    }),
    methods: {
        toggleSideNav() {
            this.sideNav = !this.sideNav;
        },
        handleSignOutUser(e) {
            this.$store.dispatch('signOutUser')
        }
    }
}
</script>

<template>
    <v-container style="z-inde:1111;">
        <v-toolbar fixed color="primary" dark>
            <v-navigation-drawer app temporary fixed v-model="sideNav">
                <v-toolbar color="accent" dark text>
                    <v-toolbar-title>
                        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
                        <router-link to="/" tag="span" style="pointer;">
                            Fullstack Demo
                        </router-link>
                    </v-toolbar-title>
                </v-toolbar>

                <v-divider></v-divider>

                <!-- vertical navigation -->
                <v-list>
                    <v-list-item text v-for="item in navItems" :key="item.title" :to="item.link">
                        <v-icon class="pr-3">{{ item.icon }}</v-icon>
                        {{ item.title }}
                    </v-list-item>
                    <v-list-item text v-if="user" to="/signout" style="pointer;" @click="handleSignOutUser">
                        <v-icon class="d-none d-sm-flex pr-3">mdi-exit-to-app</v-icon>
                        Sign Out
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <!-- navigation hamburger -->
            <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>

            <!-- title -->
            <v-toolbar-title class="d-none d-sm-flex">
                <router-link custom to="/" tag="span" style="cursor: pointer;">
                    Fullstack Demo
                </router-link>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            
            <!-- horizontal navigation -->
            <v-toolbar-items>
                <v-btn text v-for="item in navItems" :key="item.title" :to="item.link">
                    <v-icon class="d-none d-sm-flex pr-3">{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </v-container>
</template>