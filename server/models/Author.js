var mongoose = require("mongoose");
let validator = require("validator");

require("mongoose-long")(mongoose);

var AuthorSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Long,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  },
  birth_date: { type: Date, default: Date.now }
});

AuthorSchema.virtual("fullName").get(function() {
  return this.firstName + " " + this.lastName;
});

AuthorSchema.virtual("fullName").set(function(name) {
  let str = name.split(" ");
  this.firstName = str[0];
  this.lastName = str[1];
});

module.exports = mongoose.model("Author", AuthorSchema);
