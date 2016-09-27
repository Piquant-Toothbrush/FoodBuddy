'use strict';
//////////////////
///////////////The algorithm
/////////////////////
const helper = (num1,num2)=>{
const diff = Math.abs(num1 - num2);
 return 5 - diff;
};

const comp = (first, second)=> {
const final = [];
  for (let i = 0; i < first.length; i++) {

    for (let x = 0; x < second.length; x++) {

      if (first[i][0] === second[x][0]) {

    final.push(helper(first[i][1],second[x][1]));

      }
    }
  }

const sum = final.reduce((a,b) => a + b, 0);
  return Math.round(20 * sum / final.length);
};
///////////////////////////////
/////////////////////////////
//////////////////////////


const mysql = require('mysql');
const Movie = require('../app/models/movie');
const Rating = require('../app/models/rating');
const Relation = require('../app/models/relation');
const User = require('../app/models/user');
const allRequest = require('../app/models/allRequest');

// var Movies = require('../app/collections/movies');
const Ratings = require('../app/collections/ratings');
// var Relations = require('../app/collections/relations');
const Users = require('../app/collections/users');
var allRequests = require('../app/collections/allRequests');

const Promise = require('bluebird');
const request = require('request');

const pool  = mysql.createPool({
  connectionLimit : 4,
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '12345',
  database: process.env.DATABASE_NAME || 'MainDatabase'
});

/////////////////
////user auth
/////////////////

exports.signupUser = (req, res)=> {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(found =>{
    if (found) {
      //check password
         //if (password matches)
         //{ add sessions and redirect}
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
        username: req.body.name,
        password: req.body.password,
      })
      .then(function(user) {
        console.log('created a new user');
        res.status(201).send('login created');
      });
    }
  });
};


exports.sendWatchRequest = (req, response)=> {
  console.log(req.body.requestee);
  let requestees;
  if (Array.isArray(req.body.requestee)) {
    requestees = req.body.requestee;
  } else {
    requestees = [req.body.requestee];
  }
  Promise.each(requestees, requestee => {
    allRequests.create({
      requestor: req.mySession.user,
      requestee: requestee,
      requestTyp: 'watch',
      movie: req.body.movie,
      message: req.body.message
    });
  })
  .then(done => {
    response.send('Success');
  })
  .catch(err => {
    response.status(500).json({error: true, data: {message: err.message}});
  });
};

