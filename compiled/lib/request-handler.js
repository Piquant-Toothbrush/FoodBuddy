'use strict';
//////////////////
///////////////The algorithm
/////////////////////

var helper = function helper(c, d) {
  var e = Math.abs(c - d);
  return 5 - e;
},
    comp = function comp(c, d) {
  var e = [];
  for (var i = 0; i < c.length; i++) {

    for (var x = 0; x < d.length; x++) {

      if (c[i][0] === d[x][0]) {

        e.push(helper(c[i][1], d[x][1]));
      }
    }
  }

  var f = e.reduce(function (a, b) {
    return a + b;
  }, 0);
  return Math.round(20 * f / e.length);
},
    mysql = require('mysql'),
    Movie = require('../app/models/movie'),
    Rating = require('../app/models/rating'),
    Relation = require('../app/models/relation'),
    User = require('../app/models/user'),
    allRequest = require('../app/models/allRequest'),
    Ratings = require('../app/collections/ratings'),
    Users = require('../app/collections/users'),
    allRequests = require('../app/collections/allRequests'),
    Promise = require('bluebird'),
    request = require('request'),
    pool = mysql.createPool({
  connectionLimit: 4,
  host: "us-cdbr-iron-east-04.cleardb.net",
  user: 'b6e72659e4f62e',
  password: '4b75d43f',
  database: 'heroku_8743521ae68d583'
});
///////////////////////////////
/////////////////////////////
//////////////////////////


// var Movies = require('../app/collections/movies');

// var Relations = require('../app/collections/relations');


/////////////////
////user auth
/////////////////

exports.signupUser = function (c, d) {
  // console.log('this is the session',req.session)
  new User({ username: c.body.name }).fetch().then(function (e) {
    if (e) {
      d.status(403).send('username exist');
      //check password
      //if (password matches)
      //{ add sessions and redirect}
    } else {
      c.mySession.user = c.body.name;
      Users.create({
        username: c.body.name,
        password: c.body.password
      }).then(function (f) {
        d.status(201).send('login created');
      });
    }
  });
};

exports.sendWatchRequest = function (c, d) {
  var e = void 0;
  if (Array.isArray(c.body.requestee)) {
    e = c.body.requestee;
  } else {
    e = [c.body.requestee];
  }
  Promise.each(e, function (f) {
    allRequests.create({
      requestor: c.mySession.user,
      requestee: f,
      requestTyp: 'watch',
      movie: c.body.movie,
      message: c.body.message
    });
  }).then(function (f) {
    d.send('Success');
  }).catch(function (f) {
    d.status(500).json({ error: !0, data: { message: f.message } });
  });
};

exports.removeWatchRequest = function (c, d) {
  if (Array.isArray(c.body.requestee)) {
    var e = c.body.requestee;
  } else {
    var e = [c.body.requestee];
  }
  var f = c.body.requestor,
      g = c.body.movie;


  allRequest.forge({ requestor: f, requestee: e, movie: g }).fetch().then(function (h) {
    h.destroy().then(function () {
      d.json({ error: !0, data: { message: 'User successfully deleted' } });
    }).catch(function (j) {
      d.status(500).json({ error: !0, data: { message: j.message } });
    });
  }).catch(function (h) {
    d.status(500).json({ error: !0, data: { message: h.message } });
  });
};

exports.sendRequest = function (c, d) {
  var e = void 0;
  if (c.mySession.user === c.body.name) {
    d.send(["You can't friend yourself!"]);
  } else {
    e = {
      requestor: c.mySession.user,
      requestee: c.body.name,
      requestTyp: 'friend'
    };

    pool.getConnection(function (f, g) {
      if (f) {
        throw f;
      }
      g.query('SELECT requestee, response FROM allrequests WHERE requestor = ? AND requestTyp =' + '"' + 'friend' + '"', c.mySession.user, function (h, j) {
        if (h) {
          throw h;
        }
        if (!j) {
          d.send(['no friends']);
        }

        var k = j.filter(function (a) {
          return a.response === null;
        }),
            l = k.map(function (a) {
          return a.requestee;
        });


        g.query('INSERT INTO allrequests SET ?', e, function (m, n) {
          if (m) {
            throw m;
          }

          d.send(l);
          g.release();
        });
      });
    });
  }
};

exports.listRequests = function (c, d) {
  var e = c.mySession.user;

  pool.getConnection(function (f, g) {
    if (f) {
      throw f;
    }
    g.query('Select * FROM allrequests WHERE requestee=' + '"' + e + '"' + '' + 'AND response IS NOT NULL', function (h, j) {
      if (h) {
        throw h;
      }

      d.send([j, e]);
      g.release();
    });
  });
};

exports.accept = function (c, d) {
  var e = c.body.personToAccept,
      f = c.mySession.user,
      g = c.body.movie,
      h = 'friend';


  pool.getConnection(function (j, k) {
    if (j) {
      throw j;
    }
    if (g === '') {
      k.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + e + '"' + ' AND requestTyp=' + '"' + h + '"', function (l, m) {
        if (l) throw l;
      });
    } else {
      k.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + e + '"' + ' AND movie=' + '"' + g + '"', function (l, m) {
        if (l) throw l;
      });
    }

    k.query('SELECT id FROM users WHERE username = ?', e, function (l, m) {
      if (l) throw l;

      var n = m[0].id;
      k.query('SELECT id FROM users WHERE username = ?', f, function (o, p) {
        if (o) throw o;


        var q = p[0].id,
            r = {
          user1id: n,
          user2id: q
        },
            s = {
          user1id: q,
          user2id: n
        };

        k.query('INSERT INTO relations SET ?', r, function (t, u) {
          if (t) throw t;


          k.query('INSERT INTO relations SET ?', s, function (v, w) {
            if (v) throw v;

            d.send('Success');
            k.release();
          });
        });
      });
    });
  });
};

