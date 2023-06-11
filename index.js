const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger Initiated
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('This is the default route endpoint');
});

//displaying a welcome message on the home page
app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

//displaying a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//displaying data about a single movie by movie title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('Error: ' + req.params.title + ' was not found');
      }
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// displaying data about a genre by genre name
app.get('/movies/genreInfo/:genre', (req, res) => {
  Movies.findOne({ 'genre.name': req.params.genre })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('Error: ' + req.params.genre + ' was not found');
      } else {
        res.status(200).json(movie.genre.description);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// displaying data about a director by name
app.get('/movies/directorInfo/:director', (req, res) => {
  Movies.findOne({ 'director.name': req.params.director })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('Error: ' + req.params.director + ' was not found');
      } else {
        res.status(200).json(movie.director);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// diplaying movies by genre 
app.get('/movies/genre/:genre', (req, res) => {
  Movies.find({ 'genre.name': req.params.genre })
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send('Error: no movies found with the ' + req.params.genre + ' genre type.');
      } else {
        res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// displaying movies by director
app.get('/movies/directors/:director', (req, res) => {
  Movies.find({ 'director.name': req.params.director })
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send('Error: no movies found with the director ' + req.params.director + ' name');
      } else {
        res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// displaying a list of all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// display a single user
app.get('/users/:name', (req, res) => {
  Users.findOne({ name: req.params.name })
    .then((user) => {
      if (!user) {
        return res.status(404).send('Error: ' + req.params.name + ' was not found');
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//creating a new user
app.post('/users', (req, res) => {
  Users.findOne({ name: req.body.name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.name + ' already exists');
      } else {
        Users
          .create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            birthDate: req.body.birthDate
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//adding a movie to a user's favorite list
app.post('/users/:name/movies/:movieID', (req, res) => {
	Users.findOneAndUpdate(
		{ name: req.params.name },
		{
			$addToSet: { favoriteMovies: req.params.movieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User was not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//updating a user's information
app.put('/users/:name', (req, res) => {
  Users.findOneAndUpdate(
    { name: req.params.name },
    {
      $set: {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        birthDate: req.body.birthDate
      },
    },
    { new: true }
  )
  .then((user) => {
    if (!user) {
      return res.status(404).send('Error: No user was found');
    } else {
      res.json(user);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//removing a movie from a user's favorite list
app.delete('/users/:name/movies/:movieID', (req, res) => {
	Users.findOneAndUpdate(
		{ name: req.params.name },
		{
			$pull: { favoriteMovies: req.params.movieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//removing an existing user
app.delete('/users/:name', (req, res) => {
	Users.findOneAndRemove({ name: req.params.name })
		.then((user) => {
			if (!user) {
				res.status(404).send('User ' + req.params.name + ' was not found');
			} else {
				res.status(200).send(req.params.name + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//displaying documentation
app.use(express.static('documentation.html'));
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});


//error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//creating listener on port 80 and displaying a console message upon server startup 
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});