const { ApolloServer, AuthenticationError } = require("apollo-server");
const { resolvers } = require("./graphql/resolvers");
const dotenv = require("dotenv");
const typeDefs = require("./graphql/typeDefs");
const db = require("./config/database");
const { authMiddleware } = require("./utils/auth");
const { getPayload } = require("./utils/auth");
dotenv.config();

//Connects database
db.connect();

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {
    const token = req.headers.authorization || " ";
    const { payload: user, loggedIn } = getPayload(token);

    return { user, loggedIn };
  },
  introspection: true,
  playground: true,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