exports.removeWatchRequest = function(req, res) {
  if (Array.isArray(req.body.requestee)) {
    var requestees = req.body.requestee;
  } else {
    var requestees = [req.body.requestee];
  }
  var requestor = req.body.requestor;
  var movie = req.body.movie;

  allRequest.forge({requestor: requestor, requestee: requestees, movie: movie })
  .fetch()
  .then(theRequest => {
    theRequest.destroy()
    .then(() => {
      res.json({error: true, data: {message: 'User successfully deleted'}});
    })
    .catch(err => {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  .catch(function(err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};


exports.sendRequest = (req, response)=> {
  console.log('this is what Im getting', req.body);
  let newRequest;
  if (req.mySession.user === req.body.name) {
    response.send("You can't friend yourself!");
  } else {
      newRequest = {
      requestor: req.mySession.user,
      requestee: req.body.name,
      requestTyp: 'friend'
    };

    pool.getConnection(function(err, con) {
      if (err) { console.log(err, 'sendRequest'); throw err; }
      con.query('SELECT requestee,response FROM allrequests WHERE  requestor = ? AND requestTyp =' + '"' + 'friend' + '"', newRequest.requestor, (err, res) => {
        if (err) { throw err; }
        if (!res) {
          response.send('no friends');
        }

        var pplReqd = res.filter( a => a.response === null);
        var requestees = pplReqd.map( a => a.requestee );
        console.log('names of people whom Ive requested as friends', pplReqd);

        con.query('INSERT INTO allrequests SET ?', newRequest, (err, resp) => {
          if (err) { throw err; }
          console.log('Last insert ID:', resp.insertId);
          response.send(requestees);
          con.release();
        });
      });
    });
  }
};


exports.listRequests = (req, response) => {
  var requestee = req.mySession.user;
  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'listRequests'); throw err; }
    con.query('Select * FROM allrequests WHERE requestee=' + '"' + requestee + '"' + '' + 'OR requestor =' + '"' + request + '"' + '', function(err, res) {
      if (err) { throw err; }
      console.log(res);
      response.send([res, request]);
      con.release();
    });
  });
};


exports.accept = function(req, response) {
  var requestor = req.body.personToAccept;
  var requestee = req.mySession.user;
  var movie = req.body.movie;
  var requestType = 'friend';

  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'accept'); throw err; }
    if (movie === '') {
      con.query('UPDATE allrequests SET response='+'"' + 'yes' + '"'+'  WHERE requestor = '+'"'+ requestor+'"'+' AND requestTyp='+'"'+requestType+'"', (err, res)=> {
        if (err) throw err;
          console.log('Last insert ID:', res.insertId);
      })
    } else {
      con.query('UPDATE allrequests SET response='+'"' + 'yes' + '"'+'  WHERE requestor = '+'"'+ requestor+'"'+' AND movie='+'"'+ movie+'"', (err, res)=> {
        if (err) throw err;
          console.log('Last insert ID:', res.insertId);
      });
    }

    con.query('SELECT id FROM users WHERE username = ?', requestor, (err, res)=> {
      if (err) throw err;
      console.log('Last insert ID:', res[0].id, err);
      var person1 = res[0].id;
      con.query('SELECT id FROM users WHERE username = ?', requestee, (err, resp)=> {
        if (err) throw err;
        console.log('Last insert ID:', resp[0].id, err);

        var person2 = resp[0].id;
        var request = {
          user1id: person1,
          user2id: person2
        }
        var request2 = {
          user1id: person2,
          user2id: person1
        }

        console.log('the requests:::',request,request2)
        con.query('INSERT INTO relations SET ?', request, (err, res)=> {
          if (err) throw err;
          console.log('Last insert ID:', res.insertId);

        con.query('INSERT INTO relations SET ?', request2, (err, res)=> {
          if (err) throw err;
            console.log('Last insert ID:', res.insertId);
            response.send('Success');
            con.release();
          });
        });
      });
    });
  });
};


exports.removeRequest = (req, res) =>{
  var requestor = req.body.requestor;
  var requestee = req.body.requestee;

  allRequest.forge({requestor: requestor, requestee: requestee})
    .fetch().then(function(theRequest) {
      theRequest.destroy()
        .then(function() {
          res.json({error: true, data: {message: 'User successfully deleted'}});
        })
        .catch(err => {
          res.status(500).json({error: true, data: {message: err.message}});
        });
    })
    .catch(err => {
      res.status(500).json({error: true, data: {message: err.message}});
    });
};

exports.getThisFriendsMovies = (req, response) => {

  var movies = [];
  console.log(req.body.specificFriend);
  var person = req.body.specificFriend;
  var id = null;
  var len = null;
  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'getThisFriendsMovies'); throw err; }
    con.query('SELECT id FROM users WHERE username = ?', person, (err, resp)=> {
      if (err) { throw err; }
      id = resp[0].id;
      console.log(id);

      con.query('SELECT * FROM ratings WHERE userid = ?', id, (err, resp)=> {
        if (err) {
          console.log('errrrrrrrr', err, resp.length);
          throw err;
        }
        len = resp.length;
        resp.forEach(a => {
          con.query('SELECT title FROM movies WHERE id = ?', a.movieid, (err, resp)=> {
            if (err) { throw err; }
            movies.push([resp[0].title, a.score, a.review]);
            console.log(movies);
            if (movies.length === len) {
              response.send(movies);
              con.release();
            }
          });
        });
      });
    });

  });
};


