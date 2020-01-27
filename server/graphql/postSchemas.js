var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
var GraphQLInt = require("graphql").GraphQLInt;

var GraphQLInputObjectType = require("graphql").GraphQLInputObjectType;
var GraphQLDate = require("graphql-date");
var BookModel = require("../models/Book");
var PostModel = require("../models/Post");
var AuthorModel = require("../models/Author");

const authorType = new GraphQLObjectType({
  name: "authorType",
  description: "Author model",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: {
      type: GraphQLString
    },
    birth_date: { type: GraphQLDate }
  }
});

const authorInputType = new GraphQLInputObjectType({
  name: "authorType",
  description: "Author model",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: {
      type: GraphQLString
    },
    birth_date: { type: GraphQLDate }
  }
});

var postType = new GraphQLObjectType({
  name: "post",
  fields: function() {
    return {
      _id: {
        type: GraphQLID
      },
      author: {
        type: authorType
      },
      content: {
        type: GraphQLString
      },
      created_date: {
        type: GraphQLDate
      },
      updated_date: {
        type: GraphQLDate
      }
    };
  }
});

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: function() {
    return {
      posts: {
        type: new GraphQLList(postType),
        resolve: function() {
          const posts = PostModel.find()
            .populate("author")
            .exec();
          if (!posts) {
            throw new Error("Error");
          }
          return posts;
        }
      },
      post: {
        type: postType,
        args: {
          id: {
            name: "_id",
            type: GraphQLID
          }
        },
        resolve: function(root, params) {
          const postDetails = PostModel.findById(params.id).exec();
          if (!postDetails) {
            throw new Error("Error");
          }
          return postDetails;
        }
      }
    };
  }
});

var mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function() {
    return {
      addPost: {
        type: postType,
        args: {
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author: {
            type: new GraphQLInputObjectType({
              name: "authorInput",
              fields: {
                id: { type: GraphQLID }
              }
            })
          },
          created_date: {
            defaultValue: Date.now,
            type: GraphQLDate
          },
          updated_date: {
            type: GraphQLDate
          }
        },
        resolve: function(root, params) {
          const postModel = new PostModel(params);
          const newPost = postModel.save();
          if (!newPost) {
            throw new Error("Error");
          }
          return newPost;
        }
      },
      updatePost: {
        type: postType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLID)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return PostModel.findByIdAndUpdate(
            params.id,
            {
              content: params.content,
              updated_date: Date.now()
            },
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      removePost: {
        type: postType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remBook = PostModel.findByIdAndRemove(params.id).exec();
          if (!remBook) {
            throw new Error("Error");
          }
          return remBook;
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
