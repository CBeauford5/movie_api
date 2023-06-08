const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

//initiates logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('common', { stream: accessLogStream }));

//initiates bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// creating a sample list of users
let users = [
  {
    id: '1',
    name: 'Tom',
    favoriteMovies: []
  },

  {
    id: '2',
    name: 'Rachael',
    favoriteMovies: []
  },

  {
    id: '3',
    name: 'Rebecca',
    favoriteMovies: []
  }
]

//creating 10 movie objects
let movies = [
  {
    title: 'Caddyshack',
    description: 'An exclusive golf course has to deal with a brash new member and a destructive dancing gopher.',
    genre: {
      name: 'comedy',
      description: 'Comedies usually feature pratfalls, wordplay, uncomfortable situations, and sometimes lean the opposite way of realism. Their stakes are usually personal and violence is almost always done for laughs and not serious consequences.'
    },
    director: {
      name: 'Harold Ramis',
      bio: 'Harold Allen Ramis was an American actor, comedian, director and writer. His best-known film acting roles were as Egon Spengler in Ghostbusters and Ghostbusters II, and as Russell Ziskey in Stripes; he also co-wrote those films.',
      birthYear: '1944',
      deathYear: '2014'
    },
    imageURL: '',
    year: '1980',
    featured: 'yes'
  },

  {
    title: 'Planes, Trains, and Automobiles',
    description: 'A Chicago advertising man must struggle to travel home from New York for Thanksgiving, with a lovable oaf of a shower-curtain-ring salesman as his only companion.',
    genre: {
      name: 'comedy',
      description: 'Comedies usually feature pratfalls, wordplay, uncomfortable situations, and sometimes lean the opposite way of realism. Their stakes are usually personal and violence is almost always done for laughs and not serious consequences.'
    },
    director: {
      name: 'John Hughes',
      bio: 'John Wilden Hughes Jr. was an American filmmaker. Hughes began his career in 1970 as an author of humorous essays and stories for the National Lampoon magazine.',
      birthYear: '1950',
      deathYear: '2009'
    },
    imageURL: '',
    year: '1987',
    featured: 'yes'
  },

  {
    title: 'Casablanca',
    description: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
    genre: {
      name: 'drama',
      description: 'Drama Films are serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature. A dramatic film shows us human beings at their best, their worst, and everything in-between.'
    },
    director: {
      name: 'Michael Curtiz',
      bio: "Michael Curtiz was a Hungarian-American film director, recognized as one of the most prolific directors in history. He directed classic films from the silent era and numerous others during Hollywood's Golden Age, when the studio system was prevalent.",
      birthYear: '1886',
      deathYear: '1966'
    },
    imageURL: '',
    year: '1942',
    featured: 'yes'
  },

  {
    title: 'Office Space',
    description: 'Three company workers who hate their jobs decide to rebel against their greedy boss.',
    genre: {
      name: 'comedy',
      description: 'Comedies usually feature pratfalls, wordplay, uncomfortable situations, and sometimes lean the opposite way of realism. Their stakes are usually personal and violence is almost always done for laughs and not serious consequences.'
    },
    director: {
      name: 'Mike Judge',
      bio: 'Michael Craig Judge is an American actor, animator, filmmaker, and musician. He is the creator of the animated television series Beavis and Butt-Head, and the co-creator of the television series King of the Hill, The Goode Family, Silicon Valley, and Mike Judge Presents: Tales from the Tour Bus.',
      birthYear: '1962',
      deathYear: 'present'
    },
    imageURL: '',
    year: '1999',
    featured: 'yes'
  },

  {
    title: 'The Count of Monte Cristo',
    description: 'A young man, falsely imprisoned by his jealous "friend", escapes and uses a hidden treasure to exact his revenge.',
    genre: {
      name: 'action',
      description: 'Action films are built around a core set of characteristics: spectacular physical action; a narrative emphasis on fights, chases, and explosions; and a combination of state-of-the-art special effects and stunt-work.'
    },
    director: {
      name: 'Kevin Reynolds',
      bio: 'Kevin Hal Reynolds is an American film director and screenwriter. He directed Robin Hood: Prince of Thieves, Waterworld, The Count of Monte Cristo, the cult classic Fandango, and the 2016 film Risen. He was nominated for a Primetime Emmy Award for the History miniseries Hatfields & McCoys.',
      birthYear: '1952',
      deathYear: 'present'
    },
    imageURL: '',
    year: '2002',
    featured: 'yes'
  },

  {
    title: "You've Got Mail",
    description: "Book superstore magnate Joe Fox and independent book shop owner Kathleen Kelly fall in love in the anonymity of the Internet, both blissfully unaware that he's trying to put her out of business",
    genre: {
      name: 'romance',
      description: 'Romance films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters. Typically their journey through dating, courtship or marriage is featured.'
    },
    director: {
      name: 'Nora Ephron',
      bio: 'Nora Ephron was an American journalist, writer, and filmmaker. She is best known for her romantic comedy films and was nominated three times for the Writers Guild of America Award and the Academy Award for Best Original Screenplay for Silkwood, When Harry Met Sally..., and Sleepless in Seattle. ',
      birthYear: '1941',
      deathYear: '2012'
    },
    imageURL: '',
    year: '1998',
    featured: 'yes'
  },

  {
    title: 'The Cable Guy',
    description: 'A designer makes a grievious mistake when he rejects the friendship of a borderline cable guy.',
    genre: {
      name: 'thriller',
      description: 'A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear. Without fail, they are plot-driven stories.'
    },
    director: {
      name: 'Ben Stiller',
      bio: 'Benjamin Edward Meara Stiller is an American actor, comedian, and filmmaker. He is the son of the comedians and actors Jerry Stiller and Anne Meara. Stiller was a member of a group of comedic actors colloquially known as the Frat Pack.',
      birthYear: '1965',
      deathYear: 'present'
    },
    imageURL: '',
    year: '1996',
    featured: 'yes'
  },

  {
    title: 'The Boondock Saints',
    description: "Two Irish Catholic brothers become vigilantes and wipe out Boston's criminal underworld in the name of God.",
    genre: {
      name: 'action',
      description: 'Action film is a film genre in which the protagonist(s) is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Troy Duffy',
      bio: 'Troy Duffy is an American filmmaker and musician. He has directed two films, The Boondock Saints and its sequel The Boondock Saints II: All Saints Day. Duffy was the subject of the 2003 documentary film Overnight. ',
      birthYear: '1971',
      deathYear: 'present'
    },
    imageURL: '',
    year: '1999',
    featured: 'yes'
  },

  {
    title: "The King's Speech",
    description: 'The story of King George VI, his unexpected ascension to the throne of the British Empire in 1936, and the speech therapist who helped the unsure monarch overcome his stammer.',
    genre: {
      name: 'biopic',
      description: 'A biopic (short for "biographical picture”) is a type of motion picture that tells the life story of a non-fictional, real person. Biopic films typically revolve around a historical figure or a famous person, though they can be about anyone—as long as the person actually exists or existed in real life.'
    },
    director: {
      name: 'Tom Hooper',
      bio: 'Thomas George Hooper is a British-Australian filmmaker. Hooper began making short films as a teenager and had his first professional short, Painted Faces, broadcast on Channel 4 in 1992. At Oxford University, Hooper directed plays and television commercials.',
      birthYear: '1972',
      deathYear: 'present'
    },
    imageURL: '',
    year: '2010',
    featured: 'yes'
  },

  {
    title: "Everything Everywhere All at Once",
    description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    genre: {
      name: 'adventure',
      description: 'A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown. Subgenres of adventure films include swashbuckler films, pirate films, and survival films.'
    },
    director: {
      name: 'Daniel Kwan, Daniel Scheinert',
      bio: "Daniel Kwan with Daniel Scheinert, collectively known as Daniels, are a duo of film directors and writers. They began their career as directors of music videos, including the popular DJ Snake promotional for the single 'Turn Down for What' (2013). They have since ventured into film, having written and directed the surreal comedy-drama Swiss Army Man (2016) and the science-fiction action comedy Everything Everywhere All at Once (2022), the latter became A24's highest-grossing film of all time.",
      birthYear: '1988, 1987',
      deathYear: 'present'
    },
    imageURL: '',
    year: '2022',
    featured: 'yes'
  }
]


