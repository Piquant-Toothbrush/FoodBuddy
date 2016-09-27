'use strict';
//////////////////
///////////////The algorithm
/////////////////////

var helper = function helper(num1, num2) {
  var diff = Math.abs(num1 - num2);
  return 5 - diff;
};

var comp = function comp(first, second) {
  var final = [];
  for (var i = 0; i < first.length; i++) {

    for (var x = 0; x < second.length; x++) {

      if (first[i][0] === second[x][0]) {

        final.push(helper(first[i][1], second[x][1]));
      }
    }
  }

  var sum = final.reduce(function (a, b) {
    return a + b;
  }, 0);
  return Math.round(20 * sum / final.length);
};
///////////////////////////////
/////////////////////////////
//////////////////////////


var mysql = require('mysql');
var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');
var User = require('../app/models/user');
var allRequest = require('../app/models/allRequest');

// var Movies = require('../app/collections/movies');
var Ratings = require('../app/collections/ratings');
// var Relations = require('../app/collections/relations');
var Users = require('../app/collections/users');
var allRequests = require('../app/collections/allRequests');

var Promise = require('bluebird');
var request = require('request');

var pool = mysql.createPool({
  connectionLimit: 4,
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '12345',
  database: process.env.DATABASE_NAME || 'MainDatabase'
});

/////////////////
////user auth
/////////////////

exports.signupUser = function (req, res) {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function (found) {
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
        password: req.body.password
      }).then(function (user) {
        console.log('created a new user');
        res.status(201).send('login created');
      });
    }
  });
};

exports.sendWatchRequest = function (req, response) {
  console.log(req.body.requestee);
  var requestees = void 0;
  if (Array.isArray(req.body.requestee)) {
    requestees = req.body.requestee;
  } else {
    requestees = [req.body.requestee];
  }
  Promise.each(requestees, function (requestee) {
    allRequests.create({
      requestor: req.mySession.user,
      requestee: requestee,
      requestTyp: 'watch',
      movie: req.body.movie,
      message: req.body.message
    });
  }).then(function (done) {
    response.send('Success');
  }).catch(function (err) {
    response.status(500).json({ error: true, data: { message: err.message } });
  });
};

exports.removeWatchRequest = function (req, res) {
  if (Array.isArray(req.body.requestee)) {
    var requestees = req.body.requestee;
  } else {
    var requestees = [req.body.requestee];
  }
  var requestor = req.body.requestor;
  var movie = req.body.movie;

  allRequest.forge({ requestor: requestor, requestee: requestees, movie: movie }).fetch().then(function (theRequest) {
    theRequest.destroy().then(function () {
      res.json({ error: true, data: { message: 'User successfully deleted' } });
    }).catch(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  }).catch(function (err) {
    res.status(500).json({ error: true, data: { message: err.message } });
  });
};

exports.sendRequest = function (req, response) {
  console.log('this is what Im getting', req.body);
  var newRequest = void 0;
  if (req.mySession.user === req.body.name) {
    response.send("You can't friend yourself!");
  } else {
    newRequest = {
      requestor: req.mySession.user,
      requestee: req.body.name,
      requestTyp: 'friend'
    };

    pool.getConnection(function (err, con) {
      if (err) {
        console.log(err, 'sendRequest');throw err;
      }
      con.query('SELECT requestee,response FROM allrequests WHERE  requestor = ? AND requestTyp =' + '"' + 'friend' + '"', newRequest.requestor, function (err, res) {
        if (err) {
          throw err;
        }
        if (!res) {
          response.send('no friends');
        }

        var pplReqd = res.filter(function (a) {
          return a.response === null;
        });
        var requestees = pplReqd.map(function (a) {
          return a.requestee;
        });
        console.log('names of people whom Ive requested as friends', pplReqd);

        con.query('INSERT INTO allrequests SET ?', newRequest, function (err, resp) {
          if (err) {
            throw err;
          }
          console.log('Last insert ID:', resp.insertId);
          response.send(requestees);
          con.release();
        });
      });
    });
  }
};

exports.listRequests = function (req, response) {
  var requestee = req.mySession.user;
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'listRequests');throw err;
    }
    con.query('Select * FROM allrequests WHERE requestee=' + '"' + requestee + '"' + '' + 'OR requestor =' + '"' + request + '"' + '', function (err, res) {
      if (err) {
        throw err;
      }
      console.log(res);
      response.send([res, request]);
      con.release();
    });
  });
};

