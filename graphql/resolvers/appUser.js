const { UserInputError } = require("apollo-server");
// const { argsToArgsConfig } = require("graphql/type/definition");
const AppUser = require("../../models/AppUser");
// const checkAuth = require("../../util/check-auth");

const { validateAppUserInput } = require("../../util/validatorsUser");

module.exports = {
  Query: {
    async getAppUsers() {
      try {
        const appUsers = await AppUser.find().sort({ createdAt: -1 });
        return appUsers;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAppUser(_, { appUserId }) {
      try {
        const appUser = await AppUser.findById(appUserId);
        if (appUser) {
          return appUser;
        } else {
          throw new Error("AppUser not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async registerAppUser(
      _,
      {
        appUserInput: {
          username,
          email,
          password,
          confirmPassword,
          firstname,
          lastname,
          role,
        },
      },
      context,
      info
    ) {
      //  Validate user data
      const { valid, errors } = validateAppUserInput(
        username,
        email,
        password,
        confirmPassword,
        firstname,
        lastname,
        role
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user doesnt already exist
      const appUser = await AppUser.findOne({ username });
      if (appUser) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      //  Hash password andd create a auht token

      // password = await bcrypt.hash(password, 12);

      const newAppUser = new AppUser({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        firstname,
        lastname,
        role,
        enable: false,
        locked: false,
      });

      const res = await newAppUser.save();

      // const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
      };
    },
    // async deleteAppUser(_, { appUserId }, context) {
    //   //   const appUser = checkAuth(context);

    //   try {
    //     const appUser = await AppUser.findById(appUserId);
    //     if (appUser.username === appUser.username) {
    //       await appUser.delete();
    //       return "User deleted successfully";
    //     } else {
    //       throw new AuthenticationError("Action not allowed");
    //     }
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
    // async likeAppUser(_, { postId }, context) {
    //   const { username } = checkAuth(context);
    //   const post = await AppUser.findById(postId);
    //   if (post) {
    //     if (post.likes.find((like) => like.username === username)) {
    //       //Post already likes, unlike it
    //       post.likes = post.likes.filter((like) => like.username !== username);
    //       await post.save();
    //     } else {
    //       //Not like, like post
    //       post.likes.push({
    //         username,
    //         createdAt: new Date().toISOString(),
    //       });
    //     }
    //     await post.save();
    //     return post;
    //   } else throw new UserInputError("Post not found");
    // },
  },
};
