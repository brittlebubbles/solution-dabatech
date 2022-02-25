const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { encryptPassword, generateToken } = require("../../utils/auth");
const userResolvers = {
  Query: {
    getUsers: async (parent, args, context) => {
      if (context.loggedIn) {
        console.log(context.user);

        const users = await User.find({});
        return users;
      } else {
        throw new AuthenticationError("You need to be logged in!");
      }
    },
  },
  Mutation: {
    async register(_, { email, password }) {
      try {
        if (!email || !password) {
          throw new UserInputError("Data provided is not valid");
        }
        const emailExist = await User.findOne({ email });
        if (emailExist) throw new AuthenticationError("User Already Exists!");
        const newPassword = await encryptPassword(password);
        const newUser = new User({
          email,
          password: newPassword,
          createdAt: new Date().toISOString(),
        });

        const result = await newUser.save();
        const token = generateToken(result);

        return {
          ...result._doc,
          id: result._id,
          token,
        };
      } catch (error) {
        console.log(error);
      }
    },

    async login(_, { email, password }) {
      if (!email || !password) {
        throw new UserInputError("Data provided is not valid");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("User not found");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("Wrong credentials.");
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async updateUser(
      _,
      { id, name, username, phoneNumber, bio, photo },
      context
    ) {
      try {
        if (context.loggedIn) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                name,
                username,
                phoneNumber,
                bio,
                photo,
              },
            },
            { new: true }
          );
          return updatedUser;
        } else {
          throw new AuthenticationError("You need to be logged in!");
        }
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = {
  userResolvers,
};
