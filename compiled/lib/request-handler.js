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
    d.send("You can't friend yourself!");
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

      g.query('SELECT requestee, response FROM allrequests WHERE requestor = ? AND requestTyp =' + '"' + 'friend' + '"', e.requestor, function (h, j) {
        if (h) {
          throw h;
        }
        if (!j) {
          d.send('no friends');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwidXNlcm5hbWUiLCJib2R5IiwibmFtZSIsImZldGNoIiwidGhlbiIsImZvdW5kIiwic3RhdHVzIiwic2VuZCIsIm15U2Vzc2lvbiIsImNyZWF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJyZXNwb25zZSIsInJlcXVlc3RlZXMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWUiLCJlYWNoIiwicmVxdWVzdG9yIiwicmVxdWVzdFR5cCIsIm1vdmllIiwibWVzc2FnZSIsImNhdGNoIiwianNvbiIsImVycm9yIiwiZGF0YSIsImVyciIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwidGhlUmVxdWVzdCIsImRlc3Ryb3kiLCJzZW5kUmVxdWVzdCIsIm5ld1JlcXVlc3QiLCJnZXRDb25uZWN0aW9uIiwiY29uIiwicXVlcnkiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwicGVyc29uMSIsImlkIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJwZXJzb24iLCJzcGVjaWZpY0ZyaWVuZCIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUM1QixNQUFNQyxJQUFPQyxLQUFLQyxHQUFMLENBQVNKLElBQU9DLENBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLENBQVg7QUFDQSxDQUhEO0FBQUEsSUFLTUcsT0FBTyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBUUMsQ0FBUixFQUFrQjtBQUMvQixNQUFNQyxJQUFRLEVBQWQ7QUFDRSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBTUksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDOztBQUVyQyxTQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUosRUFBT0csTUFBM0IsRUFBbUNDLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJTCxFQUFNRyxDQUFOLEVBQVMsQ0FBVCxN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QUFJekYsQ0FBVCxJQUFnQkQsQ0FBaEIsRUFBNEI7QUFDMUIwRixzQkFBVTdMLElBQVYsQ0FBZSxDQUFDb0csQ0FBRCxFQUFLRCxFQUFZQyxDQUFaLENBQUwsQ0FBZjtBQUNEOztBQUVEeEUsb0JBQUlRLElBQUosQ0FBU3lKLENBQVQ7QUFDQS9ILG9CQUFJTSxPQUFKO0FBQ0Q7QUFDRixlQXhDRDtBQXlDRCxhQTVDRDtBQTZDRCxXQS9DRDtBQWdERCxTQXpERDtBQTBERCxPQTdERDtBQThERCxLQWxFRDtBQW1FRCxHQXJFRDtBQXNFRCxDQXpFRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbi8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBoZWxwZXIgPSAobnVtMSxudW0yKT0+e1xyXG5jb25zdCBkaWZmID0gTWF0aC5hYnMobnVtMSAtIG51bTIpO1xyXG4gcmV0dXJuIDUgLSBkaWZmO1xyXG59O1xyXG5cclxuY29uc3QgY29tcCA9IChmaXJzdCwgc2Vjb25kKT0+IHtcclxuY29uc3QgZmluYWwgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XHJcblxyXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuY29uc3Qgc3VtID0gZmluYWwucmVkdWNlKChhLGIpID0+IGEgKyBiLCAwKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCgyMCAqIHN1bSAvIGZpbmFsLmxlbmd0aCk7XHJcbn07XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5jb25zdCBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XHJcbmNvbnN0IE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xyXG5jb25zdCBSYXRpbmcgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JhdGluZycpO1xyXG5jb25zdCBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xyXG5jb25zdCBhbGxSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9hbGxSZXF1ZXN0Jyk7XHJcblxyXG4vLyB2YXIgTW92aWVzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL21vdmllcycpO1xyXG5jb25zdCBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxuLy8gdmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxuY29uc3QgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcclxudmFyIGFsbFJlcXVlc3RzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL2FsbFJlcXVlc3RzJyk7XHJcblxyXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuXHJcbmNvbnN0IHBvb2wgID0gbXlzcWwuY3JlYXRlUG9vbCh7XHJcbiAgY29ubmVjdGlvbkxpbWl0IDogNCxcclxuICBob3N0OiBcInVzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0XCIsXHJcbiAgdXNlcjogJ2I2ZTcyNjU5ZTRmNjJlJyxcclxuICBwYXNzd29yZDogICc0Yjc1ZDQzZicsXHJcbiAgZGF0YWJhc2U6ICdoZXJva3VfODc0MzUyMWFlNjhkNTgzJ1xyXG59KTtcclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vL3VzZXIgYXV0aFxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQgPT57XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kV2F0Y2hSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSk7XHJcbiAgbGV0IHJlcXVlc3RlZXM7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICBQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgcmVxdWVzdGVlID0+IHtcclxuICAgIGFsbFJlcXVlc3RzLmNyZWF0ZSh7XHJcbiAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICByZXF1ZXN0ZWU6IHJlcXVlc3RlZSxcclxuICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcclxuICAgICAgbW92aWU6IHJlcS5ib2R5Lm1vdmllLFxyXG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGRvbmUgPT4ge1xyXG4gICAgcmVzcG9uc2Uuc2VuZCgnU3VjY2VzcycpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHRoZVJlcXVlc3QgPT4ge1xyXG4gICAgdGhlUmVxdWVzdC5kZXN0cm95KClcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChyZXEsIHJlc3BvbnNlKT0+IHtcclxuICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEltIGdldHRpbmcnLCByZXEuYm9keSk7XHJcbiAgbGV0IG5ld1JlcXVlc3Q7XHJcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlciA9PT0gcmVxLmJvZHkubmFtZSkge1xyXG4gICAgcmVzcG9uc2Uuc2VuZChcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIG5ld1JlcXVlc3QgPSB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgICAgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHJlcXVlc3RUeXA6ICdmcmllbmQnXHJcbiAgICAgIH07XHJcblxyXG4gICAgcG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uKGVyciwgY29uKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnc2VuZFJlcXVlc3QnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdTRUxFQ1QgcmVxdWVzdGVlLHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdG9yID0nICsgbmV3UmVxdWVzdFsncmVxdWVzdG9yJ10gKyAnIEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJyk7XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSwgcmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nICsgJ1wiJyArICdmcmllbmQnICsgJ1wiJywgbmV3UmVxdWVzdFsncmVxdWVzdG9yJ10sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgaWYgKCFyZXMpIHtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlciggYSA9PiBhLnJlc3BvbnNlID09PSBudWxsKTtcclxuICAgICAgICB2YXIgcmVxdWVzdGVlcyA9IHBwbFJlcWQubWFwKCBhID0+IGEucmVxdWVzdGVlICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgbmV3UmVxdWVzdCwgKGVyciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdGVlcyk7XHJcbiAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuY29uc29sZS5sb2coJ3JlcXVlc3RlZScsIHJlcXVlc3RlZSk7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdsaXN0UmVxdWVzdHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnICsgJ09SIHJlcXVlc3RvciA9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhbGwgdGhlIHBlb3BsZScscmVzKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChbcmVzLCByZXF1ZXN0ZWVdKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG5cclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2FjY2VwdCcpOyB0aHJvdyBlcnI7IH1cclxuICAgIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInK3JlcXVlc3RUeXBlKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RvciwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xyXG4gICAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0ZWUsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgICAgdXNlcjFpZDogcGVyc29uMixcclxuICAgICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSAocmVxLCByZXMpID0+e1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcclxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24odGhlUmVxdWVzdCkge1xyXG4gICAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICB2YXIgbW92aWVzID0gW107XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xyXG4gIHZhciBwZXJzb24gPSByZXEuYm9keS5zcGVjaWZpY0ZyaWVuZDtcclxuICB2YXIgaWQgPSBudWxsO1xyXG4gIHZhciBsZW4gPSBudWxsO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coaWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJycnJycnJycicsIGVyciwgcmVzcC5sZW5ndGgpO1xyXG4gICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZW4gPSByZXNwLmxlbmd0aDtcclxuICAgICAgICByZXNwLmZvckVhY2goYSA9PiB7XHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgICAgICBtb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSwgYS5zY29yZSwgYS5yZXZpZXddKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobW92aWVzKTtcclxuICAgICAgICAgICAgaWYgKG1vdmllcy5sZW5ndGggPT09IGxlbikge1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcclxuICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2ZpbmRNb3ZpZUJ1ZGRpZXMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgdmFyIHBlb3BsZSA9IHJlc3AubWFwKGEgPT4gYS51c2VybmFtZSk7XHJcbiAgICAgIHZhciBJZHMgPSByZXNwLm1hcChhID0+IGEuaWQpO1xyXG4gICAgICB2YXIgaWRLZXlPYmogPSB7fTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZEtleU9ialtJZHNbaV1dID0gcGVvcGxlW2ldO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLCBjdXJyZW50VXNlcik7XHJcblxyXG4gICAgICB2YXIgb2JqMSA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG9iajFbaWRLZXlPYmpbSWRzW2ldXV0gPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJywgKGVyciwgcmVzcG9uKT0+IHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLCByZXNwb25baV0uc2NvcmVdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvYmoxJywgb2JqMSk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VySW5mbyA9IG9iajFbY3VycmVudFVzZXJdO1xyXG5cclxuICAgICAgICB2YXIgY29tcGFyaXNvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iajEpIHtcclxuICAgICAgICAgIGlmIChrZXkgIT09IGN1cnJlbnRVc2VyKSB7XHJcbiAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV0gPSBjb21wKGN1cnJlbnRVc2VySW5mbywgb2JqMVtrZXldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgIHZhciBmaW5hbFNlbmQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpIHtcclxuICAgICAgICAgIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgY29tcGFyaXNvbnNba2V5XV0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgJ05vIENvbXBhcmlzb24gdG8gTWFrZSddKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpO1xyXG4gICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5kZWNsaW5lID0gZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XHJcbiAgdmFyIGFkZE9uPSFtb3ZpZT8nIEFORCByZXF1ZXN0VHlwPScrJ1wiJysgcmVxdWVzdFR5cGUrJ1wiJzonIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIic7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdkZWNsaW5lJyk7IHRocm93IGVycjsgfSAgICBcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInK2FkZE9uLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xyXG4gICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PiB7XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ3VzZXIgY2Fubm90IGJlIGNyZWF0ZWQnfX0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kPT57XHJcbiAgICBpZiAoZm91bmQpe1xyXG4gICAgICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbih1c2VyPT57XHJcbiAgICAgICAgaWYgKHVzZXIpe1xyXG4gICAgICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gdXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZvdW5kICcsIGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnd3JvbmcgcGFzc3dvcmQnKTtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICBjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcclxuICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coJ2xvZ291dCcpO1xyXG4gIHJlcy5zZW5kKCdsb2dvdXQnKTtcclxufTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9tb3ZpZSBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxyXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XHJcbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcclxuICBsZXQgdXNlcmlkO1xyXG4gIHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxyXG4gIC50aGVuKGZvdW5kVXNlciA9PiB7XHJcbiAgICB1c2VyaWQgPSBmb3VuZFVzZXIuYXR0cmlidXRlcy5pZDtcclxuICAgIHJldHVybiBuZXcgUmF0aW5nKHsgbW92aWVpZDogcmVxLmJvZHkuaWQsIHVzZXJpZDogdXNlcmlkIH0pLmZldGNoKClcclxuICAgIC50aGVuKGZvdW5kUmF0aW5nID0+IHtcclxuICAgICAgaWYgKGZvdW5kUmF0aW5nKSB7XHJcbiAgICAgICAgLy9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xyXG4gICAgICAgIC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXHJcbiAgICAgICAgbGV0IHJhdGluZ09iajtcclxuICAgICAgICBpZiAocmVxLmJvZHkucmF0aW5nKSB7XHJcbiAgICAgICAgICByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXEuYm9keS5yZXZpZXcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcclxuICAgICAgICAgIC5zYXZlKHJhdGluZ09iaik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xyXG4gICAgICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XHJcbiAgICAgICAgICBzY29yZTogcmVxLmJvZHkucmF0aW5nLFxyXG4gICAgICAgICAgdXNlcmlkOiB1c2VyaWQsXHJcbiAgICAgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcclxuICAgICAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4obmV3UmF0aW5nID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdlcnJvcicpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXHJcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoZXNlIGF0cmlidXRlIDoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbnZhciBhZGRPbmVNb3ZpZSA9IG1vdmllT2JqID0+IHtcclxuICBsZXQgZ2VucmUgPSAobW92aWVPYmouZ2VucmVfaWRzKSA/IGdlbnJlc1ttb3ZpZU9iai5nZW5yZV9pZHNbMF1dIDogJ24vYSc7XHJcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XHJcbiAgICBpZDogbW92aWVPYmouaWQsXHJcbiAgICB0aXRsZTogbW92aWVPYmoudGl0bGUsXHJcbiAgICBnZW5yZTogZ2VucmUsXHJcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcclxuICAgIHJlbGVhc2VfZGF0ZTogbW92aWVPYmoucmVsZWFzZV9kYXRlLFxyXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXHJcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcclxuICB9KS5zYXZlKG51bGwsIHttZXRob2Q6ICdpbnNlcnQnfSlcclxuICAudGhlbihuZXdNb3ZpZSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gICAgcmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJ3Byb2JsZW0gY3JlYXRpbmcgbW92aWUnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxyXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcclxuLy8gWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcclxuXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgICBxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcbiAgICAgIHJldHVybiBhdHRhY2hGcmllbmRBdmdSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldEZyaWVuZFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgLy9kZWNvcmF0ZSBpdCB3aXRoIGN1cnJlbnQgdXNlcidzIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBhdmVyYWdlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xyXG4gIHJldHVybiBnZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgLy9pZiBmcmllbmRzUmF0aW5ncyBpcyBudWxsLCBSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nIGlzIG51bGxcclxuICAgIGlmICghZnJpZW5kc1JhdGluZ3MpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXHJcbmNvbnN0IGF0dGFjaFVzZXJSYXRpbmcgPSAocmF0aW5nLCB1c2VybmFtZSkgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdtb3ZpZXMuaWQnLCAnPScsICdyYXRpbmdzLm1vdmllaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuICAgICAgJ21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbih1c2VyUmF0aW5nID0+IHtcclxuICAgIGlmICh1c2VyUmF0aW5nKSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZztcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgY2Fubm90IGZpbmQgdXNlciByYXRpbmcnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBpcyBhIHdyYXBlciBmdW5jdGlvbiBmb3IgZ2V0RnJpZW5kUmF0aW5ncyB3aGljaCB3aWxsIHNlbnQgdGhlIGNsaWVudCBhbGwgb2YgdGhlIGZyaWVuZCByYXRpbmdzXHJcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcclxuICBnZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuICAudGhlbihmcmllbmRSYXRpbmdzID0+IHtcclxuICAgIHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgZnJpZW5kIHJhdGluZ3MgZm9yIHRoZSBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIG91dHB1dHMgcmF0aW5ncyBvZiBhIHVzZXIncyBmcmllbmQgZm9yIGEgcGFydGljdWxhciBtb3ZpZVxyXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XHJcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cclxuY29uc3QgZ2V0RnJpZW5kUmF0aW5ncyA9ICh1c2VybmFtZSwgbW92aWVPYmopID0+IHtcclxuICByZXR1cm4gVXNlci5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcclxuICAgICAgJ21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAvL3RoZSBmb2xsb3dpbmcgYmxvY2sgYWRkcyB0aGUgZnJpZW5kTmFtZSBhdHRyaWJ1dGUgdG8gdGhlIHJhdGluZ3NcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZyaWVuZFJhdGluZyA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcih7IGlkOiBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy51c2VyMmlkIH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnJpZW5kID0+IHtcclxuICAgICAgICBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEZpcnN0TmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLmZpcnN0TmFtZTtcclxuICAgICAgICByZXR1cm4gZnJpZW5kUmF0aW5nO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgcmV0dXJuIGZyaWVuZHNSYXRpbmdzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxuY29uc3QgYXZlcmFnZVJhdGluZyA9IChyYXRpbmdzKSA9PiB7XHJcbiAgLy9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG4gIGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIHJldHVybiByYXRpbmdzLnJlZHVjZSgodG90YWwsIHJhdGluZykgPT4gdG90YWwgKyByYXRpbmcuYXR0cmlidXRlcy5zY29yZSwgMCkgLyByYXRpbmdzLmxlbmd0aDtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgb3V0cHV0cyB1c2VyIHJhdGluZyBhbmQgYXZlcmFnZSBmcmllbmQgcmF0aW5nIGZvciBvbmUgbW92aWVcclxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XHJcbmNvbnN0IGdldE9uZU1vdmllUmF0aW5nID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICBpZiAoIXJhdGluZykge1xyXG4gICAgICAvL2lmIHRoZSB1c2VyIGhhcyBub3QgcmF0ZWQgdGhlIG1vdmllLCByZXR1cm4gYW4gb2JqIHRoYXQgaGFzIHRoZSBtb3ZpZSBpbmZvcm1hdGlvbiwgYnV0IHNjb3JlIGlzIHNldCB0byBudWxsXHJcbiAgICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihtb3ZpZSA9PiB7XHJcbiAgICAgICAgbW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1vdmllO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmcgPT4ge1xyXG4gICAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAgIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcbiAgICAgIHJldHVybiByYXRpbmc7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaWV2ZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG4vL291dHB1dHMgWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXHJcbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuICBQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIG1vdmllID0+IHtcclxuICAgIC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2VcclxuICAgIHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PiB7XHJcbiAgICAgIC8vaWYgbm90IGNyZWF0ZSBvbmVcclxuICAgICAgaWYgKCFmb3VuZE1vdmllKSB7XHJcbiAgICAgICAgcmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZm91bmRNb3ZpZTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC50aGVuKGZvdW5kTW92aWUgPT57XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG4gICAgICByZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgYWRkIG1vdmllJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XHJcbiAgICByZXMuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLCAnY2Fubm90IGdldCBtb3ZpZScpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIGFwaV9rZXk6ICc5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMicsXHJcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxyXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXHJcbiAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJ1xyXG4gIH07XHJcblxyXG4gIGxldCBkYXRhID0gJyc7XHJcbiAgcmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG4gICAgcXM6IHBhcmFtc1xyXG4gIH0pXHJcbiAgLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xyXG4gICAgZGF0YSArPSBjaHVuaztcclxuICB9KVxyXG4gIC5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgcmVxLmJvZHkubW92aWVzID0gSlNPTi5wYXJzZShkYXRhKS5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcbiAgfSlcclxuICAub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IsICdUaGVNb3ZpZURCIGRvZXMgbm90IHJlc3BvbmQnKTtcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG5jb25zdCBnZW5yZXMgPSB7XHJcbiAgIDEyOiAnQWR2ZW50dXJlJyxcclxuICAgMTQ6ICdGYW50YXN5JyxcclxuICAgMTY6ICdBbmltYXRpb24nLFxyXG4gICAxODogJ0RyYW1hJyxcclxuICAgMjc6ICdIb3Jyb3InLFxyXG4gICAyODogJ0FjdGlvbicsXHJcbiAgIDM1OiAnQ29tZWR5JyxcclxuICAgMzY6ICdIaXN0b3J5JyxcclxuICAgMzc6ICdXZXN0ZXJuJyxcclxuICAgNTM6ICdUaHJpbGxlcicsXHJcbiAgIDgwOiAnQ3JpbWUnLFxyXG4gICA5OTogJ0RvY3VtZW50YXJ5JyxcclxuICAgODc4OiAnU2NpZW5jZSBGaWN0aW9uJyxcclxuICAgOTY0ODogJ015c3RlcnknLFxyXG4gICAxMDQwMjogJ011c2ljJyxcclxuICAgMTA3NDk6ICdSb21hbmNlJyxcclxuICAgMTA3NTE6ICdGYW1pbHknLFxyXG4gICAxMDc1MjogJ1dhcicsXHJcbiAgIDEwNzY5OiAnRm9yZWlnbicsXHJcbiAgIDEwNzcwOiAnVFYgTW92aWUnXHJcbiB9O1xyXG5cclxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXHJcbi8vaXQgd2lsbCBzZW5kIGJhY2sgbW92aWUgb2JqcyB0aGF0IG1hdGNoIHRoZSBzZWFyY2ggaW5wdXQsIGV4cGVjdHMgbW92aWUgbmFtZSBpbiByZXEuYm9keS50aXRsZVxyXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZVJhdyhgTUFUQ0ggKG1vdmllcy50aXRsZSkgQUdBSU5TVCAoJyR7cmVxLnF1ZXJ5LnRpdGxlfScgSU4gTkFUVVJBTCBMQU5HVUFHRSBNT0RFKWApO1xyXG4gICAgcWIuYW5kV2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKG1hdGNoZXMgPT4ge1xyXG4gICAgY29uc29sZS5sb2cobWF0Y2hlcy5tb2RlbHMpO1xyXG4gICAgcmVzLmpzb24obWF0Y2hlcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBzZWFyY2ggREInKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gc2VhcmNoJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXR1cm4gUmVsYXRpb24ucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKGZyaWVuZHMgPT4ge1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kVXNlcil7XHJcbiAgICAgICAgcmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG4gICAgcmVzLmpzb24oZnJpZW5kcyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBnZXQgZnJpZW5kcycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHBlb3BsZUlkID0gW107XHJcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZ2V0RnJpZW5kcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXHJcbiAgICBcclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XHJcblxyXG4gICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwZW9wbGVJZC5pbmRleE9mKHJlc3BbaV0udXNlcjJpZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgcGVvcGxlID0gW11cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XHJcbiAgICAgICAgICB2YXIga2V5SWQ9e307XHJcbiAgICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xyXG4gICAgICAgICAgICAgIGtleUlkW2FdPXJlc3BvWzBdLnVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgYScsYSlcclxuICAgICAgICAgICAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcclxuICAgICAgICAgICAgICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgcGVvcGxlJywgcGVvcGxlKTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmFsJyxmaW5hbCx1c2Vyc1JhdGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB2ZXJ5RmluYWw9W107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9KTtcclxufTtcclxuXHJcbiJdfQ==