exports.findMovieBuddies = function(req, response) {
  console.log("you're trying to find buddies!!");
  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'findMovieBuddies'); throw err; }
    con.query('SELECT * FROM users', (err, resp)=> {
      var people = resp.map(a => a.username);
      var Ids = resp.map(a => a.id);
      var idKeyObj = {};
      for (var i = 0; i < Ids.length; i++) {
        idKeyObj[Ids[i]] = people[i];
      }

      var currentUser = req.mySession.user;
      console.log('current user', currentUser);

      var obj1 = {};
      for (var i = 0; i < Ids.length; i++) {
        obj1[idKeyObj[Ids[i]]] = [];
      }

      con.query('SELECT score,movieid,userid FROM ratings', (err, respon)=> {

        for (var i = 0; i < respon.length; i++) {
          obj1[idKeyObj[respon[i].userid]].push([respon[i].movieid, respon[i].score]);
        }

        console.log('obj1', obj1);
        var currentUserInfo = obj1[currentUser];

        var comparisons = {};

        for (var key in obj1) {
          if (key !== currentUser) {
            comparisons[key] = comp(currentUserInfo, obj1[key]);
          }
        }
        console.log(comparisons);
        var finalSend = [];
        for (var key in comparisons) {
          if (comparisons[key] !== 'NaN%') {
            finalSend.push([key, comparisons[key]]);
          } else {
            finalSend.push([key, 'No Comparison to Make']);
          }
        }
        response.send(finalSend);
        con.release();
      });
    });
  });
};


exports.decline = function(req,response){
  var requestor = req.body.personToDecline;
  var requestee = req.mySession.user;
  var movie = req.body.movie;
  var requestType = 'friend';
  var addOn=!movie?' AND requestTyp='+'"'+ requestType+'"':' AND requestee='+'"'+ requestee+'"'+' AND movie ='+'"'+movie+'"';
  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'decline'); throw err; }    
    con.query('UPDATE allrequests SET response='+'"' + 'no' + '"'+ ' WHERE requestor = '+'"'+ requestor+'"'+addOn, (err, res)=> {
      if (err) { throw err; }
      console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
      con.release();
    });
  });
};

exports.signupUser = function(req, res) {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(found => {
    if (found) {
      //check password
         //if (password matches)
         //{ add sessions and redirect}
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
        username: req.body.name,
        password: req.body.password,
      })
      .then(user => {
        console.log('created a new user');
        res.status(201).send('login created');
      })
      .catch(err => {
        console.log(err.message);
        res.status(400).json({error: true, data: {message: 'user cannot be created'}});
      });
    }
  });
};

exports.signinUser = (req, res)=> {
  console.log('calling signin', req.body);
  new User({ username: req.body.name }).fetch().then(found=>{
    if (found){
      new User({ username: req.body.name, password:req.body.password}).fetch().then(user=>{
        if (user){
          req.mySession.user = user.attributes.username;
          console.log('found ', found.attributes.username);
          res.send(['it worked',req.mySession.user]);
        } else {
          console.log('wrong password');
          res.status(404).send('bad login');
        }
      });
    } else {
      res.status(404).send('bad login');
      console.log('user not found');
    }
  });
};

exports.logout = function(req, res) {
  req.mySession.destroy(function(err){
    console.log(err);
  });
  console.log('logout');
  res.send('logout');
};


