const PostModel = require("../models/PostModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();
const { UserInputError, AuthenticationError } = require("apollo-server");
const checkAuth = require("../middleware/checkAuth");

module.exports = {
  Post: {
    likeCount: (parent) => {
      return parent.likes.length;
    },
    commentCount: (parent) => {
      return parent.comments.length;
    },
  },

  Query: {
    async getPosts(parent, args, context, info) {
      try {
        posts = await PostModel.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(parent, args, context, info) {
      try {
        const post = await PostModel.findById(args.postId);

        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async register(parent, args, context, info) {
      const user = await User.findOne({
        username: args.registerInput.username,
      });

      if (user) {
        throw new UserInputError("Username is taken", {
          error: { username: "This name is taken" },
        });
      }

      password = await bcrypt.hash(args.registerInput.password, 12);

      const newUser = new User({
        email: args.registerInput.email,
        username: args.registerInput.username,
        password: password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = jwt.sign(
        { id: res.id, email: res.email, username: res.username },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      return { ...res._doc, id: res._id, token };
    },

    async login(parent, args, context, info) {
      const user = await User.findOne({ username: args.username });

      if (!user) {
        throw new UserInputError("Wrong credentials");
      }

      const match = await bcrypt.compare(args.password, user.password);
      if (!match) {
        throw new UserInputError("Wrong credentials");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      return { ...user._doc, id: user._id, token };
    },

    async createPost(parent, args, context, info) {
      const user = checkAuth(context);

      const newPost = PostModel({
        body: args.body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", { newPost: post });

      return post;
    },

    async deletePost(parents, args, context, info) {
      const user = checkAuth(context);

      try {
        const post = await PostModel.findById(args.postId);
        if (user.id === post.user.toString()) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async createComment(parent, args, context, info) {
      const user = checkAuth(context);

      if (args.body.trim() === "") {
        throw new UserInputError("Empty comment");
      }

      const post = await PostModel.findById(args.postId);

      if (post) {
        post.comments.unshift({
          body: args.body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },

    async deleteComment(parent, args, context, info) {
      const user = checkAuth(context);

      const post = await PostModel.findById(args.postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === args.commentId
        );

        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Comment action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },

    async likePost(parent, args, context, info) {
      const { username } = checkAuth(context);

      const post = await PostModel.findById(args.postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
