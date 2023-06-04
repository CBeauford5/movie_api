const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

//creating 10 movie objects
let movies = [
  {
    title: 'Caddyshack',
    year: '1980',
    director: 'Harold Ramis'
  },

  {
    title: 'Planes, Trains, and Automobiles',
    year: '1987',
    director: 'John Hughes'
  },

  {
    title: 'Casablanca',
    year: '1942',
    director: 'Michael Curtiz'
  },

  {
    title: 'Office Space',
    year: '1999',
    director: 'Mike Judge'
  },

  {
    title: 'The Count of Monte Cristo',
    year: '2002',
    director: 'Kevin Reynolds'
  },

  {
    title: "You've Got Mail",
    year: '1998',
    director: 'Nora Ephron'
  },

  {
    title: 'The Cable Guy',
    year: '1996',
    director: 'Ben Stiller'
  },

  {
    title: 'Boondock Saints',
    year: '1999',
    director: 'Troy Duffy'
  },

  {
    title: "The King's Speech",
    year: '2010',
    director: 'Tom Hooper'
  },

  {
    title: "Everything Everywhere All at Once",
    year: '2022',
    director: 'Daniel Kwan, Daniel Scheinert'
  }
]

//intiating the Logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

//displaying a welcome message on the home page
app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

//displaying the movies array 
app.get('/movies', (req, res) => {
  res.json(movies);
});

//displaying documentation
app.use(express.static('documentation.html'));
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//displaying a welcome message on the secret url
app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
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