/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function(req, res) {
  console.log('calling rateMovie');
  let userid;
  return new User({ username: req.mySession.user }).fetch()
  .then(foundUser => {
    userid = foundUser.attributes.id;
    return new Rating({ movieid: req.body.id, userid: userid }).fetch()
    .then(foundRating => {
      if (foundRating) {
        //since rating or review is updated seperatly in client, the following
        //make sure it gets updated according to the req
        // console.log('update rating', foundRating)
        let ratingObj;
        if (req.body.rating) {
          ratingObj = {score: req.body.rating};
        } else if (req.body.review) {
          ratingObj = {review: req.body.review};
        }
        return new Rating({'id': foundRating.attributes.id})
          .save(ratingObj);
      } else {
        console.log('creating rating');
        return Ratings.create({
          score: req.body.rating,
          userid: userid,
          movieid: req.body.id,
          review: req.body.review
        });
      }
    });
  })
  .then(newRating => {
    console.log('rating created:', newRating.attributes);
    res.status(201).send('rating recieved');
  })
  .catch(err => {
    console.log(err.message);
    res.status(400).send('error');
  });
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = movieObj => {
  let genre = (movieObj.genre_ids) ? genres[movieObj.genre_ids[0]] : 'n/a';
  return new Movie({
    id: movieObj.id,
    title: movieObj.title,
    genre: genre,
    poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
    release_date: movieObj.release_date,
    description: movieObj.overview.slice(0, 255),
    imdbRating: movieObj.vote_average
  }).save(null, {method: 'insert'})
  .then(newMovie => {
    console.log('movie created', newMovie.attributes.title);
    return newMovie;
  })
  .catch(err => {
    console.log(err.message, 'problem creating movie');
  });
};


//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// will get ratings for the current user

exports.getUserRatings = function(req, res) {
  Rating.query(qb => {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review', 'ratings.updated_at');
    qb.where('users.username', '=', req.mySession.user);
    qb.orderBy('updated_at', 'DESC');
  })
  .fetchAll()
  .then(ratings => {
    //decorate it with avg friend rating
    return Promise.map(ratings.models, function(rating) {
      return attachFriendAvgRating(rating, req.mySession.user);
    });
  })
  .then(ratings => {
    console.log('retriving all user ratings');
    res.status(200).json(ratings);
  })
  .catch(err => {
    console.log(err.message, ' unable to retrive ratings');
    res.status(400).send('unable to retrive ratings');
  });
};

exports.getFriendUserRatings = function(req, res) {
  Rating.query(qb => {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score as friendScore', 'ratings.review as friendReview', 'ratings.updated_at');
    qb.where('users.username', '=', req.query.friendName);
    qb.orderBy('updated_at', 'DESC');
  })
  .fetchAll()
  .then(ratings => {
    //decorate it with current user's rating
    return Promise.map(ratings.models, function(rating) {
      return attachUserRating(rating, req.mySession.user);
    });
  })
  .then(ratings => {
    console.log('retriving all user ratings');
    res.status(200).json(ratings);
  })
  .catch(err => {
    console.log(err.message, ' unable to retrive average friend ratings');
    res.status(400).send('unable to retrive average friend ratings');
  });
};

//a decorator function that attaches friend avg rating to the rating obj
const attachFriendAvgRating = function(rating, username) {
  return getFriendRatings(username, rating)
  .then(friendsRatings => {
    //if friendsRatings is null, Rating.attributes.friendAverageRating is null
    if (!friendsRatings) {
      rating.attributes.friendAverageRating = null;
    } else {
      rating.attributes.friendAverageRating = averageRating(friendsRatings);
    }
    return rating;
  });
};

//a decorator function that attaches user rating and reviews to the rating obj
const attachUserRating = (rating, username) => {
  return Rating.query(qb => {
    qb.innerJoin('users', 'users.id', '=', 'ratings.userid');
    qb.innerJoin('movies', 'movies.id', '=', 'ratings.movieid');
    qb.select('ratings.score', 'ratings.review');
    qb.where({
      'users.username': username,
      'movies.title': rating.attributes.title,
      'movies.id': rating.attributes.id
    });
  })
  .fetch()
  .then(userRating => {
    if (userRating) {
      rating.attributes.score = userRating.attributes.score;
      rating.attributes.review = userRating.attributes.review;
    } else {
      rating.attributes.score = null;
      rating.attributes.review = null;
    }
    return rating;
  })
  .catch(err => {
    console.log(err.message, ' cannot find user rating');
  });
};

//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = (req, res) => {
  console.log('handleGetFriendRatings, ', req.mySession.user, req.body.movie.title);
  getFriendRatings(req.mySession.user, {attributes: req.body.movie})
  .then(friendRatings => {
    res.json(friendRatings);
  })
  .catch(err => {
    console.log(err.message);
    res.status(400).send('unable to retrive friend ratings for the movie');
  });
};

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
const getFriendRatings = (username, movieObj) => {
  return User.query(qb => {
    qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
    qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('relations.user2id', 'movies.title', 'ratings.score', 'ratings.review');
    qb.where({
      'users.username': username,
      'movies.title': movieObj.attributes.title,
      'movies.id': movieObj.attributes.id });
  })
  .fetchAll()
  .then(friendsRatings => {
  //the following block adds the friendName attribute to the ratings
    return Promise.map(friendsRatings.models, friendRating => {
      return new User({ id: friendRating.attributes.user2id }).fetch()
      .then(friend => {
        friendRating.attributes.friendUserName = friend.attributes.username;
        friendRating.attributes.friendFirstName = friend.attributes.firstName;
        return friendRating;
      })
      .catch(err => {
        console.log(err.message);
        throw err;
      });
    });
  })
  .then(friendsRatings => {
    return friendsRatings;
  })
  .catch(err => {
    console.log(err.message);
    throw err;
  });
};


