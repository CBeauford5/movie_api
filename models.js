const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String,
    birthYear: String,
    deathYear: String
  },
  imageURL: String,
  year: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthDate: Date,
  favoriteMovies: [{type: mongoose.Schema.Types.ObjectId,ref: 'Movies'}]

});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

