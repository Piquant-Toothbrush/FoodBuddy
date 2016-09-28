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
  host: "us-cdbr-iron-east-04.cleardb.net",
  user: 'b6e72659e4f62e',
  password: '4b75d43f',
  database: 'heroku_8743521ae68d583'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJyZXF1ZXN0ZWVzIiwiQXJyYXkiLCJpc0FycmF5IiwiZWFjaCIsInJlcXVlc3RvciIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsIm1lc3NhZ2UiLCJjYXRjaCIsImpzb24iLCJlcnJvciIsImRhdGEiLCJlcnIiLCJyZW1vdmVXYXRjaFJlcXVlc3QiLCJmb3JnZSIsInRoZVJlcXVlc3QiLCJkZXN0cm95Iiwic2VuZFJlcXVlc3QiLCJuZXdSZXF1ZXN0IiwiZ2V0Q29ubmVjdGlvbiIsImNvbiIsInF1ZXJ5IiwicHBsUmVxZCIsImZpbHRlciIsIm1hcCIsInJlc3AiLCJpbnNlcnRJZCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwiaWQiLCJwZXJzb24xIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJzcGVjaWZpY0ZyaWVuZCIsInBlcnNvbiIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInVuZGVmaW5lZCIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxJQUFELEVBQU1DLElBQU4sRUFBYTtBQUM1QixNQUFNQyxPQUFPQyxLQUFLQyxHQUFMLENBQVNKLE9BQU9DLElBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLElBQVg7QUFDQSxDQUhEOztBQUtBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBa0I7QUFDL0IsTUFBTUMsUUFBUSxFQUFkO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQU1JLE1BQTFCLEVBQWtDRCxHQUFsQyxFQUF1Qzs7QUFFckMsU0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE9BQU9HLE1BQTNCLEVB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QUlwRixjQUFZLEVBQWhCO0FBQ0EsdUJBQUssSUFBSUMsR0FBVCxJQUFnQjNHLEtBQWhCLEVBQXNCO0FBQ3BCMEcsZ0NBQVlDLEdBQVosSUFBaUI5RyxLQUFLaU0sWUFBTCxFQUFrQjlMLE1BQU0yRyxHQUFOLENBQWxCLENBQWpCO0FBQ0Q7QUFDRDFFLDBCQUFRQyxHQUFSLENBQVl3RSxXQUFaO0FBQ0Esc0JBQUk0RixZQUFVLEVBQWQ7QUFDQSx1QkFBSyxJQUFJM0YsR0FBVCxJQUFnQkQsV0FBaEIsRUFBNEI7QUFDMUI0Riw4QkFBVWxNLElBQVYsQ0FBZSxDQUFDdUcsR0FBRCxFQUFLRCxZQUFZQyxHQUFaLENBQUwsQ0FBZjtBQUNEO0FBQ0QxRSwwQkFBUUMsR0FBUixDQUFZb0ssU0FBWjtBQUNBdEssc0JBQUlVLElBQUosQ0FBUzRKLFNBQVQ7QUFDQWxJLHNCQUFJTyxPQUFKO0FBQ0Q7QUFDRixlQXhDRDtBQXlDRCxhQTVDRDtBQTZDRCxXQS9DRDtBQWdERCxTQXpERDtBQTBERCxPQTdERDtBQThERCxLQWxFRDtBQW1FRCxHQXJFRDtBQXNFRCxDQXpFRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbi8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBoZWxwZXIgPSAobnVtMSxudW0yKT0+e1xyXG5jb25zdCBkaWZmID0gTWF0aC5hYnMobnVtMSAtIG51bTIpO1xyXG4gcmV0dXJuIDUgLSBkaWZmO1xyXG59O1xyXG5cclxuY29uc3QgY29tcCA9IChmaXJzdCwgc2Vjb25kKT0+IHtcclxuY29uc3QgZmluYWwgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XHJcblxyXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuY29uc3Qgc3VtID0gZmluYWwucmVkdWNlKChhLGIpID0+IGEgKyBiLCAwKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCgyMCAqIHN1bSAvIGZpbmFsLmxlbmd0aCk7XHJcbn07XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5jb25zdCBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XHJcbmNvbnN0IE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xyXG5jb25zdCBSYXRpbmcgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JhdGluZycpO1xyXG5jb25zdCBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xyXG5jb25zdCBhbGxSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9hbGxSZXF1ZXN0Jyk7XHJcblxyXG4vLyB2YXIgTW92aWVzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL21vdmllcycpO1xyXG5jb25zdCBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxuLy8gdmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxuY29uc3QgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcclxudmFyIGFsbFJlcXVlc3RzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL2FsbFJlcXVlc3RzJyk7XHJcblxyXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuXHJcbmNvbnN0IHBvb2wgID0gbXlzcWwuY3JlYXRlUG9vbCh7XHJcbiAgY29ubmVjdGlvbkxpbWl0IDogNCxcclxuICBob3N0OiBcInVzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0XCIsXHJcbiAgdXNlcjogJ2I2ZTcyNjU5ZTRmNjJlJyxcclxuICBwYXNzd29yZDogICc0Yjc1ZDQzZicsXHJcbiAgZGF0YWJhc2U6ICdoZXJva3VfODc0MzUyMWFlNjhkNTgzJ1xyXG59KTtcclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vL3VzZXIgYXV0aFxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQgPT57XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kV2F0Y2hSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSk7XHJcbiAgbGV0IHJlcXVlc3RlZXM7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICBQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgcmVxdWVzdGVlID0+IHtcclxuICAgIGFsbFJlcXVlc3RzLmNyZWF0ZSh7XHJcbiAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICByZXF1ZXN0ZWU6IHJlcXVlc3RlZSxcclxuICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcclxuICAgICAgbW92aWU6IHJlcS5ib2R5Lm1vdmllLFxyXG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGRvbmUgPT4ge1xyXG4gICAgcmVzcG9uc2Uuc2VuZCgnU3VjY2VzcycpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHRoZVJlcXVlc3QgPT4ge1xyXG4gICAgdGhlUmVxdWVzdC5kZXN0cm95KClcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChyZXEsIHJlc3BvbnNlKT0+IHtcclxuICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEltIGdldHRpbmcnLCByZXEuYm9keSk7XHJcbiAgbGV0IG5ld1JlcXVlc3Q7XHJcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlciA9PT0gcmVxLmJvZHkubmFtZSkge1xyXG4gICAgcmVzcG9uc2Uuc2VuZChcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIG5ld1JlcXVlc3QgPSB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgICAgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHJlcXVlc3RUeXA6ICdmcmllbmQnXHJcbiAgICAgIH07XHJcblxyXG4gICAgcG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uKGVyciwgY29uKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnc2VuZFJlcXVlc3QnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdTRUxFQ1QgcmVxdWVzdGVlLHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdG9yID0nICsgbmV3UmVxdWVzdFsncmVxdWVzdG9yJ10gKyAnIEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJyk7XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSwgcmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJywgbmV3UmVxdWVzdFsncmVxdWVzdG9yJ10sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgaWYgKCFyZXMpIHtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlciggYSA9PiBhLnJlc3BvbnNlID09PSBudWxsKTtcclxuICAgICAgICB2YXIgcmVxdWVzdGVlcyA9IHBwbFJlcWQubWFwKCBhID0+IGEucmVxdWVzdGVlICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgbmV3UmVxdWVzdCwgKGVyciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdGVlcyk7XHJcbiAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuY29uc29sZS5sb2coJ3JlcXVlc3RlZScsIHJlcXVlc3RlZSk7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdsaXN0UmVxdWVzdHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnICsgJ09SIHJlcXVlc3RvciA9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhbGwgdGhlIHBlb3BsZScscmVzKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChbcmVzLCByZXF1ZXN0ZWVdKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG5cclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2FjY2VwdCcpOyB0aHJvdyBlcnI7IH1cclxuICAgIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInK3JlcXVlc3RUeXBlKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RvciwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xyXG4gICAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0ZWUsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMixcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSAocmVxLCByZXMpID0+e1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcclxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24odGhlUmVxdWVzdCkge1xyXG4gICAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICB2YXIgbW92aWVzID0gW107XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xyXG4gIHZhciBwZXJzb24gPSByZXEuYm9keS5zcGVjaWZpY0ZyaWVuZDtcclxuICB2YXIgaWQgPSBudWxsO1xyXG4gIHZhciBsZW4gPSBudWxsO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coaWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJycnJycnJycicsIGVyciwgcmVzcC5sZW5ndGgpO1xyXG4gICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZW4gPSByZXNwLmxlbmd0aDtcclxuICAgICAgICByZXNwLmZvckVhY2goYSA9PiB7XHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgICAgICBtb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSwgYS5zY29yZSwgYS5yZXZpZXddKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWVzKTtcclxuICAgICAgICAgICAgaWYgKG1vdmllcy5sZW5ndGggPT09IGxlbikge1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcclxuICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2ZpbmRNb3ZpZUJ1ZGRpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgdmFyIHBlb3BsZSA9IHJlc3AubWFwKGEgPT4gYS51c2VybmFtZSk7XHJcbiAgICAgIHZhciBJZHMgPSByZXNwLm1hcChhID0+IGEuaWQpO1xyXG4gICAgICB2YXIgaWRLZXlPYmogPSB7fTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZEtleU9ialtJZHNbaV1dID0gcGVvcGxlW2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLCBjdXJyZW50VXNlcik7XHJcblxyXG4gICAgICB2YXIgb2JqMSA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG9iajFbaWRLZXlPYmpbSWRzW2ldXV0gPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJywgKGVyciwgcmVzcG9uKT0+IHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLCByZXNwb25baV0uc2NvcmVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmoxJywgb2JqMSk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VySW5mbyA9IG9iajFbY3VycmVudFVzZXJdO1xyXG5cclxuICAgICAgICB2YXIgY29tcGFyaXNvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iajEpIHtcclxuICAgICAgICAgIGlmIChrZXkgIT09IGN1cnJlbnRVc2VyKSB7XHJcbiAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV0gPSBjb21wKGN1cnJlbnRVc2VySW5mbywgb2JqMVtrZXldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgIHZhciBmaW5hbFNlbmQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpIHtcclxuICAgICAgICAgIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgY29tcGFyaXNvbnNba2V5XV0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgJ05vIENvbXBhcmlzb24gdG8gTWFrZSddKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpO1xyXG4gICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5kZWNsaW5lID0gZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XHJcbiAgdmFyIGFkZE9uPSFtb3ZpZT8nIEFORCByZXF1ZXN0VHlwPScrJ1wiJysgcmVxdWVzdFR5cGUrJ1wiJzonIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIic7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdkZWNsaW5lJyk7IHRocm93IGVycjsgfSAgICBcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInK2FkZE9uLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xyXG4gICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PiB7XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ3VzZXIgY2Fubm90IGJlIGNyZWF0ZWQnfX0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kPT57XHJcbiAgICBpZiAoZm91bmQpe1xyXG4gICAgICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbih1c2VyPT57XHJcbiAgICAgICAgaWYgKHVzZXIpe1xyXG4gICAgICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gdXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZvdW5kICcsIGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnd3JvbmcgcGFzc3dvcmQnKTtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICBjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcclxuICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coJ2xvZ291dCcpO1xyXG4gIHJlcy5zZW5kKCdsb2dvdXQnKTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9tb3ZpZSBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxyXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XHJcbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcclxuICBsZXQgdXNlcmlkO1xyXG4gIHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxyXG4gIC50aGVuKGZvdW5kVXNlciA9PiB7XHJcbiAgICB1c2VyaWQgPSBmb3VuZFVzZXIuYXR0cmlidXRlcy5pZDtcclxuICAgIHJldHVybiBuZXcgUmF0aW5nKHsgbW92aWVpZDogcmVxLmJvZHkuaWQsIHVzZXJpZDogdXNlcmlkIH0pLmZldGNoKClcclxuICAgIC50aGVuKGZvdW5kUmF0aW5nID0+IHtcclxuICAgICAgaWYgKGZvdW5kUmF0aW5nKSB7XHJcbiAgICAgICAgLy9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xyXG4gICAgICAgIC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXHJcbiAgICAgICAgbGV0IHJhdGluZ09iajtcclxuICAgICAgICBpZiAocmVxLmJvZHkucmF0aW5nKSB7XHJcbiAgICAgICAgICByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXEuYm9keS5yZXZpZXcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcclxuICAgICAgICAgIC5zYXZlKHJhdGluZ09iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xyXG4gICAgICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XHJcbiAgICAgICAgICBzY29yZTogcmVxLmJvZHkucmF0aW5nLFxyXG4gICAgICAgICAgdXNlcmlkOiB1c2VyaWQsXHJcbiAgICAgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcclxuICAgICAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4obmV3UmF0aW5nID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdlcnJvcicpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXHJcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoZXNlIGF0cmlidXRlIDoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbnZhciBhZGRPbmVNb3ZpZSA9IG1vdmllT2JqID0+IHtcclxuICBsZXQgZ2VucmUgPSAobW92aWVPYmouZ2VucmVfaWRzKSA/IGdlbnJlc1ttb3ZpZU9iai5nZW5yZV9pZHNbMF1dIDogJ24vYSc7XHJcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XHJcbiAgICBpZDogbW92aWVPYmouaWQsXHJcbiAgICB0aXRsZTogbW92aWVPYmoudGl0bGUsXHJcbiAgICBnZW5yZTogZ2VucmUsXHJcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcclxuICAgIHJlbGVhc2VfZGF0ZTogbW92aWVPYmoucmVsZWFzZV9kYXRlLFxyXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXHJcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcclxuICB9KS5zYXZlKG51bGwsIHttZXRob2Q6ICdpbnNlcnQnfSlcclxuICAudGhlbihuZXdNb3ZpZSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gICAgcmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJ3Byb2JsZW0gY3JlYXRpbmcgbW92aWUnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxyXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcclxuLy8gWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcclxuXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgICBxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcbiAgICAgIHJldHVybiBhdHRhY2hGcmllbmRBdmdSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldEZyaWVuZFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgLy9kZWNvcmF0ZSBpdCB3aXRoIGN1cnJlbnQgdXNlcidzIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBhdmVyYWdlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xyXG4gIHJldHVybiBnZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgLy9pZiBmcmllbmRzUmF0aW5ncyBpcyBudWxsLCBSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nIGlzIG51bGxcclxuICAgIGlmICghZnJpZW5kc1JhdGluZ3MpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXHJcbmNvbnN0IGF0dGFjaFVzZXJSYXRpbmcgPSAocmF0aW5nLCB1c2VybmFtZSkgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdtb3ZpZXMuaWQnLCAnPScsICdyYXRpbmdzLm1vdmllaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuICAgICAgJ21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbih1c2VyUmF0aW5nID0+IHtcclxuICAgIGlmICh1c2VyUmF0aW5nKSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZztcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgY2Fubm90IGZpbmQgdXNlciByYXRpbmcnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBpcyBhIHdyYXBlciBmdW5jdGlvbiBmb3IgZ2V0RnJpZW5kUmF0aW5ncyB3aGljaCB3aWxsIHNlbnQgdGhlIGNsaWVudCBhbGwgb2YgdGhlIGZyaWVuZCByYXRpbmdzXHJcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcclxuICBnZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuICAudGhlbihmcmllbmRSYXRpbmdzID0+IHtcclxuICAgIHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgZnJpZW5kIHJhdGluZ3MgZm9yIHRoZSBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIG91dHB1dHMgcmF0aW5ncyBvZiBhIHVzZXIncyBmcmllbmQgZm9yIGEgcGFydGljdWxhciBtb3ZpZVxyXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XHJcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cclxuY29uc3QgZ2V0RnJpZW5kUmF0aW5ncyA9ICh1c2VybmFtZSwgbW92aWVPYmopID0+IHtcclxuICByZXR1cm4gVXNlci5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcclxuICAgICAgJ21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAvL3RoZSBmb2xsb3dpbmcgYmxvY2sgYWRkcyB0aGUgZnJpZW5kTmFtZSBhdHRyaWJ1dGUgdG8gdGhlIHJhdGluZ3NcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZyaWVuZFJhdGluZyA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcih7IGlkOiBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy51c2VyMmlkIH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnJpZW5kID0+IHtcclxuICAgICAgICBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEZpcnN0TmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLmZpcnN0TmFtZTtcclxuICAgICAgICByZXR1cm4gZnJpZW5kUmF0aW5nO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgcmV0dXJuIGZyaWVuZHNSYXRpbmdzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxuY29uc3QgYXZlcmFnZVJhdGluZyA9IChyYXRpbmdzKSA9PiB7XHJcbiAgLy9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG4gIGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIHJldHVybiByYXRpbmdzLnJlZHVjZSgodG90YWwsIHJhdGluZykgPT4gdG90YWwgKyByYXRpbmcuYXR0cmlidXRlcy5zY29yZSwgMCkgLyByYXRpbmdzLmxlbmd0aDtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgb3V0cHV0cyB1c2VyIHJhdGluZyBhbmQgYXZlcmFnZSBmcmllbmQgcmF0aW5nIGZvciBvbmUgbW92aWVcclxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XHJcbmNvbnN0IGdldE9uZU1vdmllUmF0aW5nID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICBpZiAoIXJhdGluZykge1xyXG4gICAgICAvL2lmIHRoZSB1c2VyIGhhcyBub3QgcmF0ZWQgdGhlIG1vdmllLCByZXR1cm4gYW4gb2JqIHRoYXQgaGFzIHRoZSBtb3ZpZSBpbmZvcm1hdGlvbiwgYnV0IHNjb3JlIGlzIHNldCB0byBudWxsXHJcbiAgICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihtb3ZpZSA9PiB7XHJcbiAgICAgICAgbW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1vdmllO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmcgPT4ge1xyXG4gICAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAgIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaWV2ZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG4vL291dHB1dHMgWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuICBQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIG1vdmllID0+IHtcclxuICAgIC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2VcclxuICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PiB7XHJcbiAgICAgIC8vaWYgbm90IGNyZWF0ZSBvbmVcclxuICAgICAgaWYgKCFmb3VuZE1vdmllKSB7XHJcbiAgICAgICAgcmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZm91bmRNb3ZpZTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC50aGVuKGZvdW5kTW92aWUgPT57XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG4gICAgICByZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgYWRkIG1vdmllJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XHJcbiAgICByZXMuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLCAnY2Fubm90IGdldCBtb3ZpZScpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIGFwaV9rZXk6ICc5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMicsXHJcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxyXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXHJcbiAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJ1xyXG4gIH07XHJcblxyXG4gIGxldCBkYXRhID0gJyc7XHJcbiAgcmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG4gICAgcXM6IHBhcmFtc1xyXG4gIH0pXHJcbiAgLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xyXG4gICAgZGF0YSArPSBjaHVuaztcclxuICB9KVxyXG4gIC5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgcmVxLmJvZHkubW92aWVzID0gSlNPTi5wYXJzZShkYXRhKS5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcbiAgfSlcclxuICAub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IsICdUaGVNb3ZpZURCIGRvZXMgbm90IHJlc3BvbmQnKTtcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG5jb25zdCBnZW5yZXMgPSB7XHJcbiAgIDEyOiAnQWR2ZW50dXJlJyxcclxuICAgMTQ6ICdGYW50YXN5JyxcclxuICAgMTY6ICdBbmltYXRpb24nLFxyXG4gICAxODogJ0RyYW1hJyxcclxuICAgMjc6ICdIb3Jyb3InLFxyXG4gICAyODogJ0FjdGlvbicsXHJcbiAgIDM1OiAnQ29tZWR5JyxcclxuICAgMzY6ICdIaXN0b3J5JyxcclxuICAgMzc6ICdXZXN0ZXJuJyxcclxuICAgNTM6ICdUaHJpbGxlcicsXHJcbiAgIDgwOiAnQ3JpbWUnLFxyXG4gICA5OTogJ0RvY3VtZW50YXJ5JyxcclxuICAgODc4OiAnU2NpZW5jZSBGaWN0aW9uJyxcclxuICAgOTY0ODogJ015c3RlcnknLFxyXG4gICAxMDQwMjogJ011c2ljJyxcclxuICAgMTA3NDk6ICdSb21hbmNlJyxcclxuICAgMTA3NTE6ICdGYW1pbHknLFxyXG4gICAxMDc1MjogJ1dhcicsXHJcbiAgIDEwNzY5OiAnRm9yZWlnbicsXHJcbiAgIDEwNzcwOiAnVFYgTW92aWUnXHJcbiB9O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXHJcbi8vaXQgd2lsbCBzZW5kIGJhY2sgbW92aWUgb2JqcyB0aGF0IG1hdGNoIHRoZSBzZWFyY2ggaW5wdXQsIGV4cGVjdHMgbW92aWUgbmFtZSBpbiByZXEuYm9keS50aXRsZVxyXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZVJhdyhgTUFUQ0ggKG1vdmllcy50aXRsZSkgQUdBSU5TVCAoJyR7cmVxLnF1ZXJ5LnRpdGxlfScgSU4gTkFUVVJBTCBMQU5HVUFHRSBNT0RFKWApO1xyXG4gICAgcWIuYW5kV2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKG1hdGNoZXMgPT4ge1xyXG4gICAgY29uc29sZS5sb2cobWF0Y2hlcy5tb2RlbHMpO1xyXG4gICAgcmVzLmpzb24obWF0Y2hlcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBzZWFyY2ggREInKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gc2VhcmNoJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXR1cm4gUmVsYXRpb24ucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHMgPT4ge1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kVXNlcil7XHJcbiAgICAgICAgcmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG4gICAgcmVzLmpzb24oZnJpZW5kcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHBlb3BsZUlkID0gW107XHJcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0RnJpZW5kcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXHJcbiAgICBcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwZW9wbGVJZC5pbmRleE9mKHJlc3BbaV0udXNlcjJpZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgcGVvcGxlID0gW11cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XHJcbiAgICAgICAgICB2YXIga2V5SWQ9e307XHJcbiAgICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xyXG4gICAgICAgICAgICAgIGtleUlkW2FdPXJlc3BvWzBdLnVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgYScsYSlcclxuICAgICAgICAgICAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcclxuICAgICAgICAgICAgICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgcGVvcGxlJywgcGVvcGxlKTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmFsJyxmaW5hbCx1c2Vyc1JhdGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB2ZXJ5RmluYWw9W107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9KTtcclxufTtcclxuXHJcbiJdfQ==