//a helper function that averages the rating
//inputs ratings, outputs the average score;
const averageRating = (ratings) => {
  //return null if no friend has rated the movie
  if (ratings.length === 0) { return null; }
  return ratings.reduce((total, rating) => total + rating.attributes.score, 0) / ratings.length;
};


//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
const getOneMovieRating = (username, movieObj) => {
  return Rating.query(qb => {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    qb.where({'users.username': username, 'movies.title': movieObj.title, 'movies.id': movieObj.id});
  })
  .fetch()
  .then(rating => {
    if (!rating) {
      //if the user has not rated the movie, return an obj that has the movie information, but score is set to null
      return new Movie({title: movieObj.title, id: movieObj.id}).fetch()
      .then(movie => {
        movie.attributes.score = null;
        return movie;
      });
    } else {
      return rating;
    }
  })
  .then(rating => {
    return getFriendRatings(username, rating)
    .then(friendsRatings => {
      // console.log('friendsRatings', friendsRatings);
      rating.attributes.friendAverageRating = averageRating(friendsRatings);
      console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
      return rating;
    })
    .catch(err => {
      console.log(err.message, ' unable to retrieve friend ratings');
      throw err;
    });
  })
  .catch(err => {
    console.log(err.message, ' unable to retrieve friend ratings');
    throw err;
  });
};


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = (req, res) => {
  console.log('getMultipleMovieRatings');
  Promise.map(req.body.movies, movie => {
    //first check whether movie is in the database
    return new Movie({title: movie.title, id: movie.id}).fetch()
    .then(foundMovie => {
      //if not create one
      if (!foundMovie) {
        return addOneMovie(movie);
      } else {
        return foundMovie;
      }
    })
    .then(foundMovie =>{
      // console.log('found movie', foundMovie);
      return getOneMovieRating(req.mySession.user, foundMovie.attributes);
    })
    .catch(err => {
      console.log(err, 'cannot add movie');
      throw err;
    });
  })
  .then(ratings => {
    console.log('sending rating to client');
    res.json(ratings);
  })
  .catch(err => {
    console.log(err, 'cannot get movie');
    throw err;
  });
};

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = (req, res) => {
  let params = {
    api_key: '9d3b035ef1cd669aed398400b17fcea2',
    primary_release_year: new Date().getFullYear(),
    include_adult: false,
    sort_by: 'popularity.desc'
  };

  let data = '';
  request({
    method: 'GET',
    url: 'https://api.themoviedb.org/3/discover/movie/',
    qs: params
  })
  .on('data', chunk => {
    data += chunk;
  })
  .on('end', () => {
    req.body.movies = JSON.parse(data).results;
    //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
    exports.getMultipleMovieRatings(req, res);

  })
  .on('error', error => {
    console.log(error, 'TheMovieDB does not respond');
  });

};

//this is TMDB's genre code, we might want to place this somewhere else
const genres = {
   12: 'Adventure',
   14: 'Fantasy',
   16: 'Animation',
   18: 'Drama',
   27: 'Horror',
   28: 'Action',
   35: 'Comedy',
   36: 'History',
   37: 'Western',
   53: 'Thriller',
   80: 'Crime',
   99: 'Documentary',
   878: 'Science Fiction',
   9648: 'Mystery',
   10402: 'Music',
   10749: 'Romance',
   10751: 'Family',
   10752: 'War',
   10769: 'Foreign',
   10770: 'TV Movie'
 };