exports.removeRequest = function (c, d) {
  var e = c.body.requestor,
      f = c.body.requestee;


  allRequest.forge({ requestor: e, requestee: f }).fetch().then(function (g) {
    g.destroy().then(function () {
      d.json({ error: !0, data: { message: 'User successfully deleted' } });
    }).catch(function (h) {
      d.status(500).json({ error: !0, data: { message: h.message } });
    });
  }).catch(function (g) {
    d.status(500).json({ error: !0, data: { message: g.message } });
  });
};

exports.getThisFriendsMovies = function (c, d) {

  var e = [],
      f = c.body.specificFriend,
      g = null,
      h = null;

  pool.getConnection(function (j, k) {
    if (j) {
      throw j;
    }
    k.query('SELECT id FROM users WHERE username = ?', f, function (l, m) {
      if (l) {
        throw l;
      }
      g = m[0].id;


      k.query('SELECT * FROM ratings WHERE userid = ?', g, function (n, o) {
        if (n) {
          throw n;
        }
        h = o.length;
        o.forEach(function (a) {
          k.query('SELECT title FROM movies WHERE id = ?', a.movieid, function (p, q) {
            if (p) {
              throw p;
            }
            e.push([q[0].title, a.score, a.review]);

            if (e.length === h) {
              d.send(e);
              k.release();
            }
          });
        });
      });
    });
  });
};

exports.findMovieBuddies = function (c, d) {
  pool.getConnection(function (e, f) {
    if (e) {
      throw e;
    }
    f.query('SELECT * FROM users', function (g, h) {
      var j = h.map(function (a) {
        return a.username;
      }),
          k = h.map(function (a) {
        return a.id;
      }),
          l = {};

      for (var i = 0; i < k.length; i++) {
        l[k[i]] = j[i];
      }

      var m = c.mySession.user,
          n = {};

      for (var i = 0; i < k.length; i++) {
        n[l[k[i]]] = [];
      }

      f.query('SELECT score,movieid,userid FROM ratings', function (o, p) {

        for (var i = 0; i < p.length; i++) {
          n[l[p[i].userid]].push([p[i].movieid, p[i].score]);
        }

        var q = n[m],
            r = {};

        for (var s in n) {
          if (s !== m) {
            r[s] = comp(q, n[s]);
          }
        }

        var t = [];
        for (var s in r) {
          if (r[s] !== 'NaN%') {
            t.push([s, r[s]]);
          } else {
            t.push([s, 'No Comparison to Make']);
          }
        }
        d.send(t);
        f.release();
      });
    });
  });
};

exports.decline = function (c, d) {
  var e = c.body.personToDecline,
      f = c.mySession.user,
      g = c.body.movie,
      h = 'friend',
      j = !g ? ' AND requestTyp=' + '"' + h + '"' : ' AND requestee=' + '"' + f + '"' + ' AND movie =' + '"' + g + '"';

  pool.getConnection(function (k, l) {
    if (k) {
      throw k;
    }
    l.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + e + '"' + j, function (m, n) {
      if (m) {
        throw m;
      }

      d.send(e + 'deleted');
      l.release();
    });
  });
};

exports.signupUser = function (c, d) {
  // console.log('this is the session',req.session)
  new User({ username: c.body.name }).fetch().then(function (e) {
    if (e) {
      d.status(403).send('username exist');
      //check password
      //if (password matches)
      //{ add sessions and redirect}
    } else {
      c.mySession.user = c.body.name;
      Users.create({
        username: c.body.name,
        password: c.body.password
      }).then(function (f) {
        d.status(201).send('login created');
      }).catch(function (f) {
        d.status(400).json({ error: !0, data: { message: 'user cannot be created' } });
      });
    }
  });
};

exports.signinUser = function (c, d) {
  new User({ username: c.body.name }).fetch().then(function (e) {
    if (e) {
      new User({ username: c.body.name, password: c.body.password }).fetch().then(function (f) {
        if (f) {
          c.mySession.user = f.attributes.username;

          d.send(['it worked', c.mySession.user]);
        } else {
          d.status(404).send('bad login');
        }
      });
    } else {
      d.status(404).send('bad login');
    }
  });
};

exports.logout = function (c, d) {
  c.mySession.destroy(function (e) {});

  d.send('logout');
};

