var Author = require("./Author");
var mongoose = require("mongoose");

require("mongoose-long")(mongoose);

var PostSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Long,
  author: Author.schema,
  //Author,
  // {
  //   id: mongoose.Schema.Types.Long,
  //   firstName: String,
  //   lastName: String,
  //   email: String,
  //   birth_date: { type: Date, default: Date.now }
  // },
  content: Object,
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now }
});
// PostSchema.author
//   .virtual("fullName")
//   .get(function() {
//     return this.author.firstName + " " + this.author.lastNameName;
//   })
//   .set(function(v) {
//     this.author.firstName = v.substr(0, v.indexOf(" "));
//     this.author.lastNameName = v.substr(v.indexOf(" ") + 1);
//   });

PostSchema.pre("save", function(next) {
  let now = Date.now();

  this.updated_date = now;
  // Set a value for created_date only if it is null
  if (!this.created_date) {
    this.created_date = now;
  }

  // Call the next function in the pre-save chain
  next();
});

module.exports = mongoose.model("Post", PostSchema);