//displaying a welcome message on the home page
app.get('/', (req, res) => {
  res.send('Welcome to my myFlix!');
});

//displaying a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
  console.log('Here is a list of all movies');
});

//displaying data about a single movie by movie title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

//displaying data about a genre by genre name
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

//displaying data about a director by name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director found');
  }
});

//creating a new user
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing "name" in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(200).send(newUser);
  }
});

//updating a user's information
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const userUpdate = req.body;

  let user = users.find(user => user.id === id);

  if (user) {
    user.name = userUpdate.name;
    res.status(201).json(user);
  } else {
    res.status(400).send('cannot update (invalid user)');
  }
});

//adding a movie to a user's favorite list
app.post('/users/:id/:favoriteMovieTitle', (req, res) => {
  const { id, favoriteMovieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(favoriteMovieTitle);
    res.status(201).send('movie added to your favorites list');
    console.log(favoriteMovieTitle);
  } else {
    res.status(400).send('movie not added');
  }
});

//removing a movie from a user's favorite list
app.delete('/users/:id/:favoriteMovieTitle', (req, res) => {
  const { id, favoriteMovieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== favoriteMovieTitle);
    res.status(201).send('movie was deleted from your favorites');
  } else {
    res.status(400).send('movie was not deleted');
  }
});

//removing an existing user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find(user => user.id === id);

  if (user) {
    users = users.filter(user => user.id !== req.params.id);
    res.status(201).send('User ' + req.params.id + ' was deleted.');
  }
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