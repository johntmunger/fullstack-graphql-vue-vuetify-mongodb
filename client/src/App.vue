<script>
import Header from "./components/Shared/Header.vue";
import { mapGetters } from "vuex";

export default {
    name: 'App',
    components: {
        Header,
    },
    data() {
        return {
            authSnackbar: false,
            authErrorSnackbar: false,
        }
    },
    watch: {
        user(newVal, oldVal) {
            // only show if the user is reset
            if (oldVal === null) {
                this.authSnackbar = true;
            }
        },
        authError(value) {
            // if auth error is not null show error snackbar
            if (value !== null) {
                this.authErrorSnackbar = true;
            }
        }
    },
    computed: {
        ...mapGetters(['user', 'authError'])
    }
};
</script>

<template>
  <v-app>
    <v-container class="app--header">
        <Header />
    </v-container>
    <main>
        <v-container>
            <transition name="fade">
                <router-view/>
            </transition>

            <!-- Auth Sucess Snackbar -->
            <v-snackbar v-model="authSnackbar" color="success" :timeout='2000' bottom left>
                <v-toolbar-items>
                    <v-icon class="d-none d-sm-flex pr-4">mdi-check-circle</v-icon>
                    You are now signed in
                    <v-btn text @click="authSnackbar=false" class="v-btn-pad">Close</v-btn>
                </v-toolbar-items>
            </v-snackbar>

            <!-- Auth Error Snackbar -->
            <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="info" bottom left>
                <v-toolbar-items>
                    <v-icon class="d-none d-sm-flex pr-4">mdi-cancel</v-icon>
                    {{ authError.message }}
                    <v-btn text to="/signin" class="v-btn-pad">Sign In</v-btn>
                </v-toolbar-items>
            </v-snackbar>

        </v-container>
    </main>

    <!-- Footer here at some point
    <v-container class="app--footer">
        <Footer />
    </v-container> -->
  </v-app>
</template>

<style scoped>
.app--header {
    z-index: 7;
    padding-bottom: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition-property: all;
    transition-duration: 0.35s;
}
.fade-enter-active {
    transition-delay: 0.35s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
    transform: translateX(-25px);
}
.v-btn-pad {
    padding-top: 2px !important;
}
.app--footer {
    z-index: 7;
    padding-bottom: 0;
    height: 400px;
}
</style>