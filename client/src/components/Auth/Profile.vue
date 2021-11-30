<template>
  <v-container class="text-xs-center grid-list-lg">

    <!-- User Details Card -->
    <v-flex>
      <v-card>
        <v-layout>
          <v-flex class="gravatar-container">
            <img :src="user.avatar" height="125px">
          </v-flex>
          <v-flex>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{formatDateTime(user.joinDate)}}</div>
                <div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts created by the user -->
    <v-container v-if="!userPosts.length">
        <v-layout row wrap>
            <v-flex xs12 style="padding-top: 2rem;">
                <h3>You have no posts, go and add some.</h3>
            </v-flex>
        </v-layout>
    </v-container>
    
    <v-container class="mt3" v-else>
        <v-flex xs12 class="title-container">
            <h2 class="font-weight-light">Your Posts
                <span class="font-weight-regular">({{ userPosts.length }})</span>
            </h2>
        </v-flex>
        <v-layout row wrap>
            <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
                <v-card hover class="icon-container">
                    <v-btn @click="loadPost(post)" color="info" class="btn" floating fab small dark><v-icon>mdi-border-color</v-icon></v-btn>
                    <v-btn @click="handleDeleteUserPost(post)" color="error" class="btn" floating fab small dark><v-icon>mdi-delete</v-icon></v-btn>
                </v-card>

                <v-img height="30vh" :src="post.imageUrl"></v-img>
                <v-card-text class="card-text-container">{{ post.title }}</v-card-text>
            </v-flex>
        </v-layout>
    </v-container>

     <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <div style="margin: 2.5rem;">
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">

            <!-- Title Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Url Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px">
              </v-flex>
            </v-layout>

            <!-- Categories Select -->
            <v-layout row>
              <v-flex xs12>
                <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Food', 'Furniture', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" class="success--text" text>Update</v-btn>
              <v-btn class="error--text" text @click="editPostDialog = false">Cancel</v-btn>
            </v-card-actions>

          </v-form>
        </div>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
name: "Profile",
  data() {
    return {
        editPostDialog: false,
        isFormValid: true,
        title: "",
        imageUrl: "",
        categories: [],
        description: "",
        titleRules: [
            title => !!title || "Title is required",
            title => title.length < 20 || "Title must have less than 20 characters"
        ],
        imageRules: [image => !!image || "Image is required"],
        categoriesRules: [
            categories =>
            categories.length >= 1 || "At least one category is required"
        ],
        descRules: [
            desc => !!desc || "Description is required",
            desc =>
            desc.length < 200 || "Description must have less than 200 characters"
        ]
    };
  },  
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    // make utilities function
    formatDateTime(str) {
        const integer = parseInt(str);
        const date = new Date(integer);
        const formattedDate = (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' +  date.getUTCFullYear();

        return formattedDate;
    },
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleDeleteUserPost(post) {
        this.loadPost(post, false);
        const deletePost = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (deletePost) {
            this.$store.dispatch("deleteUserPost", {
                postId: this.postId
            });
        }
    },
    handleUpdateUserPost() {
        if (this.$refs.form.validate()) {
            this.$store.dispatch("updateUserPost", {
            postId: this.postId,
            userId: this.user._id,
            title: this.title,
            imageUrl: this.imageUrl,
            categories: this.categories,
            description: this.description
        });
            this.editPostDialog = false;
        }
    },
    loadPost({ _id, title, imageUrl, categories, description }, editPostDialog = true) {
            this.editPostDialog = editPostDialog;
            this.postId = _id;
            this.title = title;
            this.imageUrl = imageUrl;
            this.categories = categories;
            this.description = description;
        }
    }
}; 
</script>

<style scoped>
.gravatar-container {
    padding: 15px 5px 15px 15px;
    flex: 0 1 auto;
}
.title-container h2 {
    margin: 1.5rem 0 2rem;
}
.icon-container {
    text-align: center;
    padding: 8px;
}
.icon-container .btn {
    margin: 5px;
}
.card-text-container {
    padding-left: .5rem;
}
</style>