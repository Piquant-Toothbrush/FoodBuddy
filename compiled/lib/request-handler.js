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
      console.log('SELECT requestee,response FROM allrequests WHERE requestor =' + newRequest['requestor'] + ' AND requestTyp =' + '"' + 'friend' + '"');
      con.query('SELECT requestee, response FROM allrequests WHERE requestor = ? AND requestTyp =' + '"' + 'friend' + '"', newRequest['requestor'], function (err, res) {
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
  console.log('requestee', requestee);
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err, 'listRequests');throw err;
    }
    con.query('Select * FROM allrequests WHERE requestee=' + '"' + requestee + '"' + '' + 'OR requestor =' + '"' + requestee + '"' + '', function (err, res) {
      if (err) {
        throw err;
      }
      console.log('all the people', res);
      response.send([res, requestee]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiREFUQUJBU0VfSE9TVCIsInVzZXIiLCJEQVRBQkFTRV9VU0VSIiwicGFzc3dvcmQiLCJEQVRBQkFTRV9QQVNTV09SRCIsImRhdGFiYXNlIiwiREFUQUJBU0VfTkFNRSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJyZXF1ZXN0ZWVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZWFjaCIsInJlcXVlc3RvciIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsIm1lc3NhZ2UiLCJjYXRjaCIsImpzb24iLCJlcnJvciIsImRhdGEiLCJlcnIiLCJyZW1vdmVXYXRjaFJlcXVlc3QiLCJmb3JnZSIsInRoZVJlcXVlc3QiLCJkZXN0cm95Iiwic2VuZFJlcXVlc3QiLCJuZXdSZXF1ZXN0IiwiZ2V0Q29ubmVjdGlvbiIsImNvbiIsInF1ZXJ5IiwicHBsUmVxZCIsImZpbHRlciIsIm1hcCIsInJlc3AiLCJpbnNlcnRJZCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwiaWQiLCJwZXJzb24xIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJzcGVjaWZpY0ZyaWVuZCIsInBlcnNvbiIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInVuZGVmaW5lZCIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxJQUFELEVBQU1DLElBQU4sRUFBYTtBQUM1QixNQUFNQyxPQUFPQyxLQUFLQyxHQUFMLENBQVNKLE9BQU9DLElBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLElBQVg7QUFDQSxDQUhEOztBQUtBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBa0I7QUFDL0IsTUFBTUMsUUFBUSxFQUFkO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1B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QU92RyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsQ0FBTixDQUFOLEVBQThCRSxDQUE5QixFQUFpQ0MsSUFBakMsQ0FBc0NvRyxPQUFPdkcsQ0FBUCxFQUFVRSxDQUFWLEVBQWF3TSxDQUFiLENBQXRDO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7O0FBRURwSywwQkFBUUMsR0FBUixDQUFZLE9BQVosRUFBb0J4QyxLQUFwQixFQUEwQm9NLFlBQTFCOztBQUVBLHNCQUFJcEYsY0FBWSxFQUFoQjtBQUNBLHVCQUFLLElBQUlDLEdBQVQsSUFBZ0JqSCxLQUFoQixFQUFzQjtBQUNwQmdILGdDQUFZQyxHQUFaLElBQWlCcEgsS0FBS3VNLFlBQUwsRUFBa0JwTSxNQUFNaUgsR0FBTixDQUFsQixDQUFqQjtBQUNEO0FBQ0QxRSwwQkFBUUMsR0FBUixDQUFZd0UsV0FBWjtBQUNBLHNCQUFJNEYsWUFBVSxFQUFkO0FBQ0EsdUJBQUssSUFBSTNGLEdBQVQsSUFBZ0JELFdBQWhCLEVBQTRCO0FBQzFCNEYsOEJBQVV4TSxJQUFWLENBQWUsQ0FBQzZHLEdBQUQsRUFBS0QsWUFBWUMsR0FBWixDQUFMLENBQWY7QUFDRDtBQUNEMUUsMEJBQVFDLEdBQVIsQ0FBWW9LLFNBQVo7QUFDQXRLLHNCQUFJVSxJQUFKLENBQVM0SixTQUFUO0FBQ0FsSSxzQkFBSU8sT0FBSjtBQUNEO0FBQ0YsZUF4Q0Q7QUF5Q0QsYUE1Q0Q7QUE2Q0QsV0EvQ0Q7QUFnREQsU0F6REQ7QUEwREQsT0E3REQ7QUE4REQsS0FsRUQ7QUFtRUQsR0FyRUQ7QUFzRUQsQ0F6RUQiLCJmaWxlIjoicmVxdWVzdC1oYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG4vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vVGhlIGFsZ29yaXRobVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuY29uc3QgaGVscGVyID0gKG51bTEsbnVtMik9PntcclxuY29uc3QgZGlmZiA9IE1hdGguYWJzKG51bTEgLSBudW0yKTtcclxuIHJldHVybiA1IC0gZGlmZjtcclxufTtcclxuXHJcbmNvbnN0IGNvbXAgPSAoZmlyc3QsIHNlY29uZCk9PiB7XHJcbmNvbnN0IGZpbmFsID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaXJzdC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2Vjb25kLmxlbmd0aDsgeCsrKSB7XHJcblxyXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xyXG5cclxuICAgIGZpbmFsLnB1c2goaGVscGVyKGZpcnN0W2ldWzFdLHNlY29uZFt4XVsxXSkpO1xyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbmNvbnN0IHN1bSA9IGZpbmFsLnJlZHVjZSgoYSxiKSA9PiBhICsgYiwgMCk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQoMjAgKiBzdW0gLyBmaW5hbC5sZW5ndGgpO1xyXG59O1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuY29uc3QgbXlzcWwgPSByZXF1aXJlKCdteXNxbCcpO1xyXG5jb25zdCBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcclxuY29uc3QgUmF0aW5nID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yYXRpbmcnKTtcclxuY29uc3QgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XHJcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcclxuY29uc3QgYWxsUmVxdWVzdCA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdCcpO1xyXG5cclxuLy8gdmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcclxuY29uc3QgUmF0aW5ncyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yYXRpbmdzJyk7XHJcbi8vIHZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XHJcbmNvbnN0IFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XHJcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcblxyXG5jb25zdCBwb29sICA9IG15c3FsLmNyZWF0ZVBvb2woe1xyXG4gIGNvbm5lY3Rpb25MaW1pdCA6IDQsXHJcbiAgaG9zdDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfSE9TVCB8fCAnbG9jYWxob3N0JyxcclxuICB1c2VyOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VU0VSIHx8ICdyb290JyxcclxuICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfUEFTU1dPUkQgfHwgJzEyMzQ1JyxcclxuICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREFUQUJBU0VfTkFNRSB8fCAnTWFpbkRhdGFiYXNlJ1xyXG59KTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy91c2VyIGF1dGhcclxuLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kID0+e1xyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcclxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IChyZXEsIHJlc3BvbnNlKT0+IHtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keS5yZXF1ZXN0ZWUpO1xyXG4gIGxldCByZXF1ZXN0ZWVzO1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcclxuICB9XHJcbiAgUHJvbWlzZS5lYWNoKHJlcXVlc3RlZXMsIHJlcXVlc3RlZSA9PiB7XHJcbiAgICBhbGxSZXF1ZXN0cy5jcmVhdGUoe1xyXG4gICAgICByZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlcixcclxuICAgICAgcmVxdWVzdGVlOiByZXF1ZXN0ZWUsXHJcbiAgICAgIHJlcXVlc3RUeXA6ICd3YXRjaCcsXHJcbiAgICAgIG1vdmllOiByZXEuYm9keS5tb3ZpZSxcclxuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihkb25lID0+IHtcclxuICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMucmVtb3ZlV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcclxuICB9XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbih0aGVSZXF1ZXN0ID0+IHtcclxuICAgIHRoZVJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xyXG4gIGxldCBuZXdSZXF1ZXN0O1xyXG4gIGlmIChyZXEubXlTZXNzaW9uLnVzZXIgPT09IHJlcS5ib2R5Lm5hbWUpIHtcclxuICAgIHJlc3BvbnNlLnNlbmQoXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgICBuZXdSZXF1ZXN0ID0ge1xyXG4gICAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICByZXF1ZXN0VHlwOiAnZnJpZW5kJ1xyXG4gICAgICB9O1xyXG5cclxuICAgIHBvb2wuZ2V0Q29ubmVjdGlvbihmdW5jdGlvbihlcnIsIGNvbikge1xyXG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ3NlbmRSZXF1ZXN0Jyk7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnU0VMRUNUIHJlcXVlc3RlZSxyZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RvciA9JyArIG5ld1JlcXVlc3RbJ3JlcXVlc3RvciddICsgJyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicpO1xyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUsIHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicsIG5ld1JlcXVlc3RbJ3JlcXVlc3RvciddLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgIGlmICghcmVzKSB7XHJcbiAgICAgICAgICByZXNwb25zZS5zZW5kKCdubyBmcmllbmRzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHBsUmVxZCA9IHJlcy5maWx0ZXIoIGEgPT4gYS5yZXNwb25zZSA9PT0gbnVsbCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RlZXMgPSBwcGxSZXFkLm1hcCggYSA9PiBhLnJlcXVlc3RlZSApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduYW1lcyBvZiBwZW9wbGUgd2hvbSBJdmUgcmVxdWVzdGVkIGFzIGZyaWVuZHMnLCBwcGxSZXFkKTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIG5ld1JlcXVlc3QsIChlcnIsIHJlc3ApID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcC5pbnNlcnRJZCk7XHJcbiAgICAgICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RlZXMpO1xyXG4gICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5saXN0UmVxdWVzdHMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbmNvbnNvbGUubG9nKCdyZXF1ZXN0ZWUnLCByZXF1ZXN0ZWUpO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnbGlzdFJlcXVlc3RzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nICsgJ1wiJyArIHJlcXVlc3RlZSArICdcIicgKyAnJyArICdPUiByZXF1ZXN0b3IgPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnYWxsIHRoZSBwZW9wbGUnLHJlcyk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQoW3JlcywgcmVxdWVzdGVlXSk7XHJcbiAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucGVyc29uVG9BY2NlcHQ7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuXHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdhY2NlcHQnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBpZiAobW92aWUgPT09ICcnKSB7XHJcbiAgICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIG1vdmllPScrJ1wiJysgbW92aWUrJ1wiJywgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0b3IsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcclxuICAgICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdGVlLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XHJcblxyXG4gICAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXHJcbiAgICAgICAgICB1c2VyMmlkOiBwZXJzb24yXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXF1ZXN0MiA9IHtcclxuICAgICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXHJcbiAgICAgICAgICB1c2VyMmlkOiBwZXJzb24xXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnU3VjY2VzcycpO1xyXG4gICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5yZW1vdmVSZXF1ZXN0ID0gKHJlcSwgcmVzKSA9PntcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKHRoZVJlcXVlc3QpIHtcclxuICAgICAgdGhlUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFRoaXNGcmllbmRzTW92aWVzID0gKHJlcSwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgdmFyIG1vdmllcyA9IFtdO1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcclxuICB2YXIgcGVyc29uID0gcmVxLmJvZHkuc3BlY2lmaWNGcmllbmQ7XHJcbiAgdmFyIGlkID0gbnVsbDtcclxuICB2YXIgbGVuID0gbnVsbDtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2dldFRoaXNGcmllbmRzTW92aWVzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2VycnJycnJycnInLCBlcnIsIHJlc3AubGVuZ3RoKTtcclxuICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVuID0gcmVzcC5sZW5ndGg7XHJcbiAgICAgICAgcmVzcC5mb3JFYWNoKGEgPT4ge1xyXG4gICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgICAgbW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsIGEuc2NvcmUsIGEucmV2aWV3XSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vdmllcyk7XHJcbiAgICAgICAgICAgIGlmIChtb3ZpZXMubGVuZ3RoID09PSBsZW4pIHtcclxuICAgICAgICAgICAgICByZXNwb25zZS5zZW5kKG1vdmllcyk7XHJcbiAgICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZmluZE1vdmllQnVkZGllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICBjb25zb2xlLmxvZyhcInlvdSdyZSB0cnlpbmcgdG8gZmluZCBidWRkaWVzISFcIik7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdmaW5kTW92aWVCdWRkaWVzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzZXJzJywgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIHZhciBwZW9wbGUgPSByZXNwLm1hcChhID0+IGEudXNlcm5hbWUpO1xyXG4gICAgICB2YXIgSWRzID0gcmVzcC5tYXAoYSA9PiBhLmlkKTtcclxuICAgICAgdmFyIGlkS2V5T2JqID0ge307XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWRLZXlPYmpbSWRzW2ldXSA9IHBlb3BsZVtpXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGN1cnJlbnRVc2VyID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gICAgICBjb25zb2xlLmxvZygnY3VycmVudCB1c2VyJywgY3VycmVudFVzZXIpO1xyXG5cclxuICAgICAgdmFyIG9iajEgPSB7fTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBvYmoxW2lkS2V5T2JqW0lkc1tpXV1dID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHNjb3JlLG1vdmllaWQsdXNlcmlkIEZST00gcmF0aW5ncycsIChlcnIsIHJlc3Bvbik9PiB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBvYmoxW2lkS2V5T2JqW3Jlc3BvbltpXS51c2VyaWRdXS5wdXNoKFtyZXNwb25baV0ubW92aWVpZCwgcmVzcG9uW2ldLnNjb3JlXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnb2JqMScsIG9iajEpO1xyXG4gICAgICAgIHZhciBjdXJyZW50VXNlckluZm8gPSBvYmoxW2N1cnJlbnRVc2VyXTtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBhcmlzb25zID0ge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmoxKSB7XHJcbiAgICAgICAgICBpZiAoa2V5ICE9PSBjdXJyZW50VXNlcikge1xyXG4gICAgICAgICAgICBjb21wYXJpc29uc1trZXldID0gY29tcChjdXJyZW50VXNlckluZm8sIG9iajFba2V5XSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcclxuICAgICAgICB2YXIgZmluYWxTZW5kID0gW107XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKSB7XHJcbiAgICAgICAgICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XHJcbiAgICAgICAgICAgIGZpbmFsU2VuZC5wdXNoKFtrZXksIGNvbXBhcmlzb25zW2tleV1dKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZpbmFsU2VuZC5wdXNoKFtrZXksICdObyBDb21wYXJpc29uIHRvIE1ha2UnXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3BvbnNlLnNlbmQoZmluYWxTZW5kKTtcclxuICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZGVjbGluZSA9IGZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG4gIHZhciBhZGRPbj0hbW92aWU/JyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIic6JyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZGVjbGluZScpOyB0aHJvdyBlcnI7IH0gICAgXHJcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJythZGRPbiwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQgPT4ge1xyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcclxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbih1c2VyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICd1c2VyIGNhbm5vdCBiZSBjcmVhdGVkJ319KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNpZ25pblVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZD0+e1xyXG4gICAgaWYgKGZvdW5kKXtcclxuICAgICAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSwgcGFzc3dvcmQ6cmVxLmJvZHkucGFzc3dvcmR9KS5mZXRjaCgpLnRoZW4odXNlcj0+e1xyXG4gICAgICAgIGlmICh1c2VyKXtcclxuICAgICAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCAnLCBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKTtcclxuICAgICAgICAgIHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuICAgICAgY29uc29sZS5sb2coJ3VzZXIgbm90IGZvdW5kJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gIH0pO1xyXG4gIGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcclxuICByZXMuc2VuZCgnbG9nb3V0Jyk7XHJcbn07XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vbW92aWUgaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL2EgaGFuZGVsZXIgdGhhdCB0YWtlcyBhIHJhdGluZyBmcm9tIHVzZXIgYW5kIGFkZCBpdCB0byB0aGUgZGF0YWJhc2VcclxuLy8gZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoaXM6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJywgcG9zdGVyOiAnbGluaycsIHJlbGVhc2VfZGF0ZTogJ3llYXInLCByYXRpbmc6ICdudW1iZXInfVxyXG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgcmF0ZU1vdmllJyk7XHJcbiAgbGV0IHVzZXJpZDtcclxuICByZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcclxuICAudGhlbihmb3VuZFVzZXIgPT4ge1xyXG4gICAgdXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XHJcbiAgICByZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXHJcbiAgICAudGhlbihmb3VuZFJhdGluZyA9PiB7XHJcbiAgICAgIGlmIChmb3VuZFJhdGluZykge1xyXG4gICAgICAgIC8vc2luY2UgcmF0aW5nIG9yIHJldmlldyBpcyB1cGRhdGVkIHNlcGVyYXRseSBpbiBjbGllbnQsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlIHJhdGluZycsIGZvdW5kUmF0aW5nKVxyXG4gICAgICAgIGxldCByYXRpbmdPYmo7XHJcbiAgICAgICAgaWYgKHJlcS5ib2R5LnJhdGluZykge1xyXG4gICAgICAgICAgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XHJcbiAgICAgICAgICByYXRpbmdPYmogPSB7cmV2aWV3OiByZXEuYm9keS5yZXZpZXd9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFJhdGluZyh7J2lkJzogZm91bmRSYXRpbmcuYXR0cmlidXRlcy5pZH0pXHJcbiAgICAgICAgICAuc2F2ZShyYXRpbmdPYmopO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyByYXRpbmcnKTtcclxuICAgICAgICByZXR1cm4gUmF0aW5ncy5jcmVhdGUoe1xyXG4gICAgICAgICAgc2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcclxuICAgICAgICAgIHVzZXJpZDogdXNlcmlkLFxyXG4gICAgICAgICAgbW92aWVpZDogcmVxLmJvZHkuaWQsXHJcbiAgICAgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKG5ld1JhdGluZyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xyXG4gICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgnZXJyb3InKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxyXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG52YXIgYWRkT25lTW92aWUgPSBtb3ZpZU9iaiA9PiB7XHJcbiAgbGV0IGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xyXG4gIHJldHVybiBuZXcgTW92aWUoe1xyXG4gICAgaWQ6IG1vdmllT2JqLmlkLFxyXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxyXG4gICAgZ2VucmU6IGdlbnJlLFxyXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXHJcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcclxuICAgIGRlc2NyaXB0aW9uOiBtb3ZpZU9iai5vdmVydmlldy5zbGljZSgwLCAyNTUpLFxyXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXHJcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXHJcbiAgLnRoZW4obmV3TW92aWUgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcclxuICAgIHJldHVybiBuZXdNb3ZpZTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICdwcm9ibGVtIGNyZWF0aW5nIG1vdmllJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcclxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXHJcblxyXG5leHBvcnRzLmdldFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gICAgcWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgLy9kZWNvcmF0ZSBpdCB3aXRoIGF2ZyBmcmllbmQgcmF0aW5nXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xyXG4gICAgICByZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cml2ZSByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgcmF0aW5ncycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZSBhcyBmcmllbmRTY29yZScsICdyYXRpbmdzLnJldmlldyBhcyBmcmllbmRSZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgICBxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5xdWVyeS5mcmllbmROYW1lKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcbiAgICAgIHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cml2ZSBhdmVyYWdlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgYXZlcmFnZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXHJcbmNvbnN0IGF0dGFjaEZyaWVuZEF2Z1JhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcclxuICByZXR1cm4gZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgIC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXHJcbiAgICBpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZztcclxuICB9KTtcclxufTtcclxuXHJcbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyB1c2VyIHJhdGluZyBhbmQgcmV2aWV3cyB0byB0aGUgcmF0aW5nIG9ialxyXG5jb25zdCBhdHRhY2hVc2VyUmF0aW5nID0gKHJhdGluZywgdXNlcm5hbWUpID0+IHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXHJcbiAgICAgICdtb3ZpZXMudGl0bGUnOiByYXRpbmcuYXR0cmlidXRlcy50aXRsZSxcclxuICAgICAgJ21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4odXNlclJhdGluZyA9PiB7XHJcbiAgICBpZiAodXNlclJhdGluZykge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmc7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIGNhbm5vdCBmaW5kIHVzZXIgcmF0aW5nJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xyXG5leHBvcnRzLmhhbmRsZUdldEZyaWVuZFJhdGluZ3MgPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XHJcbiAgZ2V0RnJpZW5kUmF0aW5ncyhyZXEubXlTZXNzaW9uLnVzZXIsIHthdHRyaWJ1dGVzOiByZXEuYm9keS5tb3ZpZX0pXHJcbiAgLnRoZW4oZnJpZW5kUmF0aW5ncyA9PiB7XHJcbiAgICByZXMuanNvbihmcmllbmRSYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIGZyaWVuZCByYXRpbmdzIGZvciB0aGUgbW92aWUnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcclxuLy9leHBlY3QgY3VycmVudCB1c2VybmFtZSBhbmQgbW92aWVUaXRsZSBhcyBpbnB1dFxyXG4vL291dHB1dHM6IHt1c2VyMmlkOiAnaWQnLCBmcmllbmRVc2VyTmFtZTonbmFtZScsIGZyaWVuZEZpcnN0TmFtZTonbmFtZScsIHRpdGxlOidtb3ZpZVRpdGxlJywgc2NvcmU6biB9XHJcbmNvbnN0IGdldEZyaWVuZFJhdGluZ3MgPSAodXNlcm5hbWUsIG1vdmllT2JqKSA9PiB7XHJcbiAgcmV0dXJuIFVzZXIucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdyYXRpbmdzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAncmVsYXRpb25zLnVzZXIyaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuICAgICAgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXHJcbiAgICAgICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgLy90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmcmllbmRSYXRpbmcgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKGZyaWVuZCA9PiB7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kVXNlck5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgICBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XHJcbiAgICAgICAgcmV0dXJuIGZyaWVuZFJhdGluZztcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgIHJldHVybiBmcmllbmRzUmF0aW5ncztcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXHJcbi8vaW5wdXRzIHJhdGluZ3MsIG91dHB1dHMgdGhlIGF2ZXJhZ2Ugc2NvcmU7XHJcbmNvbnN0IGF2ZXJhZ2VSYXRpbmcgPSAocmF0aW5ncykgPT4ge1xyXG4gIC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcclxuICBpZiAocmF0aW5ncy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cclxuICByZXR1cm4gcmF0aW5ncy5yZWR1Y2UoKHRvdGFsLCByYXRpbmcpID0+IHRvdGFsICsgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUsIDApIC8gcmF0aW5ncy5sZW5ndGg7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXHJcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxyXG5jb25zdCBnZXRPbmVNb3ZpZVJhdGluZyA9ICh1c2VybmFtZSwgbW92aWVPYmopID0+IHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbihyYXRpbmcgPT4ge1xyXG4gICAgaWYgKCFyYXRpbmcpIHtcclxuICAgICAgLy9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxyXG4gICAgICByZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcclxuICAgICAgLnRoZW4obW92aWUgPT4ge1xyXG4gICAgICAgIG1vdmllLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBtb3ZpZTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcmF0aW5nO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5nID0+IHtcclxuICAgIHJldHVybiBnZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXHJcbiAgICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgICBjb25zb2xlLmxvZygnYWRkZWQgYXZlcmFnZSBmcmllbmQgcmF0aW5nJywgcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpO1xyXG4gICAgICByZXR1cm4gcmF0aW5nO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cmlldmUgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaWV2ZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XHJcbiAgUHJvbWlzZS5tYXAocmVxLmJvZHkubW92aWVzLCBtb3ZpZSA9PiB7XHJcbiAgICAvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICByZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcclxuICAgIC50aGVuKGZvdW5kTW92aWUgPT4ge1xyXG4gICAgICAvL2lmIG5vdCBjcmVhdGUgb25lXHJcbiAgICAgIGlmICghZm91bmRNb3ZpZSkge1xyXG4gICAgICAgIHJldHVybiBhZGRPbmVNb3ZpZShtb3ZpZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kTW92aWU7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudGhlbihmb3VuZE1vdmllID0+e1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnZm91bmQgbW92aWUnLCBmb3VuZE1vdmllKTtcclxuICAgICAgcmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyLCAnY2Fubm90IGFkZCBtb3ZpZScpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xyXG4gICAgcmVzLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyciwgJ2Nhbm5vdCBnZXQgbW92aWUnKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xyXG4vL3dlIGNhbm5vdCBkbyBpdCBpbiB0aGUgZnJvbnQgZW5kIGJlY2F1c2UgY3Jvc3Mgb3JpZ2luIHJlcXVlc3QgaXNzdWVzXHJcbmV4cG9ydHMuZ2V0UmVjZW50UmVsZWFzZSA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxyXG4gICAgcHJpbWFyeV9yZWxlYXNlX3llYXI6IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSxcclxuICAgIGluY2x1ZGVfYWR1bHQ6IGZhbHNlLFxyXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcclxuICB9O1xyXG5cclxuICBsZXQgZGF0YSA9ICcnO1xyXG4gIHJlcXVlc3Qoe1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIHVybDogJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvZGlzY292ZXIvbW92aWUvJyxcclxuICAgIHFzOiBwYXJhbXNcclxuICB9KVxyXG4gIC5vbignZGF0YScsIGNodW5rID0+IHtcclxuICAgIGRhdGEgKz0gY2h1bms7XHJcbiAgfSlcclxuICAub24oJ2VuZCcsICgpID0+IHtcclxuICAgIHJlcS5ib2R5Lm1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSkucmVzdWx0cztcclxuICAgIC8vdHJhbnNmZXJzIHRoZSBtb3ZpZSBkYXRhIHRvIGdldE11bHRpcGxlTW92aWVSYXRpbmdzIHRvIGRlY29yYXRlIHdpdGggc2NvcmUgKHVzZXIgcmF0aW5nKSBhbmQgYXZnZnJpZW5kUmF0aW5nIGF0dHJpYnV0ZVxyXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XHJcblxyXG4gIH0pXHJcbiAgLm9uKCdlcnJvcicsIGVycm9yID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yLCAnVGhlTW92aWVEQiBkb2VzIG5vdCByZXNwb25kJyk7XHJcbiAgfSk7XHJcblxyXG59O1xyXG5cclxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcclxuY29uc3QgZ2VucmVzID0ge1xyXG4gICAxMjogJ0FkdmVudHVyZScsXHJcbiAgIDE0OiAnRmFudGFzeScsXHJcbiAgIDE2OiAnQW5pbWF0aW9uJyxcclxuICAgMTg6ICdEcmFtYScsXHJcbiAgIDI3OiAnSG9ycm9yJyxcclxuICAgMjg6ICdBY3Rpb24nLFxyXG4gICAzNTogJ0NvbWVkeScsXHJcbiAgIDM2OiAnSGlzdG9yeScsXHJcbiAgIDM3OiAnV2VzdGVybicsXHJcbiAgIDUzOiAnVGhyaWxsZXInLFxyXG4gICA4MDogJ0NyaW1lJyxcclxuICAgOTk6ICdEb2N1bWVudGFyeScsXHJcbiAgIDg3ODogJ1NjaWVuY2UgRmljdGlvbicsXHJcbiAgIDk2NDg6ICdNeXN0ZXJ5JyxcclxuICAgMTA0MDI6ICdNdXNpYycsXHJcbiAgIDEwNzQ5OiAnUm9tYW5jZScsXHJcbiAgIDEwNzUxOiAnRmFtaWx5JyxcclxuICAgMTA3NTI6ICdXYXInLFxyXG4gICAxMDc2OTogJ0ZvcmVpZ24nLFxyXG4gICAxMDc3MDogJ1RWIE1vdmllJ1xyXG4gfTtcclxuXHJcbi8vdGhpcyBmdW5jdGlvbiB3aWxsIHNlbmQgYmFjayBzZWFyY2IgbW92aWVzIHVzZXIgaGFzIHJhdGVkIGluIHRoZSBkYXRhYmFzZVxyXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcclxuZXhwb3J0cy5zZWFyY2hSYXRlZE1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKTtcclxuICAgIHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihtYXRjaGVzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcclxuICAgIHJlcy5qc29uKG1hdGNoZXMpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gc2VhcmNoIERCJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHNlYXJjaCcpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vZnJpZW5kc2hpcCBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kTGlzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJlbGF0aW9uLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmcmllbmRzID0+IHtcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcih7aWQ6IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXIyaWR9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xyXG4gICAgICAgIHJldHVybiBmcmllbmRVc2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihmdW5jdGlvbihmcmllbmRzKXtcclxuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIGEgbGlzdCBvZiBmcmllbmQgbmFtZXMnLCBmcmllbmRzKTtcclxuICAgIHJlcy5qc29uKGZyaWVuZHMpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gZ2V0IGZyaWVuZHMnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gZ2V0IGZyaWVuZHMnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHZhciBwZW9wbGVJZCA9IFtdO1xyXG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2dldEZyaWVuZHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIGlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBsaW5nLzInLGlkKVxyXG4gICAgXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgIHZhciB1c2Vyc1JhdGluZ3M9cmVzcC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBbYS5tb3ZpZWlkLCBhLnNjb3JlXX0pO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmVsYXRpb25zIFdIRVJFIHVzZXIxaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIHBlb3BsZUlkLnB1c2gocmVzcFtpXS51c2VyMmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIHBlb3BsZSA9IFtdXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xyXG4gICAgICAgICAgdmFyIGtleUlkPXt9O1xyXG4gICAgICAgICAgcGVvcGxlSWQuZm9yRWFjaChmdW5jdGlvbihhKSB7XHJcblxyXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcclxuICAgICAgICAgICAgICBrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcclxuICAgICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIGEnLGEpXHJcbiAgICAgICAgICAgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XHJcbiAgICAgICAgICAgICAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAocGVvcGxlLmxlbmd0aD09PXBlb3BsZUlkLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVvcGxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwZW9wbGVbaV0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV1beF0ucHVzaChwZW9wbGVbaV1beF1bel0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5hbCcsZmluYWwsdXNlcnNSYXRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb21wYXJpc29ucz17fTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb21wYXJpc29uc1trZXldPWNvbXAodXNlcnNSYXRpbmdzLGZpbmFsW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdmVyeUZpbmFsPVtdO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnlGaW5hbC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcclxuICAgICAgICAgICAgICAgICAgcmVzLnNlbmQodmVyeUZpbmFsKTtcclxuICAgICAgICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSk7XHJcbn07XHJcblxyXG4iXX0=