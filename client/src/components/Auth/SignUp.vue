<script>
import { mapGetters } from 'vuex';

export default {
    name: "SignUp",
    computed: {
        ...mapGetters(['error'])
    },
    data() {
        return {
            isFormValid: true,
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            usernameRules: [
                username => !!username || 'Username is required',
                username => username.length < 10 || 'Username cannot be more than 10 characters'
            ],
            emailRules: [
                email => !!email || 'Email is required',
                email => /.@+./.test(email) || 'Email must be valid'
            ],
            passwordRules: [
                password => !!password || 'Password is required',
                password => password.length >= 3 || 'Password must be at least 3 characters',
                confirmation => confirmation === this.password || 'Passwords must match'
            ],
            
        }
    },
    methods: {
        handleSignUpUser() {
            this.$store.dispatch('signUpUser', {
                username: this.username,
                email: this.email,
                password: this.password
            });
        }
        
    }
}
</script>

<template>
  <v-container class="text-center mt-5 pt-5">
      
      <!-- SignUp title -->
      <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3 mb-6>
              <h1 class="primary--text text-center">Get Started</h1>
          </v-flex>
      </v-layout>

      <!-- Error message -->
      <v-layout v-if="error" row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message"></form-alert>
            </v-flex>
      </v-layout>

      <!-- SignUp form -->
      <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3>
              <v-card color="accent" dark>
                  <v-container>
                      <v-form @submit.prevent="handleSignUpUser">

                        <v-layout row>
                            <v-flex xs12 pr-8 pt-4>
                                <v-text-field v-model="username" :rules="usernameRules" prepend-icon="mdi-face" label="Username" type="text" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12 pr-8 pt-4>
                                <v-text-field v-model="email" :rules="emailRules"  prepend-icon="mdi-face" label="Email" type="email" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12 pr-8 pt-4>
                                <v-text-field v-model="password" :rules="passwordRules"  prepend-icon="mdi-face" label="Password" type="password" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12 pr-8 pt-4>
                                <v-text-field v-model="passwordConfirmation" :rules="passwordRules"  prepend-icon="mdi-face" label="Confirm Password" type="password" required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs12>
                                <v-btn :disabled="!isFormValid" color="info" type="submit">Sign Up</v-btn>
                                <v-layout pt-4 pb-4 center>
                                    <v-flex>
                                        <span>Already have an account?</span>
                                        <v-btn to="/signin" text>Sign In</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>

                      </v-form>
                  </v-container>
              </v-card>
          </v-flex>
      </v-layout>

  </v-container>
</template>