const { gql } = require("apollo-server");

module.exports = gql`
  # User Types
  type User {
    id: ID!
    name: String
    username: String
    bio: String
    phoneNumber: String
    password: String!
    email: String!
    photo: String
    token: String!
  }

  type UserPayload {
    id: ID!
    email: String!
    password: String!
    token: String!
  }

  # Register input
  input RegisterInput {
    email: String!
    password: String!
  }

  type Query {
    getUsers: [User]
    getUser: User
    users: String
  }
  type Mutation {
    register(email: String!, password: String!): UserPayload!
    login(email: String!, password: String!): UserPayload!
    updateUser(
      id: ID!
      username: String
      name: String
      bio: String
      phoneNumber: String
      photo: String
    ): User!
  }
`;
