<script>
import { mapGetters } from 'vuex';

export default {
    name: "SignIn",
    data() {
        return {
            username: '',
            password: '',
        }
    },
    computed: {
        ...mapGetters(['error', 'user'])
    },
    watch:{
        user(value) {
            // if user value changes at all take the user to home page
            if(value) {
                this.$router.push('/');
            }
        }
    },
    methods: {
        handleSignInUser() {
            this.$store.dispatch('signInUser', {
                username: this.username,
                password: this.password
            });
        }
    }
}
</script>

<template>
  <v-container class="text-center mt-5 pt-5">
      
      <!-- SignIn title -->
      <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3 mb-6>
              <h1 class="primary--text text-center">Welcome Back!</h1>
          </v-flex>
      </v-layout>

      <!-- Error message -->
      <v-layout v-if="error" row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message"></form-alert>
            </v-flex>
      </v-layout>

      <!-- SignIn form -->
      <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3>
              <v-card color="primary" dark>
                  <v-container>
                      <v-form @submit.prevent="handleSignInUser">

                        <v-layout row>
                            <v-flex xs12 pr-8 pt-4>
                                <v-text-field v-model="username" prepend-icon="mdi-face" label="Username" type="text" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12 pr-8>
                                <v-text-field v-model="password" prepend-icon="mdi-extension" label="Password" type="password" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout pt-4 pb-4 center>
                            <v-flex xs12>
                                <div class="center signin-cta">
                                    <v-btn mb6 color="accent" type="submit">Sign In</v-btn>
                                </div>
                                <div>
                                    <span>Don't have an account?</span>
                                    <v-btn to="/signup" text>Sign Up</v-btn>
                                </div>
                            </v-flex>
                        </v-layout>

                      </v-form>
                  </v-container>
              </v-card>
          </v-flex>
      </v-layout>

  </v-container>
</template>

<style scoped>
.signin-cta {
    padding-bottom: .75rem;
}
</style>