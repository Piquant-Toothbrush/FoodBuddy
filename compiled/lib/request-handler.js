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
    g.query('Select * FROM allrequests WHERE requestee=' + '"' + e + '"' + '' + 'OR requestor =' + '"' + e + '"' + '', function (h, j) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwidXNlcm5hbWUiLCJib2R5IiwibmFtZSIsImZldGNoIiwidGhlbiIsImZvdW5kIiwic3RhdHVzIiwic2VuZCIsIm15U2Vzc2lvbiIsImNyZWF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJyZXNwb25zZSIsInJlcXVlc3RlZXMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWUiLCJlYWNoIiwicmVxdWVzdG9yIiwicmVxdWVzdFR5cCIsIm1vdmllIiwibWVzc2FnZSIsImNhdGNoIiwianNvbiIsImVycm9yIiwiZGF0YSIsImVyciIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwidGhlUmVxdWVzdCIsImRlc3Ryb3kiLCJzZW5kUmVxdWVzdCIsIm5ld1JlcXVlc3QiLCJnZXRDb25uZWN0aW9uIiwiY29uIiwicXVlcnkiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwicGVyc29uMSIsImlkIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJwZXJzb24iLCJzcGVjaWZpY0ZyaWVuZCIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUM1QixNQUFNQyxJQUFPQyxLQUFLQyxHQUFMLENBQVNKLElBQU9DLENBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLENBQVg7QUFDQSxDQUhEO0FBQUEsSUFLTUcsT0FBTyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBUUMsQ0FBUixFQUFrQjtBQUMvQixNQUFNQyxJQUFRLEVBQWQ7QUFDRSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBTUksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDOztBQUVyQyxTQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUosRUFBT0csTUFBM0IsRUFBbUNDLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJTCxFQUFNRyxDQUFOLEVBQVMsQ0FBVCxN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RDs7QUFFRCxzQkFBSXlGLElBQVUsRUFBZDtBQUNBLHVCQUFLLElBQUl6RixDQUFULElBQWdCRCxDQUFoQixFQUE0QjtBQUMxQjBGLHNCQUFVN0wsSUFBVixDQUFlLENBQUNvRyxDQUFELEVBQUtELEVBQVlDLENBQVosQ0FBTCxDQUFmO0FBQ0Q7O0FBRUR4RSxvQkFBSVEsSUFBSixDQUFTeUosQ0FBVDtBQUNBL0gsb0JBQUlNLE9BQUo7QUFDRDtBQUNGLGVBeENEO0FBeUNELGFBNUNEO0FBNkNELFdBL0NEO0FBZ0RELFNBekREO0FBMERELE9BN0REO0FBOERELEtBbEVEO0FBbUVELEdBckVEO0FBc0VELENBekVEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmNvbnN0IGhlbHBlciA9IChudW0xLG51bTIpPT57XHJcbmNvbnN0IGRpZmYgPSBNYXRoLmFicyhudW0xIC0gbnVtMik7XHJcbiByZXR1cm4gNSAtIGRpZmY7XHJcbn07XHJcblxyXG5jb25zdCBjb21wID0gKGZpcnN0LCBzZWNvbmQpPT4ge1xyXG5jb25zdCBmaW5hbCA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3QubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xyXG5cclxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcclxuXHJcbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKTtcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5jb25zdCBzdW0gPSBmaW5hbC5yZWR1Y2UoKGEsYikgPT4gYSArIGIsIDApO1xyXG4gIHJldHVybiBNYXRoLnJvdW5kKDIwICogc3VtIC8gZmluYWwubGVuZ3RoKTtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbmNvbnN0IG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxuY29uc3QgTW92aWUgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL21vdmllJyk7XHJcbmNvbnN0IFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbmNvbnN0IFJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yZWxhdGlvbicpO1xyXG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy91c2VyJyk7XHJcbmNvbnN0IGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbi8vIHZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbmNvbnN0IFJhdGluZ3MgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmF0aW5ncycpO1xyXG4vLyB2YXIgUmVsYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JlbGF0aW9ucycpO1xyXG5jb25zdCBVc2VycyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy91c2VycycpO1xyXG52YXIgYWxsUmVxdWVzdHMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvYWxsUmVxdWVzdHMnKTtcclxuXHJcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuY29uc3QgcG9vbCAgPSBteXNxbC5jcmVhdGVQb29sKHtcclxuICBjb25uZWN0aW9uTGltaXQgOiA0LFxyXG4gIGhvc3Q6IFwidXMtY2Rici1pcm9uLWVhc3QtMDQuY2xlYXJkYi5uZXRcIixcclxuICB1c2VyOiAnYjZlNzI2NTllNGY2MmUnLFxyXG4gIHBhc3N3b3JkOiAgJzRiNzVkNDNmJyxcclxuICBkYXRhYmFzZTogJ2hlcm9rdV84NzQzNTIxYWU2OGQ1ODMnXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PntcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKTtcclxuICBsZXQgcmVxdWVzdGVlcztcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCByZXF1ZXN0ZWUgPT4ge1xyXG4gICAgYWxsUmVxdWVzdHMuY3JlYXRlKHtcclxuICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgIHJlcXVlc3RlZTogcmVxdWVzdGVlLFxyXG4gICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICBtb3ZpZTogcmVxLmJvZHkubW92aWUsXHJcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2VcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZG9uZSA9PiB7XHJcbiAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4odGhlUmVxdWVzdCA9PiB7XHJcbiAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcclxuICBsZXQgbmV3UmVxdWVzdDtcclxuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyID09PSByZXEuYm9keS5uYW1lKSB7XHJcbiAgICByZXNwb25zZS5zZW5kKFtcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCJdKTtcclxuICB9IGVsc2Uge1xyXG4gICAgICBuZXdSZXF1ZXN0ID0ge1xyXG4gICAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICByZXF1ZXN0VHlwOiAnZnJpZW5kJ1xyXG4gICAgICB9O1xyXG5cclxuICAgIHBvb2wuZ2V0Q29ubmVjdGlvbihmdW5jdGlvbihlcnIsIGNvbikge1xyXG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ3NlbmRSZXF1ZXN0Jyk7IHRocm93IGVycjsgfVxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUsIHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicscmVxLm15U2Vzc2lvbi51c2VyLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgIGlmICghcmVzKSB7XHJcbiAgICAgICAgICByZXNwb25zZS5zZW5kKFsnbm8gZnJpZW5kcyddKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlciggYSA9PiBhLnJlc3BvbnNlID09PSBudWxsKTtcclxuICAgICAgICB2YXIgcmVxdWVzdGVlcyA9IHBwbFJlcWQubWFwKCBhID0+IGEucmVxdWVzdGVlICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgbmV3UmVxdWVzdCwgKGVyciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdGVlcyk7XHJcbiAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuY29uc29sZS5sb2coJ3JlcXVlc3RlZScsIHJlcXVlc3RlZSk7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdsaXN0UmVxdWVzdHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnICsgJ09SIHJlcXVlc3RvciA9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhbGwgdGhlIHBlb3BsZScscmVzKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChbcmVzLCByZXF1ZXN0ZWVdKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG5cclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2FjY2VwdCcpOyB0aHJvdyBlcnI7IH1cclxuICAgIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInK3JlcXVlc3RUeXBlKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RvciwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xyXG4gICAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0ZWUsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMixcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSAocmVxLCByZXMpID0+e1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcclxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24odGhlUmVxdWVzdCkge1xyXG4gICAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICB2YXIgbW92aWVzID0gW107XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xyXG4gIHZhciBwZXJzb24gPSByZXEuYm9keS5zcGVjaWZpY0ZyaWVuZDtcclxuICB2YXIgaWQgPSBudWxsO1xyXG4gIHZhciBsZW4gPSBudWxsO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coaWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJycnJycnJycicsIGVyciwgcmVzcC5sZW5ndGgpO1xyXG4gICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZW4gPSByZXNwLmxlbmd0aDtcclxuICAgICAgICByZXNwLmZvckVhY2goYSA9PiB7XHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgICAgICBtb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSwgYS5zY29yZSwgYS5yZXZpZXddKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWVzKTtcclxuICAgICAgICAgICAgaWYgKG1vdmllcy5sZW5ndGggPT09IGxlbikge1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcclxuICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2ZpbmRNb3ZpZUJ1ZGRpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgdmFyIHBlb3BsZSA9IHJlc3AubWFwKGEgPT4gYS51c2VybmFtZSk7XHJcbiAgICAgIHZhciBJZHMgPSByZXNwLm1hcChhID0+IGEuaWQpO1xyXG4gICAgICB2YXIgaWRLZXlPYmogPSB7fTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZEtleU9ialtJZHNbaV1dID0gcGVvcGxlW2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLCBjdXJyZW50VXNlcik7XHJcblxyXG4gICAgICB2YXIgb2JqMSA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG9iajFbaWRLZXlPYmpbSWRzW2ldXV0gPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJywgKGVyciwgcmVzcG9uKT0+IHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLCByZXNwb25baV0uc2NvcmVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmoxJywgb2JqMSk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VySW5mbyA9IG9iajFbY3VycmVudFVzZXJdO1xyXG5cclxuICAgICAgICB2YXIgY29tcGFyaXNvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iajEpIHtcclxuICAgICAgICAgIGlmIChrZXkgIT09IGN1cnJlbnRVc2VyKSB7XHJcbiAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV0gPSBjb21wKGN1cnJlbnRVc2VySW5mbywgb2JqMVtrZXldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgIHZhciBmaW5hbFNlbmQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpIHtcclxuICAgICAgICAgIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgY29tcGFyaXNvbnNba2V5XV0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgJ05vIENvbXBhcmlzb24gdG8gTWFrZSddKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpO1xyXG4gICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5kZWNsaW5lID0gZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XHJcbiAgdmFyIGFkZE9uPSFtb3ZpZT8nIEFORCByZXF1ZXN0VHlwPScrJ1wiJysgcmVxdWVzdFR5cGUrJ1wiJzonIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIic7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdkZWNsaW5lJyk7IHRocm93IGVycjsgfSAgICBcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInK2FkZE9uLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xyXG4gICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PiB7XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ3VzZXIgY2Fubm90IGJlIGNyZWF0ZWQnfX0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kPT57XHJcbiAgICBpZiAoZm91bmQpe1xyXG4gICAgICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbih1c2VyPT57XHJcbiAgICAgICAgaWYgKHVzZXIpe1xyXG4gICAgICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gdXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZvdW5kICcsIGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnd3JvbmcgcGFzc3dvcmQnKTtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICBjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcclxuICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coJ2xvZ291dCcpO1xyXG4gIHJlcy5zZW5kKCdsb2dvdXQnKTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9tb3ZpZSBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxyXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XHJcbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcclxuICBsZXQgdXNlcmlkO1xyXG4gIHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxyXG4gIC50aGVuKGZvdW5kVXNlciA9PiB7XHJcbiAgICB1c2VyaWQgPSBmb3VuZFVzZXIuYXR0cmlidXRlcy5pZDtcclxuICAgIHJldHVybiBuZXcgUmF0aW5nKHsgbW92aWVpZDogcmVxLmJvZHkuaWQsIHVzZXJpZDogdXNlcmlkIH0pLmZldGNoKClcclxuICAgIC50aGVuKGZvdW5kUmF0aW5nID0+IHtcclxuICAgICAgaWYgKGZvdW5kUmF0aW5nKSB7XHJcbiAgICAgICAgLy9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xyXG4gICAgICAgIC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXHJcbiAgICAgICAgbGV0IHJhdGluZ09iajtcclxuICAgICAgICBpZiAocmVxLmJvZHkucmF0aW5nKSB7XHJcbiAgICAgICAgICByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXEuYm9keS5yZXZpZXcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcclxuICAgICAgICAgIC5zYXZlKHJhdGluZ09iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xyXG4gICAgICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XHJcbiAgICAgICAgICBzY29yZTogcmVxLmJvZHkucmF0aW5nLFxyXG4gICAgICAgICAgdXNlcmlkOiB1c2VyaWQsXHJcbiAgICAgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcclxuICAgICAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4obmV3UmF0aW5nID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdlcnJvcicpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXHJcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoZXNlIGF0cmlidXRlIDoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbnZhciBhZGRPbmVNb3ZpZSA9IG1vdmllT2JqID0+IHtcclxuICBsZXQgZ2VucmUgPSAobW92aWVPYmouZ2VucmVfaWRzKSA/IGdlbnJlc1ttb3ZpZU9iai5nZW5yZV9pZHNbMF1dIDogJ24vYSc7XHJcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XHJcbiAgICBpZDogbW92aWVPYmouaWQsXHJcbiAgICB0aXRsZTogbW92aWVPYmoudGl0bGUsXHJcbiAgICBnZW5yZTogZ2VucmUsXHJcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcclxuICAgIHJlbGVhc2VfZGF0ZTogbW92aWVPYmoucmVsZWFzZV9kYXRlLFxyXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXHJcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcclxuICB9KS5zYXZlKG51bGwsIHttZXRob2Q6ICdpbnNlcnQnfSlcclxuICAudGhlbihuZXdNb3ZpZSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gICAgcmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJ3Byb2JsZW0gY3JlYXRpbmcgbW92aWUnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxyXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcclxuLy8gWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcclxuXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgICBxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcbiAgICAgIHJldHVybiBhdHRhY2hGcmllbmRBdmdSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldEZyaWVuZFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgLy9kZWNvcmF0ZSBpdCB3aXRoIGN1cnJlbnQgdXNlcidzIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBhdmVyYWdlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xyXG4gIHJldHVybiBnZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgLy9pZiBmcmllbmRzUmF0aW5ncyBpcyBudWxsLCBSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nIGlzIG51bGxcclxuICAgIGlmICghZnJpZW5kc1JhdGluZ3MpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXHJcbmNvbnN0IGF0dGFjaFVzZXJSYXRpbmcgPSAocmF0aW5nLCB1c2VybmFtZSkgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdtb3ZpZXMuaWQnLCAnPScsICdyYXRpbmdzLm1vdmllaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuICAgICAgJ21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbih1c2VyUmF0aW5nID0+IHtcclxuICAgIGlmICh1c2VyUmF0aW5nKSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZztcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgY2Fubm90IGZpbmQgdXNlciByYXRpbmcnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBpcyBhIHdyYXBlciBmdW5jdGlvbiBmb3IgZ2V0RnJpZW5kUmF0aW5ncyB3aGljaCB3aWxsIHNlbnQgdGhlIGNsaWVudCBhbGwgb2YgdGhlIGZyaWVuZCByYXRpbmdzXHJcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcclxuICBnZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuICAudGhlbihmcmllbmRSYXRpbmdzID0+IHtcclxuICAgIHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgZnJpZW5kIHJhdGluZ3MgZm9yIHRoZSBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIG91dHB1dHMgcmF0aW5ncyBvZiBhIHVzZXIncyBmcmllbmQgZm9yIGEgcGFydGljdWxhciBtb3ZpZVxyXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XHJcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cclxuY29uc3QgZ2V0RnJpZW5kUmF0aW5ncyA9ICh1c2VybmFtZSwgbW92aWVPYmopID0+IHtcclxuICByZXR1cm4gVXNlci5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcclxuICAgICAgJ21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAvL3RoZSBmb2xsb3dpbmcgYmxvY2sgYWRkcyB0aGUgZnJpZW5kTmFtZSBhdHRyaWJ1dGUgdG8gdGhlIHJhdGluZ3NcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZyaWVuZFJhdGluZyA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcih7IGlkOiBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy51c2VyMmlkIH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnJpZW5kID0+IHtcclxuICAgICAgICBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEZpcnN0TmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLmZpcnN0TmFtZTtcclxuICAgICAgICByZXR1cm4gZnJpZW5kUmF0aW5nO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgcmV0dXJuIGZyaWVuZHNSYXRpbmdzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxuY29uc3QgYXZlcmFnZVJhdGluZyA9IChyYXRpbmdzKSA9PiB7XHJcbiAgLy9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG4gIGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIHJldHVybiByYXRpbmdzLnJlZHVjZSgodG90YWwsIHJhdGluZykgPT4gdG90YWwgKyByYXRpbmcuYXR0cmlidXRlcy5zY29yZSwgMCkgLyByYXRpbmdzLmxlbmd0aDtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgb3V0cHV0cyB1c2VyIHJhdGluZyBhbmQgYXZlcmFnZSBmcmllbmQgcmF0aW5nIGZvciBvbmUgbW92aWVcclxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XHJcbmNvbnN0IGdldE9uZU1vdmllUmF0aW5nID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICBpZiAoIXJhdGluZykge1xyXG4gICAgICAvL2lmIHRoZSB1c2VyIGhhcyBub3QgcmF0ZWQgdGhlIG1vdmllLCByZXR1cm4gYW4gb2JqIHRoYXQgaGFzIHRoZSBtb3ZpZSBpbmZvcm1hdGlvbiwgYnV0IHNjb3JlIGlzIHNldCB0byBudWxsXHJcbiAgICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihtb3ZpZSA9PiB7XHJcbiAgICAgICAgbW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1vdmllO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmcgPT4ge1xyXG4gICAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAgIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaWV2ZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG4vL291dHB1dHMgWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuICBQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIG1vdmllID0+IHtcclxuICAgIC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2VcclxuICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PiB7XHJcbiAgICAgIC8vaWYgbm90IGNyZWF0ZSBvbmVcclxuICAgICAgaWYgKCFmb3VuZE1vdmllKSB7XHJcbiAgICAgICAgcmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZm91bmRNb3ZpZTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC50aGVuKGZvdW5kTW92aWUgPT57XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG4gICAgICByZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgYWRkIG1vdmllJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XHJcbiAgICByZXMuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLCAnY2Fubm90IGdldCBtb3ZpZScpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIGFwaV9rZXk6ICc5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMicsXHJcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxyXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXHJcbiAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJ1xyXG4gIH07XHJcblxyXG4gIGxldCBkYXRhID0gJyc7XHJcbiAgcmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG4gICAgcXM6IHBhcmFtc1xyXG4gIH0pXHJcbiAgLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xyXG4gICAgZGF0YSArPSBjaHVuaztcclxuICB9KVxyXG4gIC5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgcmVxLmJvZHkubW92aWVzID0gSlNPTi5wYXJzZShkYXRhKS5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcbiAgfSlcclxuICAub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IsICdUaGVNb3ZpZURCIGRvZXMgbm90IHJlc3BvbmQnKTtcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG5jb25zdCBnZW5yZXMgPSB7XHJcbiAgIDEyOiAnQWR2ZW50dXJlJyxcclxuICAgMTQ6ICdGYW50YXN5JyxcclxuICAgMTY6ICdBbmltYXRpb24nLFxyXG4gICAxODogJ0RyYW1hJyxcclxuICAgMjc6ICdIb3Jyb3InLFxyXG4gICAyODogJ0FjdGlvbicsXHJcbiAgIDM1OiAnQ29tZWR5JyxcclxuICAgMzY6ICdIaXN0b3J5JyxcclxuICAgMzc6ICdXZXN0ZXJuJyxcclxuICAgNTM6ICdUaHJpbGxlcicsXHJcbiAgIDgwOiAnQ3JpbWUnLFxyXG4gICA5OTogJ0RvY3VtZW50YXJ5JyxcclxuICAgODc4OiAnU2NpZW5jZSBGaWN0aW9uJyxcclxuICAgOTY0ODogJ015c3RlcnknLFxyXG4gICAxMDQwMjogJ011c2ljJyxcclxuICAgMTA3NDk6ICdSb21hbmNlJyxcclxuICAgMTA3NTE6ICdGYW1pbHknLFxyXG4gICAxMDc1MjogJ1dhcicsXHJcbiAgIDEwNzY5OiAnRm9yZWlnbicsXHJcbiAgIDEwNzcwOiAnVFYgTW92aWUnXHJcbiB9O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXHJcbi8vaXQgd2lsbCBzZW5kIGJhY2sgbW92aWUgb2JqcyB0aGF0IG1hdGNoIHRoZSBzZWFyY2ggaW5wdXQsIGV4cGVjdHMgbW92aWUgbmFtZSBpbiByZXEuYm9keS50aXRsZVxyXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZVJhdyhgTUFUQ0ggKG1vdmllcy50aXRsZSkgQUdBSU5TVCAoJyR7cmVxLnF1ZXJ5LnRpdGxlfScgSU4gTkFUVVJBTCBMQU5HVUFHRSBNT0RFKWApO1xyXG4gICAgcWIuYW5kV2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKG1hdGNoZXMgPT4ge1xyXG4gICAgY29uc29sZS5sb2cobWF0Y2hlcy5tb2RlbHMpO1xyXG4gICAgcmVzLmpzb24obWF0Y2hlcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBzZWFyY2ggREInKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gc2VhcmNoJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXR1cm4gUmVsYXRpb24ucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHMgPT4ge1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kVXNlcil7XHJcbiAgICAgICAgcmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG4gICAgcmVzLmpzb24oZnJpZW5kcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHBlb3BsZUlkID0gW107XHJcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0RnJpZW5kcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXHJcbiAgICBcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwZW9wbGVJZC5pbmRleE9mKHJlc3BbaV0udXNlcjJpZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgcGVvcGxlID0gW11cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XHJcbiAgICAgICAgICB2YXIga2V5SWQ9e307XHJcbiAgICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xyXG4gICAgICAgICAgICAgIGtleUlkW2FdPXJlc3BvWzBdLnVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgYScsYSlcclxuICAgICAgICAgICAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcclxuICAgICAgICAgICAgICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgcGVvcGxlJywgcGVvcGxlKTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmFsJyxmaW5hbCx1c2Vyc1JhdGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB2ZXJ5RmluYWw9W107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9KTtcclxufTtcclxuXHJcbiJdfQ==