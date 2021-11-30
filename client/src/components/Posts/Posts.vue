<template>
    <v-container fluid grid-list-lg>
        <!-- Post cards -->
        <v-layout row wrap v-if="infiniteScrollPosts">
                <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
                    <v-card hover>
                        <v-img @click.native="goToPost(post._id)" :src="post.imageUrl" height="30vh" lazy></v-img>
                        <v-card-actions>
                            <v-card-title primary>
                                <div>
                                    <div class="headline">{{ post.title }}</div>
                                    <span class="grey--text subtitle-1">{{ post.messages.length }} comments</span>
                                </div>
                            </v-card-title>

                            <v-spacer></v-spacer>

                            <v-btn icon @click="showPostCreator = !showPostCreator"> 
                                <v-icon>{{`mdi-chevron-${showPostCreator ? 'up' : 'down'}`}}</v-icon>
                            </v-btn>
                        </v-card-actions>

                        <!-- Creator tile -->
                        <v-slide-y-transition>
                            <v-card-text v-show="showPostCreator" class="creator-tile">
                                <v-card-actions>
                                    <v-card-title primary class="title-container">
                                        <v-list-item-avatar style="margin-top: -5px;">
                                            <img :src="post.createdBy.avatar" height="40vh" class="user--avatar">
                                        </v-list-item-avatar>
                                        <div>
                                            <div class="grey--text subtitle-1" style="line-height: .5rem;">{{ post.createdBy.username }}</div>
                                            <span class="font-weight-thin">Added {{formatDateTime(post.createdDate)}}</span>
                                        </div>
                                    </v-card-title>

                                    <v-spacer></v-spacer>

                                    <v-btn icon>
                                        <v-icon color="grey lighten-1">mdi-information</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-slide-y-transition>

                    </v-card>
                </v-flex>
        </v-layout>

        <!-- Fetch More Button -->
        <v-layout v-if="showMoreEnabled" column style="padding-top: 15px;">
            <v-flex xs12>
                <v-layout justify-center row>
                    <v-btn color="info" @click="showMorePosts">More</v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 4;

export default {
    name: "Posts",
    data() {
        return {
            pageNum: 1,
            showPostCreator: false,
            showMoreEnabled: true
        };
    },
    apollo: {
        infiniteScrollPosts: {
        query: INFINITE_SCROLL_POSTS,
            variables: {
                pageNum: 1,
                pageSize
            }
        }
    },
    methods: {
        // make util function
        formatDateTime(val) {
            const integer = parseInt(val);
            const date = new Date(integer);
            const formattedDate = (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' +  date.getUTCFullYear();

            return formattedDate;
        },
        goToPost(postId) {
            this.$router.push(`/posts/${postId}`);
        },
        showMorePosts() {
            this.pageNum += 1;
            // fetch more data and transform original result
            this.$apollo.queries.infiniteScrollPosts.fetchMore({
                variables: {
                // pageNum incremented by 1
                pageNum: this.pageNum,
                pageSize
            },
            updateQuery: (prevResult, { fetchMoreResult }) => {
                console.log("previous result", prevResult.infiniteScrollPosts.posts);
                console.log("fetch more result", fetchMoreResult);

                const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
                const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
                this.showMoreEnabled = hasMore;

                return {
                    infiniteScrollPosts: {
                        __typename: prevResult.infiniteScrollPosts.__typename,
                        // Merge previous posts with new posts
                        posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
                        hasMore
                    }
                };
            }});
        },
    }
};
</script>

<style scoped>
.v-application .headline {
    font-size: 1.25rem !important;
    line-height: 1.65rem !important;
}
.user--avatar {
    padding-right: 10px;
    vertical-align: sub;
    width: auto;
    height: auto;
}
.v-card__text {
    padding-top: 0;
    padding-bottom: 0;
}
.v-card__actions{
    padding-top: 0;
    padding-bottom: 0;
}
.font-weight-thin {
    font-size: 0.9rem;
}
.creator-tile {
    background-color: #f5f5f5;
}
.title-container {
    padding-top: 25px;
    padding-left: 0;
}
</style>