//this function will send back searcb movies user has rated in the database
//it will send back movie objs that match the search input, expects movie name in req.body.title
exports.searchRatedMovie = function(req, res) {
  return Rating.query(qb => {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    qb.whereRaw(`MATCH (movies.title) AGAINST ('${req.query.title}' IN NATURAL LANGUAGE MODE)`);
    qb.andWhere('users.username', '=', req.mySession.user);
    qb.orderBy('updated_at', 'DESC');
  })
  .fetchAll()
  .then(matches => {
    console.log(matches.models);
    res.json(matches);
  })
  .catch(err => {
    console.log(err.message, ' unable to search DB');
    res.status(400).send('unable to search');
  });
};

////////////////////////
/////friendship handlers
////////////////////////

exports.getFriendList = function(req, res) {
  return Relation.query(qb => {
    qb.innerJoin('users', 'relations.user1id', '=', 'users.id');
    qb.select('relations.user2id');
    qb.where({
      'users.username': req.mySession.user
    });
  })
  .fetchAll()
  .then(friends => {
    return Promise.map(friends.models, function(friend) {
      return new User({id: friend.attributes.user2id}).fetch()
      .then(function(friendUser){
        return friendUser.attributes.username;
      })
      .catch(err => {
        console.log(err.message);
        throw err;
      });
    });
  })
  .then(function(friends){
    console.log('sending a list of friend names', friends);
    res.json(friends);
  })
  .catch(err => {
    console.log(err.message, ' unable to get friends');
    res.status(400).send('unable to get friends');
  });
};


exports.getFriends = function(req, res) {
  var peopleId = [];
  var id = req.mySession.user;
  pool.getConnection((err, con) => {
    if (err) { console.log(err, 'getFriends'); throw err; }
    con.query('SELECT id FROM users WHERE username = ?', id, function(err, resp) {
      var userid = resp[0].id;
      console.log('this should be ling/2',id)
    
      con.query('SELECT * FROM ratings WHERE userid = ?', userid, function(err, resp) {
        var usersRatings=resp.map(function(a){ return [a.movieid, a.score]});

        con.query('SELECT * FROM relations WHERE user1id = ?', userid, function(err, resp) {
          for (var i = 0; i < resp.length; i++) {
            if (peopleId.indexOf(resp[i].user2id) === -1) {
              peopleId.push(resp[i].user2id);
            }
          }
          var people = []
          console.log('This should also be peopleee',peopleId);
          var keyId={};
          peopleId.forEach(function(a) {

            con.query('SELECT username FROM users WHERE id = ?', a, function(err, respo) {
              keyId[a]=respo[0].username;
              console.log('this is ONE of the people!!',respo[0].username)
              con.query('SELECT * FROM ratings WHERE userid ='+'"'+a+'"', function(err, re) {
                console.log('this is a',a)
                if (re.length===0){
                  re=[{userid:a,movieid:Math.round(Math.random()*10000),score:99}]
                }
                console.log('this should be the ratings from each person!!',re);

                people.push(re.map(function(a){return [a.userid,a.movieid,a.score];}));
                
                if (people.length===peopleId.length){
                  var final = {};

                  console.log('this should be people', people);
                  for (var i = 0; i < people.length; i++) {
                    if (people[i][0]!==undefined){
                      final[keyId[people[i][0][0]]] = [];
                      for (var x = 0; x < people[i].length; x++) {
                        final[keyId[people[i][0][0]]].push([]);
                        for (var z = 1; z < people[i][x].length; z++) {
                          final[keyId[people[i][0][0]]][x].push(people[i][x][z])
                        }
                      }
                    }
                  }

                  console.log('final',final,usersRatings);

                  var comparisons={};
                  for (var key in final){
                    comparisons[key]=comp(usersRatings,final[key])
                  }
                  console.log(comparisons);
                  var veryFinal=[];
                  for (var key in comparisons){
                    veryFinal.push([key,comparisons[key]])
                  }
                  console.log(veryFinal);
                  res.send(veryFinal);
                  con.release();
                }
              })
            })
          });
        })
      })
    })
  });
};

