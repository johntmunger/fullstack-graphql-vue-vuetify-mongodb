import { gql } from 'apollo-boost';

/* Get Posts */
export const GET_POSTS = gql`
    query {
        getPosts {
            _id
            title
            imageUrl
        }
    }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
            _id
            messageBody
            messageDate
            messageUser {
                _id
                username
                avatar
            }
        }
    }
  }
`;

/* User Queries */
export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            _id
            username
            email
            password
            avatar
            joinDate
            favorites {
                _id
                title
                imageUrl
            }
        }
    }
`;

export const GET_USER_POSTS = gql`
    query($userId: ID!) {
        getUserPosts(userId: $userId) {
            _id
            title
            imageUrl
            description
            categories
            createdDate
            likes
        }
    }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/* Post Mutations */
export const ADD_POST = gql`
mutation(
        $title: String!
        $imageUrl: String!
        $categories: [String!]
        $description: String!
        $creatorId: ID!
    ) {
    addPost(
        title: $title,
        imageUrl: $imageUrl
        categories: $categories
        description: $description
        creatorId: $creatorId
    ) {
        _id
        title
        imageUrl
        categories
        description
        createdDate
    }
}`;

export const DELETE_USER_POST = gql`
    mutation($postId: ID!) {
        deleteUserPost(postId: $postId) {
            _id
        }
    }
`;

export const UPDATE_USER_POST = gql`
    mutation(
        $postId: ID!
        $userId: ID!
        $title: String!
        $imageUrl: String!
        $categories: [String]!
        $description: String!
    ) {
    updateUserPost(
        postId: $postId
        userId: $userId
        title: $title
        imageUrl: $imageUrl
        categories: $categories
        description: $description
    ) {
        _id
        title
        imageUrl
        description
        categories
        createdDate
        likes
        createdBy {
            _id
            avatar
        }
    }
  }
`;

export const ADD_POST_MESSAGE = gql`
    mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
        addPostMessage(
            messageBody: $messageBody
            userId: $userId
            postId: $postId
        ) {
        _id
        messageBody
        messageDate
        messageUser {
            _id
            username
            avatar
            }
        }
    }
`;

/* User Mutations */
export const SIGNIN_USER = gql`
mutation($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
mutation($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