/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function (c, d) {
  var e = void 0;
  return new User({ username: c.mySession.user }).fetch().then(function (f) {
    e = f.attributes.id;
    return new Rating({ movieid: c.body.id, userid: e }).fetch().then(function (g) {
      if (g) {
        //since rating or review is updated seperatly in client, the following
        //make sure it gets updated according to the req
        // console.log('update rating', foundRating)
        var h = void 0;
        if (c.body.rating) {
          h = { score: c.body.rating };
        } else if (c.body.review) {
          h = { review: c.body.review };
        }
        return new Rating({ 'id': g.attributes.id }).save(h);
      } else {
        return Ratings.create({
          score: c.body.rating,
          userid: e,
          movieid: c.body.id,
          review: c.body.review
        });
      }
    });
  }).then(function (f) {
    d.status(201).send('rating recieved');
  }).catch(function (f) {
    d.status(400).send('error');
  });
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = function addOneMovie(c) {
  var d = c.genre_ids ? genres[c.genre_ids[0]] : 'n/a';
  return new Movie({
    id: c.id,
    title: c.title,
    genre: d,
    poster: 'https://image.tmdb.org/t/p/w185/' + c.poster_path,
    release_date: c.release_date,
    description: c.overview.slice(0, 255),
    imdbRating: c.vote_average
  }).save(null, { method: 'insert' }).then(function (e) {
    return e;
  }).catch(function (e) {});
};

//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// will get ratings for the current user

exports.getUserRatings = function (c, d) {
  Rating.query(function (e) {
    e.innerJoin('users', 'ratings.userid', '=', 'users.id');
    e.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    e.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review', 'ratings.updated_at');
    e.where('users.username', '=', c.mySession.user);
    e.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (e) {
    //decorate it with avg friend rating
    return Promise.map(e.models, function (f) {
      return attachFriendAvgRating(f, c.mySession.user);
    });
  }).then(function (e) {
    d.status(200).json(e);
  }).catch(function (e) {
    d.status(400).send('unable to retrive ratings');
  });
};

exports.getFriendUserRatings = function (c, d) {
  Rating.query(function (e) {
    e.innerJoin('users', 'ratings.userid', '=', 'users.id');
    e.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    e.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score as friendScore', 'ratings.review as friendReview', 'ratings.updated_at');
    e.where('users.username', '=', c.query.friendName);
    e.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (e) {
    //decorate it with current user's rating
    return Promise.map(e.models, function (f) {
      return attachUserRating(f, c.mySession.user);
    });
  }).then(function (e) {
    d.status(200).json(e);
  }).catch(function (e) {
    d.status(400).send('unable to retrive average friend ratings');
  });
};

//a decorator function that attaches friend avg rating to the rating obj
var attachFriendAvgRating = function attachFriendAvgRating(c, d) {
  return getFriendRatings(d, c).then(function (e) {
    //if friendsRatings is null, Rating.attributes.friendAverageRating is null
    if (!e) {
      c.attributes.friendAverageRating = null;
    } else {
      c.attributes.friendAverageRating = averageRating(e);
    }
    return c;
  });
},
    attachUserRating = function attachUserRating(c, d) {
  return Rating.query(function (e) {
    e.innerJoin('users', 'users.id', '=', 'ratings.userid');
    e.innerJoin('movies', 'movies.id', '=', 'ratings.movieid');
    e.select('ratings.score', 'ratings.review');
    e.where({
      'users.username': d,
      'movies.title': c.attributes.title,
      'movies.id': c.attributes.id
    });
  }).fetch().then(function (e) {
    if (e) {
      c.attributes.score = e.attributes.score;
      c.attributes.review = e.attributes.review;
    } else {
      c.attributes.score = null;
      c.attributes.review = null;
    }
    return c;
  }).catch(function (e) {});
};

//a decorator function that attaches user rating and reviews to the rating obj


//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = function (c, d) {
  getFriendRatings(c.mySession.user, { attributes: c.body.movie }).then(function (e) {
    d.json(e);
  }).catch(function (e) {
    d.status(400).send('unable to retrive friend ratings for the movie');
  });
};

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
var getFriendRatings = function getFriendRatings(c, d) {
  return User.query(function (e) {
    e.innerJoin('relations', 'relations.user1id', '=', 'users.id');
    e.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
    e.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    e.select('relations.user2id', 'movies.title', 'ratings.score', 'ratings.review');
    e.where({
      'users.username': c,
      'movies.title': d.attributes.title,
      'movies.id': d.attributes.id });
  }).fetchAll().then(function (e) {
    //the following block adds the friendName attribute to the ratings
    return Promise.map(e.models, function (f) {
      return new User({ id: f.attributes.user2id }).fetch().then(function (g) {
        f.attributes.friendUserName = g.attributes.username;
        f.attributes.friendFirstName = g.attributes.firstName;
        return f;
      }).catch(function (g) {
        throw g;
      });
    });
  }).then(function (e) {
    return e;
  }).catch(function (e) {
    throw e;
  });
},
    averageRating = function averageRating(c) {
  //return null if no friend has rated the movie
  if (c.length === 0) {
    return null;
  }
  return c.reduce(function (d, e) {
    return d + e.attributes.score;
  }, 0) / c.length;
},
    getOneMovieRating = function getOneMovieRating(c, d) {
  return Rating.query(function (e) {
    e.innerJoin('users', 'ratings.userid', '=', 'users.id');
    e.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    e.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    e.where({ 'users.username': c, 'movies.title': d.title, 'movies.id': d.id });
  }).fetch().then(function (e) {
    if (!e) {
      //if the user has not rated the movie, return an obj that has the movie information, but score is set to null
      return new Movie({ title: d.title, id: d.id }).fetch().then(function (f) {
        f.attributes.score = null;
        return f;
      });
    } else {
      return e;
    }
  }).then(function (e) {
    return getFriendRatings(c, e).then(function (f) {
      // console.log('friendsRatings', friendsRatings);
      e.attributes.friendAverageRating = averageRating(f);

      return e;
    }).catch(function (f) {
      throw f;
    });
  }).catch(function (e) {
    throw e;
  });
};

//a helper function that averages the rating
//inputs ratings, outputs the average score;


//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function (c, d) {
  Promise.map(c.body.movies, function (e) {
    //first check whether movie is in the database
    return new Movie({ title: e.title, id: e.id }).fetch().then(function (f) {
      //if not create one
      if (!f) {
        return addOneMovie(e);
      } else {
        return f;
      }
    }).then(function (f) {
      // console.log('found movie', foundMovie);
      return getOneMovieRating(c.mySession.user, f.attributes);
    }).catch(function (f) {
      throw f;
    });
  }).then(function (e) {
    d.json(e);
  }).catch(function (e) {
    throw e;
  });
};

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = function (c, d) {
  var e = {
    api_key: '9d3b035ef1cd669aed398400b17fcea2',
    primary_release_year: new Date().getFullYear(),
    include_adult: !1,
    sort_by: 'popularity.desc'
  },
      f = '';

  request({
    method: 'GET',
    url: 'https://api.themoviedb.org/3/discover/movie/',
    qs: e
  }).on('data', function (g) {
    f += g;
  }).on('end', function () {
    c.body.movies = JSON.parse(f).results;
    //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
    exports.getMultipleMovieRatings(c, d);
  }).on('error', function (g) {});
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
exports.searchRatedMovie = function (c, d) {
  return Rating.query(function (e) {
    e.innerJoin('users', 'ratings.userid', '=', 'users.id');
    e.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
    e.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
    e.whereRaw('MATCH (movies.title) AGAINST (\'' + c.query.title + '\' IN NATURAL LANGUAGE MODE)');
    e.andWhere('users.username', '=', c.mySession.user);
    e.orderBy('updated_at', 'DESC');
  }).fetchAll().then(function (e) {
    d.json(e);
  }).catch(function (e) {
    d.status(400).send('unable to search');
  });
};

////////////////////////
/////friendship handlers
////////////////////////

exports.getFriendList = function (c, d) {
  return Relation.query(function (e) {
    e.innerJoin('users', 'relations.user1id', '=', 'users.id');
    e.select('relations.user2id');
    e.where({
      'users.username': c.mySession.user
    });
  }).fetchAll().then(function (e) {
    return Promise.map(e.models, function (f) {
      return new User({ id: f.attributes.user2id }).fetch().then(function (g) {
        return g.attributes.username;
      }).catch(function (g) {
        throw g;
      });
    });
  }).then(function (e) {
    d.json(e);
  }).catch(function (e) {
    d.status(400).send('unable to get friends');
  });
};

exports.getFriends = function (c, d) {
  var e = [],
      f = c.mySession.user;

  pool.getConnection(function (g, h) {
    if (g) {
      throw g;
    }
    h.query('SELECT id FROM users WHERE username = ?', f, function (j, k) {
      var l = k[0].id;


      h.query('SELECT * FROM ratings WHERE userid = ?', l, function (m, n) {
        var o = n.map(function (a) {
          return [a.movieid, a.score];
        });

        h.query('SELECT * FROM relations WHERE user1id = ?', l, function (p, q) {
          for (var i = 0; i < q.length; i++) {
            if (e.indexOf(q[i].user2id) === -1) {
              e.push(q[i].user2id);
            }
          }
          var r = [],
              s = {};

          e.forEach(function (a) {

            h.query('SELECT username FROM users WHERE id = ?', a, function (t, u) {
              s[a] = u[0].username;

              h.query('SELECT * FROM ratings WHERE userid =' + '"' + a + '"', function (v, w) {
                if (w.length === 0) {
                  w = [{ userid: a, movieid: Math.round(Math.random() * 10000), score: 99 }];
                }


                r.push(w.map(function (a) {
                  return [a.userid, a.movieid, a.score];
                }));

                if (r.length === e.length) {
                  var y = {};

                  for (var i = 0; i < r.length; i++) {
                    if (r[i][0] !== void 0) {
                      y[s[r[i][0][0]]] = [];
                      for (var x = 0; x < r[i].length; x++) {
                        y[s[r[i][0][0]]].push([]);
                        for (var z = 1; z < r[i][x].length; z++) {
                          y[s[r[i][0][0]]][x].push(r[i][x][z]);
                        }
                      }
                    }
                  }

                  var A = {};
                  for (var B in y) {
                    A[B] = comp(o, y[B]);
                  }

                  var C = [];
                  for (var B in A) {
                    C.push([B, A[B]]);
                  }

                  d.send(C);
                  h.release();
                }
              });
            });
          });
        });
      });
    });
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwidXNlcm5hbWUiLCJib2R5IiwibmFtZSIsImZldGNoIiwidGhlbiIsImZvdW5kIiwic3RhdHVzIiwic2VuZCIsIm15U2Vzc2lvbiIsImNyZWF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJyZXNwb25zZSIsInJlcXVlc3RlZXMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWUiLCJlYWNoIiwicmVxdWVzdG9yIiwicmVxdWVzdFR5cCIsIm1vdmllIiwibWVzc2FnZSIsImNhdGNoIiwianNvbiIsImVycm9yIiwiZGF0YSIsImVyciIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwidGhlUmVxdWVzdCIsImRlc3Ryb3kiLCJzZW5kUmVxdWVzdCIsIm5ld1JlcXVlc3QiLCJnZXRDb25uZWN0aW9uIiwiY29uIiwicXVlcnkiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwicGVyc29uMSIsImlkIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJwZXJzb24iLCJzcGVjaWZpY0ZyaWVuZCIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUM1QixNQUFNQyxJQUFPQyxLQUFLQyxHQUFMLENBQVNKLElBQU9DLENBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLENBQVg7QUFDQSxDQUhEO0FBQUEsSUFLTUcsT0FBTyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBUUMsQ0FBUixFQUFrQjtBQUMvQixNQUFNQyxJQUFRLEVBQWQ7QUFDRSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBTUksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDOztBQUVyQyxTQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUosRUFBT0csTUFBM0IsRUFBbUNDLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJTCxFQUFNRyxDQUFOLEVBQVMsQ0FBVCxN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SUFBZ0JELENBQWhCLEVBQTRCO0FBQzFCMEYsc0JBQVU3TCxJQUFWLENBQWUsQ0FBQ29HLENBQUQsRUFBS0QsRUFBWUMsQ0FBWixDQUFMLENBQWY7QUFDRDs7QUFFRHhFLG9CQUFJUSxJQUFKLENBQVN5SixDQUFUO0FBQ0EvSCxvQkFBSU0sT0FBSjtBQUNEO0FBQ0YsZUF4Q0Q7QUF5Q0QsYUE1Q0Q7QUE2Q0QsV0EvQ0Q7QUFnREQsU0F6REQ7QUEwREQsT0E3REQ7QUE4REQsS0FsRUQ7QUFtRUQsR0FyRUQ7QUFzRUQsQ0F6RUQiLCJmaWxlIjoicmVxdWVzdC1oYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG4vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vVGhlIGFsZ29yaXRobVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuY29uc3QgaGVscGVyID0gKG51bTEsbnVtMik9PntcclxuY29uc3QgZGlmZiA9IE1hdGguYWJzKG51bTEgLSBudW0yKTtcclxuIHJldHVybiA1IC0gZGlmZjtcclxufTtcclxuXHJcbmNvbnN0IGNvbXAgPSAoZmlyc3QsIHNlY29uZCk9PiB7XHJcbmNvbnN0IGZpbmFsID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaXJzdC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2Vjb25kLmxlbmd0aDsgeCsrKSB7XHJcblxyXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xyXG5cclxuICAgIGZpbmFsLnB1c2goaGVscGVyKGZpcnN0W2ldWzFdLHNlY29uZFt4XVsxXSkpO1xyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbmNvbnN0IHN1bSA9IGZpbmFsLnJlZHVjZSgoYSxiKSA9PiBhICsgYiwgMCk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQoMjAgKiBzdW0gLyBmaW5hbC5sZW5ndGgpO1xyXG59O1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuY29uc3QgbXlzcWwgPSByZXF1aXJlKCdteXNxbCcpO1xyXG5jb25zdCBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcclxuY29uc3QgUmF0aW5nID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yYXRpbmcnKTtcclxuY29uc3QgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XHJcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcclxuY29uc3QgYWxsUmVxdWVzdCA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdCcpO1xyXG5cclxuLy8gdmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcclxuY29uc3QgUmF0aW5ncyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yYXRpbmdzJyk7XHJcbi8vIHZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XHJcbmNvbnN0IFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XHJcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcblxyXG5jb25zdCBwb29sICA9IG15c3FsLmNyZWF0ZVBvb2woe1xyXG4gIGNvbm5lY3Rpb25MaW1pdCA6IDQsXHJcbiAgaG9zdDogXCJ1cy1jZGJyLWlyb24tZWFzdC0wNC5jbGVhcmRiLm5ldFwiLFxyXG4gIHVzZXI6ICdiNmU3MjY1OWU0ZjYyZScsXHJcbiAgcGFzc3dvcmQ6ICAnNGI3NWQ0M2YnLFxyXG4gIGRhdGFiYXNlOiAnaGVyb2t1Xzg3NDM1MjFhZTY4ZDU4MydcclxufSk7XHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy91c2VyIGF1dGhcclxuLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kID0+e1xyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcclxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IChyZXEsIHJlc3BvbnNlKT0+IHtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keS5yZXF1ZXN0ZWUpO1xyXG4gIGxldCByZXF1ZXN0ZWVzO1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcclxuICB9XHJcbiAgUHJvbWlzZS5lYWNoKHJlcXVlc3RlZXMsIHJlcXVlc3RlZSA9PiB7XHJcbiAgICBhbGxSZXF1ZXN0cy5jcmVhdGUoe1xyXG4gICAgICByZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlcixcclxuICAgICAgcmVxdWVzdGVlOiByZXF1ZXN0ZWUsXHJcbiAgICAgIHJlcXVlc3RUeXA6ICd3YXRjaCcsXHJcbiAgICAgIG1vdmllOiByZXEuYm9keS5tb3ZpZSxcclxuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihkb25lID0+IHtcclxuICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMucmVtb3ZlV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcclxuICB9XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbih0aGVSZXF1ZXN0ID0+IHtcclxuICAgIHRoZVJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xyXG4gIGxldCBuZXdSZXF1ZXN0O1xyXG4gIGlmIChyZXEubXlTZXNzaW9uLnVzZXIgPT09IHJlcS5ib2R5Lm5hbWUpIHtcclxuICAgIHJlc3BvbnNlLnNlbmQoW1wiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIl0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIG5ld1JlcXVlc3QgPSB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgICAgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHJlcXVlc3RUeXA6ICdmcmllbmQnXHJcbiAgICAgIH07XHJcblxyXG4gICAgcG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uKGVyciwgY29uKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnc2VuZFJlcXVlc3QnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSwgcmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJyxyZXEubXlTZXNzaW9uLnVzZXIsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgaWYgKCFyZXMpIHtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQoWydubyBmcmllbmRzJ10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBwbFJlcWQgPSByZXMuZmlsdGVyKCBhID0+IGEucmVzcG9uc2UgPT09IG51bGwpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ZWVzID0gcHBsUmVxZC5tYXAoIGEgPT4gYS5yZXF1ZXN0ZWUgKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmFtZXMgb2YgcGVvcGxlIHdob20gSXZlIHJlcXVlc3RlZCBhcyBmcmllbmRzJywgcHBsUmVxZCk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCBuZXdSZXF1ZXN0LCAoZXJyLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3AuaW5zZXJ0SWQpO1xyXG4gICAgICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0ZWVzKTtcclxuICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMubGlzdFJlcXVlc3RzID0gKHJlcSwgcmVzcG9uc2UpID0+IHtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG5jb25zb2xlLmxvZygncmVxdWVzdGVlJywgcmVxdWVzdGVlKTtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2xpc3RSZXF1ZXN0cycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycgKyAnQU5EIHJlc3BvbnNlIElTIE5PVCBOVUxMJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgY29uc29sZS5sb2coJ2FsbCB0aGUgcGVvcGxlJyxyZXMpO1xyXG4gICAgICByZXNwb25zZS5zZW5kKFtyZXMsIHJlcXVlc3RlZV0pO1xyXG4gICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5hY2NlcHQgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XHJcblxyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnYWNjZXB0Jyk7IHRocm93IGVycjsgfVxyXG4gICAgaWYgKG1vdmllID09PSAnJykge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrcmVxdWVzdFR5cGUrJ1wiJywgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdG9yLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RlZSwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xyXG5cclxuICAgICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMlxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVxdWVzdDIgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IChyZXEsIHJlcykgPT57XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxyXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbih0aGVSZXF1ZXN0KSB7XHJcbiAgICAgIHRoZVJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gIHZhciBtb3ZpZXMgPSBbXTtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XHJcbiAgdmFyIHBlcnNvbiA9IHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kO1xyXG4gIHZhciBpZCA9IG51bGw7XHJcbiAgdmFyIGxlbiA9IG51bGw7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRUaGlzRnJpZW5kc01vdmllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcGVyc29uLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZyhpZCk7XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJycnJycnJyJywgZXJyLCByZXNwLmxlbmd0aCk7XHJcbiAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbiA9IHJlc3AubGVuZ3RoO1xyXG4gICAgICAgIHJlc3AuZm9yRWFjaChhID0+IHtcclxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgICAgIG1vdmllcy5wdXNoKFtyZXNwWzBdLnRpdGxlLCBhLnNjb3JlLCBhLnJldmlld10pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZXMpO1xyXG4gICAgICAgICAgICBpZiAobW92aWVzLmxlbmd0aCA9PT0gbGVuKSB7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xyXG4gICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZmluZE1vdmllQnVkZGllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICB2YXIgcGVvcGxlID0gcmVzcC5tYXAoYSA9PiBhLnVzZXJuYW1lKTtcclxuICAgICAgdmFyIElkcyA9IHJlc3AubWFwKGEgPT4gYS5pZCk7XHJcbiAgICAgIHZhciBpZEtleU9iaiA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlkS2V5T2JqW0lkc1tpXV0gPSBwZW9wbGVbaV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjdXJyZW50VXNlciA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnQgdXNlcicsIGN1cnJlbnRVc2VyKTtcclxuXHJcbiAgICAgIHZhciBvYmoxID0ge307XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgb2JqMVtpZEtleU9ialtJZHNbaV1dXSA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBzY29yZSxtb3ZpZWlkLHVzZXJpZCBGUk9NIHJhdGluZ3MnLCAoZXJyLCByZXNwb24pPT4ge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3Bvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQsIHJlc3BvbltpXS5zY29yZV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iajEnLCBvYmoxKTtcclxuICAgICAgICB2YXIgY3VycmVudFVzZXJJbmZvID0gb2JqMVtjdXJyZW50VXNlcl07XHJcblxyXG4gICAgICAgIHZhciBjb21wYXJpc29ucyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqMSkge1xyXG4gICAgICAgICAgaWYgKGtleSAhPT0gY3VycmVudFVzZXIpIHtcclxuICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XSA9IGNvbXAoY3VycmVudFVzZXJJbmZvLCBvYmoxW2tleV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgdmFyIGZpbmFsU2VuZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucykge1xyXG4gICAgICAgICAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCBjb21wYXJpc29uc1trZXldXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCAnTm8gQ29tcGFyaXNvbiB0byBNYWtlJ10pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZCk7XHJcbiAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmRlY2xpbmUgPSBmdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuICB2YXIgYWRkT249IW1vdmllPycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInOicgQU5EIHJlcXVlc3RlZT0nKydcIicrIHJlcXVlc3RlZSsnXCInKycgQU5EIG1vdmllID0nKydcIicrbW92aWUrJ1wiJztcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2RlY2xpbmUnKTsgdGhyb3cgZXJyOyB9ICAgIFxyXG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrYWRkT24sIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XHJcbiAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kID0+IHtcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAndXNlciBjYW5ub3QgYmUgY3JlYXRlZCd9fSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWduaW5Vc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQ9PntcclxuICAgIGlmIChmb3VuZCl7XHJcbiAgICAgIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKHVzZXI9PntcclxuICAgICAgICBpZiAodXNlcil7XHJcbiAgICAgICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSB1c2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm91bmQgJywgZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSk7XHJcbiAgICAgICAgICByZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VyIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJlcS5teVNlc3Npb24uZGVzdHJveShmdW5jdGlvbihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZygnbG9nb3V0Jyk7XHJcbiAgcmVzLnNlbmQoJ2xvZ291dCcpO1xyXG59O1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL21vdmllIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXHJcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cclxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xyXG4gIGxldCB1c2VyaWQ7XHJcbiAgcmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXHJcbiAgLnRoZW4oZm91bmRVc2VyID0+IHtcclxuICAgIHVzZXJpZCA9IGZvdW5kVXNlci5hdHRyaWJ1dGVzLmlkO1xyXG4gICAgcmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRSYXRpbmcgPT4ge1xyXG4gICAgICBpZiAoZm91bmRSYXRpbmcpIHtcclxuICAgICAgICAvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgLy9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcclxuICAgICAgICBsZXQgcmF0aW5nT2JqO1xyXG4gICAgICAgIGlmIChyZXEuYm9keS5yYXRpbmcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xyXG4gICAgICAgICAgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxyXG4gICAgICAgICAgLnNhdmUocmF0aW5nT2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XHJcbiAgICAgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcclxuICAgICAgICAgIHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXHJcbiAgICAgICAgICB1c2VyaWQ6IHVzZXJpZCxcclxuICAgICAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxyXG4gICAgICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihuZXdSYXRpbmcgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JhdGluZyBjcmVhdGVkOicsIG5ld1JhdGluZy5hdHRyaWJ1dGVzKTtcclxuICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdyYXRpbmcgcmVjaWV2ZWQnKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ2Vycm9yJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2VcclxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxudmFyIGFkZE9uZU1vdmllID0gbW92aWVPYmogPT4ge1xyXG4gIGxldCBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcclxuICByZXR1cm4gbmV3IE1vdmllKHtcclxuICAgIGlkOiBtb3ZpZU9iai5pZCxcclxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcclxuICAgIGdlbnJlOiBnZW5yZSxcclxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxyXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXHJcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcclxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxyXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxyXG4gIC50aGVuKG5ld01vdmllID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XHJcbiAgICByZXR1cm4gbmV3TW92aWU7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAncHJvYmxlbSBjcmVhdGluZyBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXHJcbi8vc2hvdWxkIHJldHVybiBhbiBhcnJheSB0aGF0IGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxyXG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxyXG5cclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gICAgcWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xyXG4gICAgICByZXR1cm4gYXR0YWNoVXNlclJhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgYXZlcmFnZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyBmcmllbmQgYXZnIHJhdGluZyB0byB0aGUgcmF0aW5nIG9ialxyXG5jb25zdCBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcbiAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICAvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxyXG4gICAgaWYgKCFmcmllbmRzUmF0aW5ncykge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmc7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoVXNlclJhdGluZyA9IChyYXRpbmcsIHVzZXJuYW1lKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsXHJcbiAgICAgICdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHVzZXJSYXRpbmcgPT4ge1xyXG4gICAgaWYgKHVzZXJSYXRpbmcpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyBjYW5ub3QgZmluZCB1c2VyIHJhdGluZycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xyXG4gIGdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxyXG4gIC50aGVuKGZyaWVuZFJhdGluZ3MgPT4ge1xyXG4gICAgcmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBmcmllbmQgcmF0aW5ncyBmb3IgdGhlIG1vdmllJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5jb25zdCBnZXRGcmllbmRSYXRpbmdzID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBVc2VyLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXHJcbiAgICAgICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogbW92aWVPYmouYXR0cmlidXRlcy5pZCB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gIC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnJpZW5kUmF0aW5nID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmcmllbmQgPT4ge1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiBmcmllbmRSYXRpbmc7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICByZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xyXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xyXG5jb25zdCBhdmVyYWdlUmF0aW5nID0gKHJhdGluZ3MpID0+IHtcclxuICAvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXHJcbiAgaWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XHJcbiAgcmV0dXJuIHJhdGluZ3MucmVkdWNlKCh0b3RhbCwgcmF0aW5nKSA9PiB0b3RhbCArIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlLCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59O1xyXG5cclxuXHJcbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxyXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cclxuY29uc3QgZ2V0T25lTW92aWVSYXRpbmcgPSAodXNlcm5hbWUsIG1vdmllT2JqKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcclxuICB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4ocmF0aW5nID0+IHtcclxuICAgIGlmICghcmF0aW5nKSB7XHJcbiAgICAgIC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcclxuICAgICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKG1vdmllID0+IHtcclxuICAgICAgICBtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gbW92aWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH1cclxuICB9KVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICByZXR1cm4gZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG4gICAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgICAgY29uc29sZS5sb2coJ2FkZGVkIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZycsIHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLCByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nKTtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cmlldmUgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqIHdpdGggdGhlc2UgYXR0cmlidXRlczoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xyXG4gIFByb21pc2UubWFwKHJlcS5ib2R5Lm1vdmllcywgbW92aWUgPT4ge1xyXG4gICAgLy9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxyXG4gICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllLnRpdGxlLCBpZDogbW92aWUuaWR9KS5mZXRjaCgpXHJcbiAgICAudGhlbihmb3VuZE1vdmllID0+IHtcclxuICAgICAgLy9pZiBub3QgY3JlYXRlIG9uZVxyXG4gICAgICBpZiAoIWZvdW5kTW92aWUpIHtcclxuICAgICAgICByZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmb3VuZE1vdmllO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PntcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZvdW5kIG1vdmllJywgZm91bmRNb3ZpZSk7XHJcbiAgICAgIHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyciwgJ2Nhbm5vdCBhZGQgbW92aWUnKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIHJhdGluZyB0byBjbGllbnQnKTtcclxuICAgIHJlcy5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgZ2V0IG1vdmllJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcclxuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xyXG5leHBvcnRzLmdldFJlY2VudFJlbGVhc2UgPSAocmVxLCByZXMpID0+IHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcbiAgbGV0IGRhdGEgPSAnJztcclxuICByZXF1ZXN0KHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL2Rpc2NvdmVyL21vdmllLycsXHJcbiAgICBxczogcGFyYW1zXHJcbiAgfSlcclxuICAub24oJ2RhdGEnLCBjaHVuayA9PiB7XHJcbiAgICBkYXRhICs9IGNodW5rO1xyXG4gIH0pXHJcbiAgLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICByZXEuYm9keS5tb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpLnJlc3VsdHM7XHJcbiAgICAvL3RyYW5zZmVycyB0aGUgbW92aWUgZGF0YSB0byBnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyB0byBkZWNvcmF0ZSB3aXRoIHNjb3JlICh1c2VyIHJhdGluZykgYW5kIGF2Z2ZyaWVuZFJhdGluZyBhdHRyaWJ1dGVcclxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xyXG5cclxuICB9KVxyXG4gIC5vbignZXJyb3InLCBlcnJvciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvciwgJ1RoZU1vdmllREIgZG9lcyBub3QgcmVzcG9uZCcpO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXHJcbmNvbnN0IGdlbnJlcyA9IHtcclxuICAgMTI6ICdBZHZlbnR1cmUnLFxyXG4gICAxNDogJ0ZhbnRhc3knLFxyXG4gICAxNjogJ0FuaW1hdGlvbicsXHJcbiAgIDE4OiAnRHJhbWEnLFxyXG4gICAyNzogJ0hvcnJvcicsXHJcbiAgIDI4OiAnQWN0aW9uJyxcclxuICAgMzU6ICdDb21lZHknLFxyXG4gICAzNjogJ0hpc3RvcnknLFxyXG4gICAzNzogJ1dlc3Rlcm4nLFxyXG4gICA1MzogJ1RocmlsbGVyJyxcclxuICAgODA6ICdDcmltZScsXHJcbiAgIDk5OiAnRG9jdW1lbnRhcnknLFxyXG4gICA4Nzg6ICdTY2llbmNlIEZpY3Rpb24nLFxyXG4gICA5NjQ4OiAnTXlzdGVyeScsXHJcbiAgIDEwNDAyOiAnTXVzaWMnLFxyXG4gICAxMDc0OTogJ1JvbWFuY2UnLFxyXG4gICAxMDc1MTogJ0ZhbWlseScsXHJcbiAgIDEwNzUyOiAnV2FyJyxcclxuICAgMTA3Njk6ICdGb3JlaWduJyxcclxuICAgMTA3NzA6ICdUViBNb3ZpZSdcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYCk7XHJcbiAgICBxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4obWF0Y2hlcyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgICByZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHNlYXJjaCBEQicpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBzZWFyY2gnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSZWxhdGlvbi5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG4gICAgICByZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuICAgICAgICByZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XHJcbiAgICByZXMuanNvbihmcmllbmRzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGVvcGxlSWQgPSBbXTtcclxuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRGcmllbmRzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcclxuICAgIFxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBwZW9wbGUgPSBbXVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcclxuICAgICAgICAgIHZhciBrZXlJZD17fTtcclxuICAgICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG5cclxuICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdXNlcm5hbWUgRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8nLCBhLCBmdW5jdGlvbihlcnIsIHJlc3BvKSB7XHJcbiAgICAgICAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICByZT1be3VzZXJpZDphLG1vdmllaWQ6TWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKSxzY29yZTo5OX1dXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGVvcGxlLnB1c2gocmUubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZmluYWwgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHZlcnlGaW5hbD1bXTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH0pO1xyXG59O1xyXG5cclxuIl19