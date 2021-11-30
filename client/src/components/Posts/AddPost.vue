<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
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
        categories => categories.length >= 1 || "At least one category is required"
        ],
        descRules: [
            desc => !!desc || "Description is required",
            desc => desc.length < 200 || "Description must have less than 200 characters"
        ]
    };
  },
  computed: {
    ...mapGetters(["loading", "user"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
            title: this.title,
            imageUrl: this.imageUrl,
            categories: this.categories,
            description: this.description,
            creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  }
};
</script>

<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add post Title -->
    <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
            <h1 class="primary--text text-center">Add Post</h1>
        </v-flex>
    </v-layout>

    <!-- Add post form -->
    <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">

                <!-- Title input -->
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required>
                        </v-text-field>
                    </v-flex>
                </v-layout>

                <!-- Image URL -->
                <v-layout row>
                    <v-flex xs12>
                        <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required>
                        </v-text-field>
                    </v-flex>
                </v-layout>

                <!-- Image preview -->
                <v-layout row>
                    <v-flex xs12>
                        <img :src="imageUrl" height="300px">
                    </v-flex>
                </v-layout>

                <!-- Categories -->
                <v-layout row>
                    <v-flex xs12>
                        <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
                    </v-flex>
                </v-layout>  

                <!-- Description -->
                <v-layout row>
                    <v-flex xs12>
                        <v-textarea v-model="description" :rules="descRules" label="Description" type="text"></v-textarea>
                    </v-flex>
                </v-layout>

                <!-- Action -->
                <v-layout row>
                    <v-flex xs12>
                        <v-btn :loading="loading" :disabled="!isFormValid || loading" color="info" type="submit">
                            <span slot="loader" class="custom-loader">
                                <v-icon light>mdi-cached</v-icon>
                            </span>
                            Submit
                        </v-btn>
                    </v-flex>
                </v-layout>

            </v-form>
        </v-flex>
    </v-layout>

  </v-container>
</template>