exports.accept = function (req, response) {
  var requestor = req.body.personToAccept;
  var requestee = req.mySession.user;
  var movie = req.body.movie;
  var requestType = 'friend';

  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'accept');throw err;
    }
    if (movie === '') {
      con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND requestTyp=' + '"' + requestType + '"', function (err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      });
    } else {
      con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND movie=' + '"' + movie + '"', function (err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      });
    }

    con.query('SELECT id FROM users WHERE username = ?', requestor, function (err, res) {
      if (err) throw err;
      console.log('Last insert ID:', res[0].id, err);
      var person1 = res[0].id;
      con.query('SELECT id FROM users WHERE username = ?', requestee, function (err, resp) {
        if (err) throw err;
        console.log('Last insert ID:', resp[0].id, err);

        var person2 = resp[0].id;
        var request = {
          user1id: person1,
          user2id: person2
        };
        var request2 = {
          user1id: person2,
          user2id: person1
        };

        console.log('the requests:::', request, request2);
        con.query('INSERT INTO relations SET ?', request, function (err, res) {
          if (err) throw err;
          console.log('Last insert ID:', res.insertId);

          con.query('INSERT INTO relations SET ?', request2, function (err, res) {
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

exports.removeRequest = function (req, res) {
  var requestor = req.body.requestor;
  var requestee = req.body.requestee;

  allRequest.forge({ requestor: requestor, requestee: requestee }).fetch().then(function (theRequest) {
    theRequest.destroy().then(function () {
      res.json({ error: true, data: { message: 'User successfully deleted' } });
    }).catch(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  }).catch(function (err) {
    res.status(500).json({ error: true, data: { message: err.message } });
  });
};

exports.getThisFriendsMovies = function (req, response) {

  var movies = [];
  console.log(req.body.specificFriend);
  var person = req.body.specificFriend;
  var id = null;
  var len = null;
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'getThisFriendsMovies');throw err;
    }
    con.query('SELECT id FROM users WHERE username = ?', person, function (err, resp) {
      if (err) {
        throw err;
      }
      id = resp[0].id;
      console.log(id);

      con.query('SELECT * FROM ratings WHERE userid = ?', id, function (err, resp) {
        if (err) {
          console.log('errrrrrrrr', err, resp.length);
          throw err;
        }
        len = resp.length;
        resp.forEach(function (a) {
          con.query('SELECT title FROM movies WHERE id = ?', a.movieid, function (err, resp) {
            if (err) {
              throw err;
            }
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

exports.findMovieBuddies = function (req, response) {
  console.log("you're trying to find buddies!!");
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'findMovieBuddies');throw err;
    }
    con.query('SELECT * FROM users', function (err, resp) {
      var people = resp.map(function (a) {
        return a.username;
      });
      var Ids = resp.map(function (a) {
        return a.id;
      });
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

      con.query('SELECT score,movieid,userid FROM ratings', function (err, respon) {

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

exports.decline = function (req, response) {
  var requestor = req.body.personToDecline;
  var requestee = req.mySession.user;
  var movie = req.body.movie;
  var requestType = 'friend';
  var addOn = !movie ? ' AND requestTyp=' + '"' + requestType + '"' : ' AND requestee=' + '"' + requestee + '"' + ' AND movie =' + '"' + movie + '"';
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'decline');throw err;
    }
    con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + addOn, function (err, res) {
      if (err) {
        throw err;
      }
      console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
      con.release();
    });
  });
};

exports.signupUser = function (req, res) {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function (found) {
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
        password: req.body.password
      }).then(function (user) {
        console.log('created a new user');
        res.status(201).send('login created');
      }).catch(function (err) {
        console.log(err.message);
        res.status(400).json({ error: true, data: { message: 'user cannot be created' } });
      });
    }
  });
};

exports.signinUser = function (req, res) {
  console.log('calling signin', req.body);
  new User({ username: req.body.name }).fetch().then(function (found) {
    if (found) {
      new User({ username: req.body.name, password: req.body.password }).fetch().then(function (user) {
        if (user) {
          req.mySession.user = user.attributes.username;
          console.log('found ', found.attributes.username);
          res.send(['it worked', req.mySession.user]);
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

exports.logout = function (req, res) {
  req.mySession.destroy(function (err) {
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
exports.rateMovie = function (req, res) {
  console.log('calling rateMovie');
  var userid = void 0;
  return new User({ username: req.mySession.user }).fetch().then(function (foundUser) {
    userid = foundUser.attributes.id;
    return new Rating({ movieid: req.body.id, userid: userid }).fetch().then(function (foundRating) {
      if (foundRating) {
        //since rating or review is updated seperatly in client, the following
        //make sure it gets updated according to the req
        // console.log('update rating', foundRating)
        var ratingObj = void 0;
        if (req.body.rating) {
          ratingObj = { score: req.body.rating };
        } else if (req.body.review) {
          ratingObj = { review: req.body.review };
        }
        return new Rating({ 'id': foundRating.attributes.id }).save(ratingObj);
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
  }).then(function (newRating) {
    console.log('rating created:', newRating.attributes);
    res.status(201).send('rating recieved');
  }).catch(function (err) {
    console.log(err.message);
    res.status(400).send('error');
  });
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = function addOneMovie(movieObj) {
  var genre = movieObj.genre_ids ? genres[movieObj.genre_ids[0]] : 'n/a';
  return new Movie({
    id: movieObj.id,
    title: movieObj.title,
    genre: genre,
    poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
    release_date: movieObj.release_date,
    description: movieObj.overview.slice(0, 255),
    imdbRating: movieObj.vote_average
  }).save(null, { method: 'insert' }).then(function (newMovie) {
    console.log('movie created', newMovie.attributes.title);
    return newMovie;
  }).catch(function (err) {
    console.log(err.message, 'problem creating movie');
  });
};

//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// will get ratings for the current user

exports.getUserRatings = function (req, res) {
  Rating.query(function (qb) {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review', 'ratings.updated_at');
    qb.where('users.username', '=', req.mySession.user);
    qb.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (ratings) {
    //decorate it with avg friend rating
    return Promise.map(ratings.models, function (rating) {
      return attachFriendAvgRating(rating, req.mySession.user);
    });
  }).then(function (ratings) {
    console.log('retriving all user ratings');
    res.status(200).json(ratings);
  }).catch(function (err) {
    console.log(err.message, ' unable to retrive ratings');
    res.status(400).send('unable to retrive ratings');
  });
};

exports.getFriendUserRatings = function (req, res) {
  Rating.query(function (qb) {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score as friendScore', 'ratings.review as friendReview', 'ratings.updated_at');
    qb.where('users.username', '=', req.query.friendName);
    qb.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (ratings) {
    //decorate it with current user's rating
    return Promise.map(ratings.models, function (rating) {
      return attachUserRating(rating, req.mySession.user);
    });
  }).then(function (ratings) {
    console.log('retriving all user ratings');
    res.status(200).json(ratings);
  }).catch(function (err) {
    console.log(err.message, ' unable to retrive average friend ratings');
    res.status(400).send('unable to retrive average friend ratings');
  });
};

//a decorator function that attaches friend avg rating to the rating obj
var attachFriendAvgRating = function attachFriendAvgRating(rating, username) {
  return getFriendRatings(username, rating).then(function (friendsRatings) {
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
var attachUserRating = function attachUserRating(rating, username) {
  return Rating.query(function (qb) {
    qb.innerJoin('users', 'users.id', '=', 'ratings.userid');
    qb.innerJoin('movies', 'movies.id', '=', 'ratings.movieid');
    qb.select('ratings.score', 'ratings.review');
    qb.where({
      'users.username': username,
      'movies.title': rating.attributes.title,
      'movies.id': rating.attributes.id
    });
  }).fetch().then(function (userRating) {
    if (userRating) {
      rating.attributes.score = userRating.attributes.score;
      rating.attributes.review = userRating.attributes.review;
    } else {
      rating.attributes.score = null;
      rating.attributes.review = null;
    }
    return rating;
  }).catch(function (err) {
    console.log(err.message, ' cannot find user rating');
  });
};

//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = function (req, res) {
  console.log('handleGetFriendRatings, ', req.mySession.user, req.body.movie.title);
  getFriendRatings(req.mySession.user, { attributes: req.body.movie }).then(function (friendRatings) {
    res.json(friendRatings);
  }).catch(function (err) {
    console.log(err.message);
    res.status(400).send('unable to retrive friend ratings for the movie');
  });
};

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
var getFriendRatings = function getFriendRatings(username, movieObj) {
  return User.query(function (qb) {
    qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
    qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('relations.user2id', 'movies.title', 'ratings.score', 'ratings.review');
    qb.where({
      'users.username': username,
      'movies.title': movieObj.attributes.title,
      'movies.id': movieObj.attributes.id });
  }).fetchAll().then(function (friendsRatings) {
    //the following block adds the friendName attribute to the ratings
    return Promise.map(friendsRatings.models, function (friendRating) {
      return new User({ id: friendRating.attributes.user2id }).fetch().then(function (friend) {
        friendRating.attributes.friendUserName = friend.attributes.username;
        friendRating.attributes.friendFirstName = friend.attributes.firstName;
        return friendRating;
      }).catch(function (err) {
        console.log(err.message);
        throw err;
      });
    });
  }).then(function (friendsRatings) {
    return friendsRatings;
  }).catch(function (err) {
    console.log(err.message);
    throw err;
  });
};

//a helper function that averages the rating
//inputs ratings, outputs the average score;
var averageRating = function averageRating(ratings) {
  //return null if no friend has rated the movie
  if (ratings.length === 0) {
    return null;
  }
  return ratings.reduce(function (total, rating) {
    return total + rating.attributes.score;
  }, 0) / ratings.length;
};

//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
var getOneMovieRating = function getOneMovieRating(username, movieObj) {
  return Rating.query(function (qb) {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    qb.where({ 'users.username': username, 'movies.title': movieObj.title, 'movies.id': movieObj.id });
  }).fetch().then(function (rating) {
    if (!rating) {
      //if the user has not rated the movie, return an obj that has the movie information, but score is set to null
      return new Movie({ title: movieObj.title, id: movieObj.id }).fetch().then(function (movie) {
        movie.attributes.score = null;
        return movie;
      });
    } else {
      return rating;
    }
  }).then(function (rating) {
    return getFriendRatings(username, rating).then(function (friendsRatings) {
      // console.log('friendsRatings', friendsRatings);
      rating.attributes.friendAverageRating = averageRating(friendsRatings);
      console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
      return rating;
    }).catch(function (err) {
      console.log(err.message, ' unable to retrieve friend ratings');
      throw err;
    });
  }).catch(function (err) {
    console.log(err.message, ' unable to retrieve friend ratings');
    throw err;
  });
};

//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function (req, res) {
  console.log('getMultipleMovieRatings');
  Promise.map(req.body.movies, function (movie) {
    //first check whether movie is in the database
    return new Movie({ title: movie.title, id: movie.id }).fetch().then(function (foundMovie) {
      //if not create one
      if (!foundMovie) {
        return addOneMovie(movie);
      } else {
        return foundMovie;
      }
    }).then(function (foundMovie) {
      // console.log('found movie', foundMovie);
      return getOneMovieRating(req.mySession.user, foundMovie.attributes);
    }).catch(function (err) {
      console.log(err, 'cannot add movie');
      throw err;
    });
  }).then(function (ratings) {
    console.log('sending rating to client');
    res.json(ratings);
  }).catch(function (err) {
    console.log(err, 'cannot get movie');
    throw err;
  });
};

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = function (req, res) {
  var params = {
    api_key: '9d3b035ef1cd669aed398400b17fcea2',
    primary_release_year: new Date().getFullYear(),
    include_adult: false,
    sort_by: 'popularity.desc'
  };

  var data = '';
  request({
    method: 'GET',
    url: 'https://api.themoviedb.org/3/discover/movie/',
    qs: params
  }).on('data', function (chunk) {
    data += chunk;
  }).on('end', function () {
    req.body.movies = JSON.parse(data).results;
    //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
    exports.getMultipleMovieRatings(req, res);
  }).on('error', function (error) {
    console.log(error, 'TheMovieDB does not respond');
  });
};

//this is TMDB's genre code, we might want to place this somewhere else
var genres = {
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
exports.searchRatedMovie = function (req, res) {
  return Rating.query(function (qb) {
    qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
    qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    qb.whereRaw('MATCH (movies.title) AGAINST (\'' + req.query.title + '\' IN NATURAL LANGUAGE MODE)');
    qb.andWhere('users.username', '=', req.mySession.user);
    qb.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (matches) {
    console.log(matches.models);
    res.json(matches);
  }).catch(function (err) {
    console.log(err.message, ' unable to search DB');
    res.status(400).send('unable to search');
  });
};

////////////////////////
/////friendship handlers
////////////////////////

exports.getFriendList = function (req, res) {
  return Relation.query(function (qb) {
    qb.innerJoin('users', 'relations.user1id', '=', 'users.id');
    qb.select('relations.user2id');
    qb.where({
      'users.username': req.mySession.user
    });
  }).fetchAll().then(function (friends) {
    return Promise.map(friends.models, function (friend) {
      return new User({ id: friend.attributes.user2id }).fetch().then(function (friendUser) {
        return friendUser.attributes.username;
      }).catch(function (err) {
        console.log(err.message);
        throw err;
      });
    });
  }).then(function (friends) {
    console.log('sending a list of friend names', friends);
    res.json(friends);
  }).catch(function (err) {
    console.log(err.message, ' unable to get friends');
    res.status(400).send('unable to get friends');
  });
};

exports.getFriends = function (req, res) {
  var peopleId = [];
  var id = req.mySession.user;
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'getFriends');throw err;
    }
    con.query('SELECT id FROM users WHERE username = ?', id, function (err, resp) {
      var userid = resp[0].id;
      console.log('this should be ling/2', id);

      con.query('SELECT * FROM ratings WHERE userid = ?', userid, function (err, resp) {
        var usersRatings = resp.map(function (a) {
          return [a.movieid, a.score];
        });

        con.query('SELECT * FROM relations WHERE user1id = ?', userid, function (err, resp) {
          for (var i = 0; i < resp.length; i++) {
            if (peopleId.indexOf(resp[i].user2id) === -1) {
              peopleId.push(resp[i].user2id);
            }
          }
          var people = [];
          console.log('This should also be peopleee', peopleId);
          var keyId = {};
          peopleId.forEach(function (a) {

            con.query('SELECT username FROM users WHERE id = ?', a, function (err, respo) {
              keyId[a] = respo[0].username;
              console.log('this is ONE of the people!!', respo[0].username);
              con.query('SELECT * FROM ratings WHERE userid =' + '"' + a + '"', function (err, re) {
                console.log('this is a', a);
                if (re.length === 0) {
                  re = [{ userid: a, movieid: Math.round(Math.random() * 10000), score: 99 }];
                }
                console.log('this should be the ratings from each person!!', re);

                people.push(re.map(function (a) {
                  return [a.userid, a.movieid, a.score];
                }));

                if (people.length === peopleId.length) {
                  var final = {};

                  console.log('this should be people', people);
                  for (var i = 0; i < people.length; i++) {
                    if (people[i][0] !== undefined) {
                      final[keyId[people[i][0][0]]] = [];
                      for (var x = 0; x < people[i].length; x++) {
                        final[keyId[people[i][0][0]]].push([]);
                        for (var z = 1; z < people[i][x].length; z++) {
                          final[keyId[people[i][0][0]]][x].push(people[i][x][z]);
                        }
                      }
                    }
                  }

                  console.log('final', final, usersRatings);

                  var comparisons = {};
                  for (var key in final) {
                    comparisons[key] = comp(usersRatings, final[key]);
                  }
                  console.log(comparisons);
                  var veryFinal = [];
                  for (var key in comparisons) {
                    veryFinal.push([key, comparisons[key]]);
                  }
                  console.log(veryFinal);
                  res.send(veryFinal);
                  con.release();
                }
              });
            });
          });
        });
      });
    });
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiREFUQUJBU0VfSE9TVCIsInVzZXIiLCJEQVRBQkFTRV9VU0VSIiwicGFzc3dvcmQiLCJEQVRBQkFTRV9QQVNTV09SRCIsImRhdGFiYXNlIiwiREFUQUJBU0VfTkFNRSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJyZXF1ZXN0ZWVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZWFjaCIsInJlcXVlc3RvciIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsIm1lc3NhZ2UiLCJjYXRjaCIsImpzb24iLCJlcnJvciIsImRhdGEiLCJlcnIiLCJyZW1vdmVXYXRjaFJlcXVlc3QiLCJmb3JnZSIsInRoZVJlcXVlc3QiLCJkZXN0cm95Iiwic2VuZFJlcXVlc3QiLCJuZXdSZXF1ZXN0IiwiZ2V0Q29ubmVjdGlvbiIsImNvbiIsInF1ZXJ5IiwicHBsUmVxZCIsImZpbHRlciIsIm1hcCIsInJlc3AiLCJpbnNlcnRJZCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwiaWQiLCJwZXJzb24xIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJzcGVjaWZpY0ZyaWVuZCIsInBlcnNvbiIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInVuZGVmaW5lZCIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxJQUFELEVBQU1DLElBQU4sRUFBYTtBQUM1QixNQUFNQyxPQUFPQyxLQUFLQyxHQUFMLENBQVNKLE9BQU9DLElBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLElBQVg7QUFDQSxDQUhEOztBQUtBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBa0I7QUFDL0IsTUFBTUMsUUFBUSxFQUFkO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1B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QVIsQ0FBWSxPQUFaLEVBQW9CeEMsS0FBcEIsRUFBMEJvTSxZQUExQjs7QUFFQSxzQkFBSXBGLGNBQVksRUFBaEI7QUFDQSx1QkFBSyxJQUFJQyxHQUFULElBQWdCakgsS0FBaEIsRUFBc0I7QUFDcEJnSCxnQ0FBWUMsR0FBWixJQUFpQnBILEtBQUt1TSxZQUFMLEVBQWtCcE0sTUFBTWlILEdBQU4sQ0FBbEIsQ0FBakI7QUFDRDtBQUNEMUUsMEJBQVFDLEdBQVIsQ0FBWXdFLFdBQVo7QUFDQSxzQkFBSTRGLFlBQVUsRUFBZDtBQUNBLHVCQUFLLElBQUkzRixHQUFULElBQWdCRCxXQUFoQixFQUE0QjtBQUMxQjRGLDhCQUFVeE0sSUFBVixDQUFlLENBQUM2RyxHQUFELEVBQUtELFlBQVlDLEdBQVosQ0FBTCxDQUFmO0FBQ0Q7QUFDRDFFLDBCQUFRQyxHQUFSLENBQVlvSyxTQUFaO0FBQ0F0SyxzQkFBSVUsSUFBSixDQUFTNEosU0FBVDtBQUNBbEksc0JBQUlPLE9BQUo7QUFDRDtBQUNGLGVBeENEO0FBeUNELGFBNUNEO0FBNkNELFdBL0NEO0FBZ0RELFNBekREO0FBMERELE9BN0REO0FBOERELEtBbEVEO0FBbUVELEdBckVEO0FBc0VELENBekVEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmNvbnN0IGhlbHBlciA9IChudW0xLG51bTIpPT57XHJcbmNvbnN0IGRpZmYgPSBNYXRoLmFicyhudW0xIC0gbnVtMik7XHJcbiByZXR1cm4gNSAtIGRpZmY7XHJcbn07XHJcblxyXG5jb25zdCBjb21wID0gKGZpcnN0LCBzZWNvbmQpPT4ge1xyXG5jb25zdCBmaW5hbCA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3QubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xyXG5cclxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcclxuXHJcbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKTtcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5jb25zdCBzdW0gPSBmaW5hbC5yZWR1Y2UoKGEsYikgPT4gYSArIGIsIDApO1xyXG4gIHJldHVybiBNYXRoLnJvdW5kKDIwICogc3VtIC8gZmluYWwubGVuZ3RoKTtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbmNvbnN0IG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxuY29uc3QgTW92aWUgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL21vdmllJyk7XHJcbmNvbnN0IFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbmNvbnN0IFJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yZWxhdGlvbicpO1xyXG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy91c2VyJyk7XHJcbmNvbnN0IGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbi8vIHZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbmNvbnN0IFJhdGluZ3MgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmF0aW5ncycpO1xyXG4vLyB2YXIgUmVsYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JlbGF0aW9ucycpO1xyXG5jb25zdCBVc2VycyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy91c2VycycpO1xyXG52YXIgYWxsUmVxdWVzdHMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvYWxsUmVxdWVzdHMnKTtcclxuXHJcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuY29uc3QgcG9vbCAgPSBteXNxbC5jcmVhdGVQb29sKHtcclxuICBjb25uZWN0aW9uTGltaXQgOiA0LFxyXG4gIGhvc3Q6IHByb2Nlc3MuZW52LkRBVEFCQVNFX0hPU1QgfHwgJ2xvY2FsaG9zdCcsXHJcbiAgdXNlcjogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVNFUiB8fCAncm9vdCcsXHJcbiAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1BBU1NXT1JEIHx8ICcxMjM0NScsXHJcbiAgZGF0YWJhc2U6IHByb2Nlc3MuZW52LkRBVEFCQVNFX05BTUUgfHwgJ01haW5EYXRhYmFzZSdcclxufSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PntcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKTtcclxuICBsZXQgcmVxdWVzdGVlcztcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCByZXF1ZXN0ZWUgPT4ge1xyXG4gICAgYWxsUmVxdWVzdHMuY3JlYXRlKHtcclxuICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgIHJlcXVlc3RlZTogcmVxdWVzdGVlLFxyXG4gICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICBtb3ZpZTogcmVxLmJvZHkubW92aWUsXHJcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2VcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZG9uZSA9PiB7XHJcbiAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4odGhlUmVxdWVzdCA9PiB7XHJcbiAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcclxuICBsZXQgbmV3UmVxdWVzdDtcclxuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyID09PSByZXEuYm9keS5uYW1lKSB7XHJcbiAgICByZXNwb25zZS5zZW5kKFwiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgbmV3UmVxdWVzdCA9IHtcclxuICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgcmVxdWVzdFR5cDogJ2ZyaWVuZCdcclxuICAgIH07XHJcblxyXG4gICAgcG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uKGVyciwgY29uKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnc2VuZFJlcXVlc3QnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSxyZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFICByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJywgbmV3UmVxdWVzdC5yZXF1ZXN0b3IsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgaWYgKCFyZXMpIHtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlciggYSA9PiBhLnJlc3BvbnNlID09PSBudWxsKTtcclxuICAgICAgICB2YXIgcmVxdWVzdGVlcyA9IHBwbFJlcWQubWFwKCBhID0+IGEucmVxdWVzdGVlICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgbmV3UmVxdWVzdCwgKGVyciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdGVlcyk7XHJcbiAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2xpc3RSZXF1ZXN0cycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycgKyAnT1IgcmVxdWVzdG9yID0nICsgJ1wiJyArIHJlcXVlc3QgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQoW3JlcywgcmVxdWVzdF0pO1xyXG4gICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5hY2NlcHQgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XHJcblxyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnYWNjZXB0Jyk7IHRocm93IGVycjsgfVxyXG4gICAgaWYgKG1vdmllID09PSAnJykge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrcmVxdWVzdFR5cGUrJ1wiJywgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdG9yLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RlZSwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xyXG5cclxuICAgICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMlxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVxdWVzdDIgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IChyZXEsIHJlcykgPT57XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxyXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbih0aGVSZXF1ZXN0KSB7XHJcbiAgICAgIHRoZVJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gIHZhciBtb3ZpZXMgPSBbXTtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XHJcbiAgdmFyIHBlcnNvbiA9IHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kO1xyXG4gIHZhciBpZCA9IG51bGw7XHJcbiAgdmFyIGxlbiA9IG51bGw7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRUaGlzRnJpZW5kc01vdmllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcGVyc29uLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZyhpZCk7XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJycnJycnJyJywgZXJyLCByZXNwLmxlbmd0aCk7XHJcbiAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbiA9IHJlc3AubGVuZ3RoO1xyXG4gICAgICAgIHJlc3AuZm9yRWFjaChhID0+IHtcclxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgICAgIG1vdmllcy5wdXNoKFtyZXNwWzBdLnRpdGxlLCBhLnNjb3JlLCBhLnJldmlld10pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZXMpO1xyXG4gICAgICAgICAgICBpZiAobW92aWVzLmxlbmd0aCA9PT0gbGVuKSB7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xyXG4gICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZmluZE1vdmllQnVkZGllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICB2YXIgcGVvcGxlID0gcmVzcC5tYXAoYSA9PiBhLnVzZXJuYW1lKTtcclxuICAgICAgdmFyIElkcyA9IHJlc3AubWFwKGEgPT4gYS5pZCk7XHJcbiAgICAgIHZhciBpZEtleU9iaiA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlkS2V5T2JqW0lkc1tpXV0gPSBwZW9wbGVbaV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjdXJyZW50VXNlciA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnQgdXNlcicsIGN1cnJlbnRVc2VyKTtcclxuXHJcbiAgICAgIHZhciBvYmoxID0ge307XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgb2JqMVtpZEtleU9ialtJZHNbaV1dXSA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBzY29yZSxtb3ZpZWlkLHVzZXJpZCBGUk9NIHJhdGluZ3MnLCAoZXJyLCByZXNwb24pPT4ge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3Bvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQsIHJlc3BvbltpXS5zY29yZV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iajEnLCBvYmoxKTtcclxuICAgICAgICB2YXIgY3VycmVudFVzZXJJbmZvID0gb2JqMVtjdXJyZW50VXNlcl07XHJcblxyXG4gICAgICAgIHZhciBjb21wYXJpc29ucyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqMSkge1xyXG4gICAgICAgICAgaWYgKGtleSAhPT0gY3VycmVudFVzZXIpIHtcclxuICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XSA9IGNvbXAoY3VycmVudFVzZXJJbmZvLCBvYmoxW2tleV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgdmFyIGZpbmFsU2VuZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucykge1xyXG4gICAgICAgICAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCBjb21wYXJpc29uc1trZXldXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCAnTm8gQ29tcGFyaXNvbiB0byBNYWtlJ10pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZCk7XHJcbiAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmRlY2xpbmUgPSBmdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuICB2YXIgYWRkT249IW1vdmllPycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInOicgQU5EIHJlcXVlc3RlZT0nKydcIicrIHJlcXVlc3RlZSsnXCInKycgQU5EIG1vdmllID0nKydcIicrbW92aWUrJ1wiJztcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2RlY2xpbmUnKTsgdGhyb3cgZXJyOyB9ICAgIFxyXG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrYWRkT24sIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XHJcbiAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kID0+IHtcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAndXNlciBjYW5ub3QgYmUgY3JlYXRlZCd9fSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWduaW5Vc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQ9PntcclxuICAgIGlmIChmb3VuZCl7XHJcbiAgICAgIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKHVzZXI9PntcclxuICAgICAgICBpZiAodXNlcil7XHJcbiAgICAgICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSB1c2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm91bmQgJywgZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSk7XHJcbiAgICAgICAgICByZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VyIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJlcS5teVNlc3Npb24uZGVzdHJveShmdW5jdGlvbihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZygnbG9nb3V0Jyk7XHJcbiAgcmVzLnNlbmQoJ2xvZ291dCcpO1xyXG59O1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL21vdmllIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXHJcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cclxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xyXG4gIGxldCB1c2VyaWQ7XHJcbiAgcmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXHJcbiAgLnRoZW4oZm91bmRVc2VyID0+IHtcclxuICAgIHVzZXJpZCA9IGZvdW5kVXNlci5hdHRyaWJ1dGVzLmlkO1xyXG4gICAgcmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRSYXRpbmcgPT4ge1xyXG4gICAgICBpZiAoZm91bmRSYXRpbmcpIHtcclxuICAgICAgICAvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgLy9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcclxuICAgICAgICBsZXQgcmF0aW5nT2JqO1xyXG4gICAgICAgIGlmIChyZXEuYm9keS5yYXRpbmcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xyXG4gICAgICAgICAgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxyXG4gICAgICAgICAgLnNhdmUocmF0aW5nT2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XHJcbiAgICAgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcclxuICAgICAgICAgIHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXHJcbiAgICAgICAgICB1c2VyaWQ6IHVzZXJpZCxcclxuICAgICAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxyXG4gICAgICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihuZXdSYXRpbmcgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JhdGluZyBjcmVhdGVkOicsIG5ld1JhdGluZy5hdHRyaWJ1dGVzKTtcclxuICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdyYXRpbmcgcmVjaWV2ZWQnKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ2Vycm9yJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2VcclxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxudmFyIGFkZE9uZU1vdmllID0gbW92aWVPYmogPT4ge1xyXG4gIGxldCBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcclxuICByZXR1cm4gbmV3IE1vdmllKHtcclxuICAgIGlkOiBtb3ZpZU9iai5pZCxcclxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcclxuICAgIGdlbnJlOiBnZW5yZSxcclxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxyXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXHJcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcclxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxyXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxyXG4gIC50aGVuKG5ld01vdmllID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XHJcbiAgICByZXR1cm4gbmV3TW92aWU7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAncHJvYmxlbSBjcmVhdGluZyBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXHJcbi8vc2hvdWxkIHJldHVybiBhbiBhcnJheSB0aGF0IGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxyXG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxyXG5cclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gICAgcWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xyXG4gICAgICByZXR1cm4gYXR0YWNoVXNlclJhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgYXZlcmFnZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyBmcmllbmQgYXZnIHJhdGluZyB0byB0aGUgcmF0aW5nIG9ialxyXG5jb25zdCBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcbiAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICAvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxyXG4gICAgaWYgKCFmcmllbmRzUmF0aW5ncykge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmc7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoVXNlclJhdGluZyA9IChyYXRpbmcsIHVzZXJuYW1lKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsXHJcbiAgICAgICdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHVzZXJSYXRpbmcgPT4ge1xyXG4gICAgaWYgKHVzZXJSYXRpbmcpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyBjYW5ub3QgZmluZCB1c2VyIHJhdGluZycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xyXG4gIGdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxyXG4gIC50aGVuKGZyaWVuZFJhdGluZ3MgPT4ge1xyXG4gICAgcmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBmcmllbmQgcmF0aW5ncyBmb3IgdGhlIG1vdmllJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5jb25zdCBnZXRGcmllbmRSYXRpbmdzID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBVc2VyLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXHJcbiAgICAgICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogbW92aWVPYmouYXR0cmlidXRlcy5pZCB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gIC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnJpZW5kUmF0aW5nID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmcmllbmQgPT4ge1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiBmcmllbmRSYXRpbmc7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICByZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xyXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xyXG5jb25zdCBhdmVyYWdlUmF0aW5nID0gKHJhdGluZ3MpID0+IHtcclxuICAvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXHJcbiAgaWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XHJcbiAgcmV0dXJuIHJhdGluZ3MucmVkdWNlKCh0b3RhbCwgcmF0aW5nKSA9PiB0b3RhbCArIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlLCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59O1xyXG5cclxuXHJcbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxyXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cclxuY29uc3QgZ2V0T25lTW92aWVSYXRpbmcgPSAodXNlcm5hbWUsIG1vdmllT2JqKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcclxuICB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4ocmF0aW5nID0+IHtcclxuICAgIGlmICghcmF0aW5nKSB7XHJcbiAgICAgIC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcclxuICAgICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKG1vdmllID0+IHtcclxuICAgICAgICBtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gbW92aWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH1cclxuICB9KVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICByZXR1cm4gZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG4gICAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgICAgY29uc29sZS5sb2coJ2FkZGVkIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZycsIHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLCByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nKTtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cmlldmUgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqIHdpdGggdGhlc2UgYXR0cmlidXRlczoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xyXG4gIFByb21pc2UubWFwKHJlcS5ib2R5Lm1vdmllcywgbW92aWUgPT4ge1xyXG4gICAgLy9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxyXG4gICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllLnRpdGxlLCBpZDogbW92aWUuaWR9KS5mZXRjaCgpXHJcbiAgICAudGhlbihmb3VuZE1vdmllID0+IHtcclxuICAgICAgLy9pZiBub3QgY3JlYXRlIG9uZVxyXG4gICAgICBpZiAoIWZvdW5kTW92aWUpIHtcclxuICAgICAgICByZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmb3VuZE1vdmllO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PntcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZvdW5kIG1vdmllJywgZm91bmRNb3ZpZSk7XHJcbiAgICAgIHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyciwgJ2Nhbm5vdCBhZGQgbW92aWUnKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIHJhdGluZyB0byBjbGllbnQnKTtcclxuICAgIHJlcy5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgZ2V0IG1vdmllJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcclxuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xyXG5leHBvcnRzLmdldFJlY2VudFJlbGVhc2UgPSAocmVxLCByZXMpID0+IHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcbiAgbGV0IGRhdGEgPSAnJztcclxuICByZXF1ZXN0KHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL2Rpc2NvdmVyL21vdmllLycsXHJcbiAgICBxczogcGFyYW1zXHJcbiAgfSlcclxuICAub24oJ2RhdGEnLCBjaHVuayA9PiB7XHJcbiAgICBkYXRhICs9IGNodW5rO1xyXG4gIH0pXHJcbiAgLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICByZXEuYm9keS5tb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpLnJlc3VsdHM7XHJcbiAgICAvL3RyYW5zZmVycyB0aGUgbW92aWUgZGF0YSB0byBnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyB0byBkZWNvcmF0ZSB3aXRoIHNjb3JlICh1c2VyIHJhdGluZykgYW5kIGF2Z2ZyaWVuZFJhdGluZyBhdHRyaWJ1dGVcclxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xyXG5cclxuICB9KVxyXG4gIC5vbignZXJyb3InLCBlcnJvciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvciwgJ1RoZU1vdmllREIgZG9lcyBub3QgcmVzcG9uZCcpO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXHJcbmNvbnN0IGdlbnJlcyA9IHtcclxuICAgMTI6ICdBZHZlbnR1cmUnLFxyXG4gICAxNDogJ0ZhbnRhc3knLFxyXG4gICAxNjogJ0FuaW1hdGlvbicsXHJcbiAgIDE4OiAnRHJhbWEnLFxyXG4gICAyNzogJ0hvcnJvcicsXHJcbiAgIDI4OiAnQWN0aW9uJyxcclxuICAgMzU6ICdDb21lZHknLFxyXG4gICAzNjogJ0hpc3RvcnknLFxyXG4gICAzNzogJ1dlc3Rlcm4nLFxyXG4gICA1MzogJ1RocmlsbGVyJyxcclxuICAgODA6ICdDcmltZScsXHJcbiAgIDk5OiAnRG9jdW1lbnRhcnknLFxyXG4gICA4Nzg6ICdTY2llbmNlIEZpY3Rpb24nLFxyXG4gICA5NjQ4OiAnTXlzdGVyeScsXHJcbiAgIDEwNDAyOiAnTXVzaWMnLFxyXG4gICAxMDc0OTogJ1JvbWFuY2UnLFxyXG4gICAxMDc1MTogJ0ZhbWlseScsXHJcbiAgIDEwNzUyOiAnV2FyJyxcclxuICAgMTA3Njk6ICdGb3JlaWduJyxcclxuICAgMTA3NzA6ICdUViBNb3ZpZSdcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYCk7XHJcbiAgICBxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4obWF0Y2hlcyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgICByZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHNlYXJjaCBEQicpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBzZWFyY2gnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSZWxhdGlvbi5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG4gICAgICByZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuICAgICAgICByZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XHJcbiAgICByZXMuanNvbihmcmllbmRzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGVvcGxlSWQgPSBbXTtcclxuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRGcmllbmRzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcclxuICAgIFxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBwZW9wbGUgPSBbXVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcclxuICAgICAgICAgIHZhciBrZXlJZD17fTtcclxuICAgICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG5cclxuICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdXNlcm5hbWUgRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8nLCBhLCBmdW5jdGlvbihlcnIsIHJlc3BvKSB7XHJcbiAgICAgICAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICByZT1be3VzZXJpZDphLG1vdmllaWQ6TWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKSxzY29yZTo5OX1dXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGVvcGxlLnB1c2gocmUubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZmluYWwgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHZlcnlGaW5hbD1bXTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH0pO1xyXG59O1xyXG5cclxuIl19