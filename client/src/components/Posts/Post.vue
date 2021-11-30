<template v-slot:activator="{ on }">
  <v-container v-if="getPost" flexbox center pad-minus-right>

    <!-- Post Card -->
    <v-layout row wrap class="container pad-minus-right">
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3>{{ getPost.title }}</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>mdi-chevron-left</v-icon>
          </v-card-title>

          <v-card>
            <v-img :src="getPost.imageUrl" id="post__image"></v-img>
          </v-card>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-4 mr-3" color="accent" text-color="white">{{ category }}</v-chip>
            </span>
            <h4>{{getPost.description}}</h4>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3 container mt-6">
      <v-layout class="mb-3 pr-3 pl-2" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormValid" lazy-validation @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field 
                    :rules="messageRules"
                    v-model="messageBody" 
                    ref="form" 
                    clearable 
                    :append-outer-icon="messageBody && 'mdi-send'" 
                    label="Add Message"
                    type="text"
                    @click:append-outer="handleAddPostMessage"
                    prepend-icon="mdi-email"
                    required
                    ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap class="pr-2 pl-2">
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>
                        {{message.messageBody}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{message.messageUser.username}}
                        <span class="grey--text text--lighten-1 hidden-xs-only">{{formatDateTime(message.messageDate)}}</span>
                    </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class='hidden-xs-only'>
                  <v-icon color="grey">mdi-chat</v-icon>
                </v-list-item-action>

              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { ADD_POST_MESSAGE, GET_POST } from "../../queries";

export default {
    name: "Post",
    props: ['postId'],
    data() {
    return {
        dialog: false,
        messageBody: '',
        isFormValid: true,
        messageRules: [
            message => !!message || 'Message is required',
            message => message.length < 50 || 'Message must be less than 50 characters',
        ]
    };
  },  
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    // make util function
    formatDateTime(str) {
        const integer = parseInt(str);
        const date = new Date(integer);
        const formattedDate = (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' +  date.getUTCFullYear();

        return formattedDate;
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    handleAddPostMessage() {
        if(this.$refs.form.validate()) {
        const variables = {
            messageBody: this.messageBody,
            userId: this.user._id,
            postId: this.postId
        };
        this.$apollo
            .mutate({
                mutation: ADD_POST_MESSAGE,
                variables,
                update: (cache, { data: { addPostMessage } }) => {
                    const data = cache.readQuery({
                    query: GET_POST,
                    variables: { postId: this.postId }
                    });
                    data.getPost.messages.unshift(addPostMessage);
                    cache.writeQuery({
                    query: GET_POST,
                    variables: { postId: this.postId },
                    data
                    });
                }
            })
            .then(({ data }) => {
                this.messageBody = " ";
            })
            .catch(err => console.error(err));
            }
        },
    }  
};
</script>

<style scoped>
.post-title {
    font-size: 1.75rem;
}
#post__image {
  height: 400px !important;
}
.pad-minus-right {
    padding-right: 0;
}
</style>