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
      k.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + e + '"' + ' AND requestTyp=' + '"' + h + '"' + ' AND requestee = ' + '"' + f + '"', function (l, m) {
        if (l) throw l;
      });
    } else {
      k.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + e + '"' + ' AND movie=' + '"' + g + '"' + ' AND requestee = ' + '"' + f + '"', function (l, m) {
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
      j = !g ? ' AND requestTyp=' + '"' + h + '"' : ' AND movie =' + '"' + g + '"';

  pool.getConnection(function (k, l) {
    if (k) {
      throw k;
    }
    l.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + e + '"' + ' AND requestee=' + '"' + f + '"' + j, function (m, n) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwidXNlcm5hbWUiLCJib2R5IiwibmFtZSIsImZldGNoIiwidGhlbiIsImZvdW5kIiwic3RhdHVzIiwic2VuZCIsIm15U2Vzc2lvbiIsImNyZWF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJyZXNwb25zZSIsInJlcXVlc3RlZXMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWUiLCJlYWNoIiwicmVxdWVzdG9yIiwicmVxdWVzdFR5cCIsIm1vdmllIiwibWVzc2FnZSIsImNhdGNoIiwianNvbiIsImVycm9yIiwiZGF0YSIsImVyciIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwidGhlUmVxdWVzdCIsImRlc3Ryb3kiLCJzZW5kUmVxdWVzdCIsIm5ld1JlcXVlc3QiLCJnZXRDb25uZWN0aW9uIiwiY29uIiwicXVlcnkiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwicGVyc29uMSIsImlkIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJwZXJzb24iLCJzcGVjaWZpY0ZyaWVuZCIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUM1QixNQUFNQyxJQUFPQyxLQUFLQyxHQUFMLENBQVNKLElBQU9DLENBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLENBQVg7QUFDQSxDQUhEO0FBQUEsSUFLTUcsT0FBTyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBUUMsQ0FBUixFQUFrQjtBQUMvQixNQUFNQyxJQUFRLEVBQWQ7QUFDRSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBTUksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDOztBQUVyQyxTQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUosRUFBT0csTUFBM0IsRUFBbUNDLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJTCxFQUFNRyxDQUFOLEVBQVMsQ0FBVCxN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QUFULElBQWdCeEcsQ0FBaEIsRUFBc0I7QUFDcEJ1RyxzQkFBWUMsQ0FBWixJQUFpQjNHLEtBQUs2TCxDQUFMLEVBQWtCMUwsRUFBTXdHLENBQU4sQ0FBbEIsQ0FBakI7QUFDRDs7QUFFRCxzQkFBSXlGLElBQVUsRUFBZDtBQUNBLHVCQUFLLElBQUl6RixDQUFULElBQWdCRCxDQUFoQixFQUE0QjtBQUMxQjBGLHNCQUFVN0wsSUFBVixDQUFlLENBQUNvRyxDQUFELEVBQUtELEVBQVlDLENBQVosQ0FBTCxDQUFmO0FBQ0Q7O0FBRUR4RSxvQkFBSVEsSUFBSixDQUFTeUosQ0FBVDtBQUNBL0gsb0JBQUlNLE9BQUo7QUFDRDtBQUNGLGVBeENEO0FBeUNELGFBNUNEO0FBNkNELFdBL0NEO0FBZ0RELFNBekREO0FBMERELE9BN0REO0FBOERELEtBbEVEO0FBbUVELEdBckVEO0FBc0VELENBekVEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmNvbnN0IGhlbHBlciA9IChudW0xLG51bTIpPT57XHJcbmNvbnN0IGRpZmYgPSBNYXRoLmFicyhudW0xIC0gbnVtMik7XHJcbiByZXR1cm4gNSAtIGRpZmY7XHJcbn07XHJcblxyXG5jb25zdCBjb21wID0gKGZpcnN0LCBzZWNvbmQpPT4ge1xyXG5jb25zdCBmaW5hbCA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3QubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xyXG5cclxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcclxuXHJcbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKTtcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5jb25zdCBzdW0gPSBmaW5hbC5yZWR1Y2UoKGEsYikgPT4gYSArIGIsIDApO1xyXG4gIHJldHVybiBNYXRoLnJvdW5kKDIwICogc3VtIC8gZmluYWwubGVuZ3RoKTtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbmNvbnN0IG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxuY29uc3QgTW92aWUgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL21vdmllJyk7XHJcbmNvbnN0IFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbmNvbnN0IFJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yZWxhdGlvbicpO1xyXG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy91c2VyJyk7XHJcbmNvbnN0IGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbi8vIHZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbmNvbnN0IFJhdGluZ3MgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmF0aW5ncycpO1xyXG4vLyB2YXIgUmVsYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JlbGF0aW9ucycpO1xyXG5jb25zdCBVc2VycyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy91c2VycycpO1xyXG52YXIgYWxsUmVxdWVzdHMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvYWxsUmVxdWVzdHMnKTtcclxuXHJcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuY29uc3QgcG9vbCAgPSBteXNxbC5jcmVhdGVQb29sKHtcclxuICBjb25uZWN0aW9uTGltaXQgOiA0LFxyXG4gIGhvc3Q6IFwidXMtY2Rici1pcm9uLWVhc3QtMDQuY2xlYXJkYi5uZXRcIixcclxuICB1c2VyOiAnYjZlNzI2NTllNGY2MmUnLFxyXG4gIHBhc3N3b3JkOiAgJzRiNzVkNDNmJyxcclxuICBkYXRhYmFzZTogJ2hlcm9rdV84NzQzNTIxYWU2OGQ1ODMnXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PntcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKTtcclxuICBsZXQgcmVxdWVzdGVlcztcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCByZXF1ZXN0ZWUgPT4ge1xyXG4gICAgYWxsUmVxdWVzdHMuY3JlYXRlKHtcclxuICAgICAgcmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsXHJcbiAgICAgIHJlcXVlc3RlZTogcmVxdWVzdGVlLFxyXG4gICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICBtb3ZpZTogcmVxLmJvZHkubW92aWUsXHJcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2VcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZG9uZSA9PiB7XHJcbiAgICByZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4odGhlUmVxdWVzdCA9PiB7XHJcbiAgICB0aGVSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcclxuICBsZXQgbmV3UmVxdWVzdDtcclxuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyID09PSByZXEuYm9keS5uYW1lKSB7XHJcbiAgICByZXNwb25zZS5zZW5kKFtcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCJdKTtcclxuICB9IGVsc2Uge1xyXG4gICAgICBuZXdSZXF1ZXN0ID0ge1xyXG4gICAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICByZXF1ZXN0VHlwOiAnZnJpZW5kJ1xyXG4gICAgICB9O1xyXG5cclxuICAgIHBvb2wuZ2V0Q29ubmVjdGlvbihmdW5jdGlvbihlcnIsIGNvbikge1xyXG4gICAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ3NlbmRSZXF1ZXN0Jyk7IHRocm93IGVycjsgfVxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUsIHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicscmVxLm15U2Vzc2lvbi51c2VyLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICAgIGlmICghcmVzKSB7XHJcbiAgICAgICAgICByZXNwb25zZS5zZW5kKFsnbm8gZnJpZW5kcyddKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlciggYSA9PiBhLnJlc3BvbnNlID09PSBudWxsKTtcclxuICAgICAgICB2YXIgcmVxdWVzdGVlcyA9IHBwbFJlcWQubWFwKCBhID0+IGEucmVxdWVzdGVlICk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgbmV3UmVxdWVzdCwgKGVyciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdGVlcyk7XHJcbiAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuY29uc29sZS5sb2coJ3JlcXVlc3RlZScsIHJlcXVlc3RlZSk7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdsaXN0UmVxdWVzdHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnICsgJ09SIHJlcXVlc3RvciA9JyArICdcIicgKyByZXF1ZXN0ZWUgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhbGwgdGhlIHBlb3BsZScscmVzKTtcclxuICAgICAgcmVzcG9uc2Uuc2VuZChbcmVzLCByZXF1ZXN0ZWVdKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG5cclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2FjY2VwdCcpOyB0aHJvdyBlcnI7IH1cclxuICAgIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInK3JlcXVlc3RUeXBlKydcIicrJyBBTkQgcmVxdWVzdGVlID0gJysnXCInKyByZXF1ZXN0ZWUrJ1wiJywgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicrJyBBTkQgcmVxdWVzdGVlID0gJysnXCInKyByZXF1ZXN0ZWUrJ1wiJywgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0b3IsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcclxuICAgICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdGVlLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XHJcblxyXG4gICAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXHJcbiAgICAgICAgICB1c2VyMmlkOiBwZXJzb24yXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXF1ZXN0MiA9IHtcclxuICAgICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXHJcbiAgICAgICAgICB1c2VyMmlkOiBwZXJzb24xXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxyXG4gICAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnU3VjY2VzcycpO1xyXG4gICAgICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5yZW1vdmVSZXF1ZXN0ID0gKHJlcSwgcmVzKSA9PntcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKHRoZVJlcXVlc3QpIHtcclxuICAgICAgdGhlUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFRoaXNGcmllbmRzTW92aWVzID0gKHJlcSwgcmVzcG9uc2UpID0+IHtcclxuXHJcbiAgdmFyIG1vdmllcyA9IFtdO1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcclxuICB2YXIgcGVyc29uID0gcmVxLmJvZHkuc3BlY2lmaWNGcmllbmQ7XHJcbiAgdmFyIGlkID0gbnVsbDtcclxuICB2YXIgbGVuID0gbnVsbDtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2dldFRoaXNGcmllbmRzTW92aWVzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2VycnJycnJycnInLCBlcnIsIHJlc3AubGVuZ3RoKTtcclxuICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVuID0gcmVzcC5sZW5ndGg7XHJcbiAgICAgICAgcmVzcC5mb3JFYWNoKGEgPT4ge1xyXG4gICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICAgICAgbW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsIGEuc2NvcmUsIGEucmV2aWV3XSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vdmllcyk7XHJcbiAgICAgICAgICAgIGlmIChtb3ZpZXMubGVuZ3RoID09PSBsZW4pIHtcclxuICAgICAgICAgICAgICByZXNwb25zZS5zZW5kKG1vdmllcyk7XHJcbiAgICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZmluZE1vdmllQnVkZGllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICBjb25zb2xlLmxvZyhcInlvdSdyZSB0cnlpbmcgdG8gZmluZCBidWRkaWVzISFcIik7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdmaW5kTW92aWVCdWRkaWVzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzZXJzJywgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIHZhciBwZW9wbGUgPSByZXNwLm1hcChhID0+IGEudXNlcm5hbWUpO1xyXG4gICAgICB2YXIgSWRzID0gcmVzcC5tYXAoYSA9PiBhLmlkKTtcclxuICAgICAgdmFyIGlkS2V5T2JqID0ge307XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWRLZXlPYmpbSWRzW2ldXSA9IHBlb3BsZVtpXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGN1cnJlbnRVc2VyID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gICAgICBjb25zb2xlLmxvZygnY3VycmVudCB1c2VyJywgY3VycmVudFVzZXIpO1xyXG5cclxuICAgICAgdmFyIG9iajEgPSB7fTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBvYmoxW2lkS2V5T2JqW0lkc1tpXV1dID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHNjb3JlLG1vdmllaWQsdXNlcmlkIEZST00gcmF0aW5ncycsIChlcnIsIHJlc3Bvbik9PiB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBvYmoxW2lkS2V5T2JqW3Jlc3BvbltpXS51c2VyaWRdXS5wdXNoKFtyZXNwb25baV0ubW92aWVpZCwgcmVzcG9uW2ldLnNjb3JlXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnb2JqMScsIG9iajEpO1xyXG4gICAgICAgIHZhciBjdXJyZW50VXNlckluZm8gPSBvYmoxW2N1cnJlbnRVc2VyXTtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBhcmlzb25zID0ge307XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmoxKSB7XHJcbiAgICAgICAgICBpZiAoa2V5ICE9PSBjdXJyZW50VXNlcikge1xyXG4gICAgICAgICAgICBjb21wYXJpc29uc1trZXldID0gY29tcChjdXJyZW50VXNlckluZm8sIG9iajFba2V5XSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcclxuICAgICAgICB2YXIgZmluYWxTZW5kID0gW107XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKSB7XHJcbiAgICAgICAgICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XHJcbiAgICAgICAgICAgIGZpbmFsU2VuZC5wdXNoKFtrZXksIGNvbXBhcmlzb25zW2tleV1dKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZpbmFsU2VuZC5wdXNoKFtrZXksICdObyBDb21wYXJpc29uIHRvIE1ha2UnXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3BvbnNlLnNlbmQoZmluYWxTZW5kKTtcclxuICAgICAgICBjb24ucmVsZWFzZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuZGVjbGluZSA9IGZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG4gIHZhciBhZGRPbj0hbW92aWU/JyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIic6JyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZGVjbGluZScpOyB0aHJvdyBlcnI7IH0gICAgXHJcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJythZGRPbiwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQgPT4ge1xyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcclxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbih1c2VyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICd1c2VyIGNhbm5vdCBiZSBjcmVhdGVkJ319KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNpZ25pblVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZD0+e1xyXG4gICAgaWYgKGZvdW5kKXtcclxuICAgICAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSwgcGFzc3dvcmQ6cmVxLmJvZHkucGFzc3dvcmR9KS5mZXRjaCgpLnRoZW4odXNlcj0+e1xyXG4gICAgICAgIGlmICh1c2VyKXtcclxuICAgICAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCAnLCBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKTtcclxuICAgICAgICAgIHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuICAgICAgY29uc29sZS5sb2coJ3VzZXIgbm90IGZvdW5kJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gIH0pO1xyXG4gIGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcclxuICByZXMuc2VuZCgnbG9nb3V0Jyk7XHJcbn07XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vbW92aWUgaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL2EgaGFuZGVsZXIgdGhhdCB0YWtlcyBhIHJhdGluZyBmcm9tIHVzZXIgYW5kIGFkZCBpdCB0byB0aGUgZGF0YWJhc2VcclxuLy8gZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoaXM6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJywgcG9zdGVyOiAnbGluaycsIHJlbGVhc2VfZGF0ZTogJ3llYXInLCByYXRpbmc6ICdudW1iZXInfVxyXG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgcmF0ZU1vdmllJyk7XHJcbiAgbGV0IHVzZXJpZDtcclxuICByZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcclxuICAudGhlbihmb3VuZFVzZXIgPT4ge1xyXG4gICAgdXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XHJcbiAgICByZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXHJcbiAgICAudGhlbihmb3VuZFJhdGluZyA9PiB7XHJcbiAgICAgIGlmIChmb3VuZFJhdGluZykge1xyXG4gICAgICAgIC8vc2luY2UgcmF0aW5nIG9yIHJldmlldyBpcyB1cGRhdGVkIHNlcGVyYXRseSBpbiBjbGllbnQsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlIHJhdGluZycsIGZvdW5kUmF0aW5nKVxyXG4gICAgICAgIGxldCByYXRpbmdPYmo7XHJcbiAgICAgICAgaWYgKHJlcS5ib2R5LnJhdGluZykge1xyXG4gICAgICAgICAgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XHJcbiAgICAgICAgICByYXRpbmdPYmogPSB7cmV2aWV3OiByZXEuYm9keS5yZXZpZXd9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFJhdGluZyh7J2lkJzogZm91bmRSYXRpbmcuYXR0cmlidXRlcy5pZH0pXHJcbiAgICAgICAgICAuc2F2ZShyYXRpbmdPYmopO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyByYXRpbmcnKTtcclxuICAgICAgICByZXR1cm4gUmF0aW5ncy5jcmVhdGUoe1xyXG4gICAgICAgICAgc2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcclxuICAgICAgICAgIHVzZXJpZDogdXNlcmlkLFxyXG4gICAgICAgICAgbW92aWVpZDogcmVxLmJvZHkuaWQsXHJcbiAgICAgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKG5ld1JhdGluZyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xyXG4gICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgnZXJyb3InKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxyXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG52YXIgYWRkT25lTW92aWUgPSBtb3ZpZU9iaiA9PiB7XHJcbiAgbGV0IGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xyXG4gIHJldHVybiBuZXcgTW92aWUoe1xyXG4gICAgaWQ6IG1vdmllT2JqLmlkLFxyXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxyXG4gICAgZ2VucmU6IGdlbnJlLFxyXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXHJcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcclxuICAgIGRlc2NyaXB0aW9uOiBtb3ZpZU9iai5vdmVydmlldy5zbGljZSgwLCAyNTUpLFxyXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXHJcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXHJcbiAgLnRoZW4obmV3TW92aWUgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcclxuICAgIHJldHVybiBuZXdNb3ZpZTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICdwcm9ibGVtIGNyZWF0aW5nIG1vdmllJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcclxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXHJcblxyXG5leHBvcnRzLmdldFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBSYXRpbmcucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gICAgcWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xyXG4gICAgcWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJyk7XHJcbiAgfSlcclxuICAuZmV0Y2hBbGwoKVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgLy9kZWNvcmF0ZSBpdCB3aXRoIGF2ZyBmcmllbmQgcmF0aW5nXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xyXG4gICAgICByZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cml2ZSByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgcmF0aW5ncycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZSBhcyBmcmllbmRTY29yZScsICdyYXRpbmdzLnJldmlldyBhcyBmcmllbmRSZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgICBxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5xdWVyeS5mcmllbmROYW1lKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcbiAgICAgIHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcclxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cml2ZSBhdmVyYWdlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHJldHJpdmUgYXZlcmFnZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXHJcbmNvbnN0IGF0dGFjaEZyaWVuZEF2Z1JhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcclxuICByZXR1cm4gZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgIC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXHJcbiAgICBpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJhdGluZztcclxuICB9KTtcclxufTtcclxuXHJcbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyB1c2VyIHJhdGluZyBhbmQgcmV2aWV3cyB0byB0aGUgcmF0aW5nIG9ialxyXG5jb25zdCBhdHRhY2hVc2VyUmF0aW5nID0gKHJhdGluZywgdXNlcm5hbWUpID0+IHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXHJcbiAgICAgICdtb3ZpZXMudGl0bGUnOiByYXRpbmcuYXR0cmlidXRlcy50aXRsZSxcclxuICAgICAgJ21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4odXNlclJhdGluZyA9PiB7XHJcbiAgICBpZiAodXNlclJhdGluZykge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmc7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIGNhbm5vdCBmaW5kIHVzZXIgcmF0aW5nJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xyXG5leHBvcnRzLmhhbmRsZUdldEZyaWVuZFJhdGluZ3MgPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XHJcbiAgZ2V0RnJpZW5kUmF0aW5ncyhyZXEubXlTZXNzaW9uLnVzZXIsIHthdHRyaWJ1dGVzOiByZXEuYm9keS5tb3ZpZX0pXHJcbiAgLnRoZW4oZnJpZW5kUmF0aW5ncyA9PiB7XHJcbiAgICByZXMuanNvbihmcmllbmRSYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIGZyaWVuZCByYXRpbmdzIGZvciB0aGUgbW92aWUnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcclxuLy9leHBlY3QgY3VycmVudCB1c2VybmFtZSBhbmQgbW92aWVUaXRsZSBhcyBpbnB1dFxyXG4vL291dHB1dHM6IHt1c2VyMmlkOiAnaWQnLCBmcmllbmRVc2VyTmFtZTonbmFtZScsIGZyaWVuZEZpcnN0TmFtZTonbmFtZScsIHRpdGxlOidtb3ZpZVRpdGxlJywgc2NvcmU6biB9XHJcbmNvbnN0IGdldEZyaWVuZFJhdGluZ3MgPSAodXNlcm5hbWUsIG1vdmllT2JqKSA9PiB7XHJcbiAgcmV0dXJuIFVzZXIucXVlcnkocWIgPT4ge1xyXG4gICAgcWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdyYXRpbmdzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAncmVsYXRpb25zLnVzZXIyaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuICAgICAgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXHJcbiAgICAgICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgLy90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmcmllbmRSYXRpbmcgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKGZyaWVuZCA9PiB7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kVXNlck5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy51c2VybmFtZTtcclxuICAgICAgICBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XHJcbiAgICAgICAgcmV0dXJuIGZyaWVuZFJhdGluZztcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGZyaWVuZHNSYXRpbmdzID0+IHtcclxuICAgIHJldHVybiBmcmllbmRzUmF0aW5ncztcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXHJcbi8vaW5wdXRzIHJhdGluZ3MsIG91dHB1dHMgdGhlIGF2ZXJhZ2Ugc2NvcmU7XHJcbmNvbnN0IGF2ZXJhZ2VSYXRpbmcgPSAocmF0aW5ncykgPT4ge1xyXG4gIC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcclxuICBpZiAocmF0aW5ncy5sZW5ndGggPT09IDApIHsgcmV0dXJuIG51bGw7IH1cclxuICByZXR1cm4gcmF0aW5ncy5yZWR1Y2UoKHRvdGFsLCByYXRpbmcpID0+IHRvdGFsICsgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUsIDApIC8gcmF0aW5ncy5sZW5ndGg7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXHJcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxyXG5jb25zdCBnZXRPbmVNb3ZpZVJhdGluZyA9ICh1c2VybmFtZSwgbW92aWVPYmopID0+IHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbihyYXRpbmcgPT4ge1xyXG4gICAgaWYgKCFyYXRpbmcpIHtcclxuICAgICAgLy9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxyXG4gICAgICByZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcclxuICAgICAgLnRoZW4obW92aWUgPT4ge1xyXG4gICAgICAgIG1vdmllLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBtb3ZpZTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcmF0aW5nO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgLnRoZW4ocmF0aW5nID0+IHtcclxuICAgIHJldHVybiBnZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXHJcbiAgICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG4gICAgICBjb25zb2xlLmxvZygnYWRkZWQgYXZlcmFnZSBmcmllbmQgcmF0aW5nJywgcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpO1xyXG4gICAgICByZXR1cm4gcmF0aW5nO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cmlldmUgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAnIHVuYWJsZSB0byByZXRyaWV2ZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgdGhyb3cgZXJyO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XHJcbiAgUHJvbWlzZS5tYXAocmVxLmJvZHkubW92aWVzLCBtb3ZpZSA9PiB7XHJcbiAgICAvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICByZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcclxuICAgIC50aGVuKGZvdW5kTW92aWUgPT4ge1xyXG4gICAgICAvL2lmIG5vdCBjcmVhdGUgb25lXHJcbiAgICAgIGlmICghZm91bmRNb3ZpZSkge1xyXG4gICAgICAgIHJldHVybiBhZGRPbmVNb3ZpZShtb3ZpZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kTW92aWU7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAudGhlbihmb3VuZE1vdmllID0+e1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnZm91bmQgbW92aWUnLCBmb3VuZE1vdmllKTtcclxuICAgICAgcmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyLCAnY2Fubm90IGFkZCBtb3ZpZScpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xyXG4gICAgcmVzLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyciwgJ2Nhbm5vdCBnZXQgbW92aWUnKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xyXG4vL3dlIGNhbm5vdCBkbyBpdCBpbiB0aGUgZnJvbnQgZW5kIGJlY2F1c2UgY3Jvc3Mgb3JpZ2luIHJlcXVlc3QgaXNzdWVzXHJcbmV4cG9ydHMuZ2V0UmVjZW50UmVsZWFzZSA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxyXG4gICAgcHJpbWFyeV9yZWxlYXNlX3llYXI6IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSxcclxuICAgIGluY2x1ZGVfYWR1bHQ6IGZhbHNlLFxyXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcclxuICB9O1xyXG5cclxuICBsZXQgZGF0YSA9ICcnO1xyXG4gIHJlcXVlc3Qoe1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIHVybDogJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvZGlzY292ZXIvbW92aWUvJyxcclxuICAgIHFzOiBwYXJhbXNcclxuICB9KVxyXG4gIC5vbignZGF0YScsIGNodW5rID0+IHtcclxuICAgIGRhdGEgKz0gY2h1bms7XHJcbiAgfSlcclxuICAub24oJ2VuZCcsICgpID0+IHtcclxuICAgIHJlcS5ib2R5Lm1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSkucmVzdWx0cztcclxuICAgIC8vdHJhbnNmZXJzIHRoZSBtb3ZpZSBkYXRhIHRvIGdldE11bHRpcGxlTW92aWVSYXRpbmdzIHRvIGRlY29yYXRlIHdpdGggc2NvcmUgKHVzZXIgcmF0aW5nKSBhbmQgYXZnZnJpZW5kUmF0aW5nIGF0dHJpYnV0ZVxyXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XHJcblxyXG4gIH0pXHJcbiAgLm9uKCdlcnJvcicsIGVycm9yID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yLCAnVGhlTW92aWVEQiBkb2VzIG5vdCByZXNwb25kJyk7XHJcbiAgfSk7XHJcblxyXG59O1xyXG5cclxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcclxuY29uc3QgZ2VucmVzID0ge1xyXG4gICAxMjogJ0FkdmVudHVyZScsXHJcbiAgIDE0OiAnRmFudGFzeScsXHJcbiAgIDE2OiAnQW5pbWF0aW9uJyxcclxuICAgMTg6ICdEcmFtYScsXHJcbiAgIDI3OiAnSG9ycm9yJyxcclxuICAgMjg6ICdBY3Rpb24nLFxyXG4gICAzNTogJ0NvbWVkeScsXHJcbiAgIDM2OiAnSGlzdG9yeScsXHJcbiAgIDM3OiAnV2VzdGVybicsXHJcbiAgIDUzOiAnVGhyaWxsZXInLFxyXG4gICA4MDogJ0NyaW1lJyxcclxuICAgOTk6ICdEb2N1bWVudGFyeScsXHJcbiAgIDg3ODogJ1NjaWVuY2UgRmljdGlvbicsXHJcbiAgIDk2NDg6ICdNeXN0ZXJ5JyxcclxuICAgMTA0MDI6ICdNdXNpYycsXHJcbiAgIDEwNzQ5OiAnUm9tYW5jZScsXHJcbiAgIDEwNzUxOiAnRmFtaWx5JyxcclxuICAgMTA3NTI6ICdXYXInLFxyXG4gICAxMDc2OTogJ0ZvcmVpZ24nLFxyXG4gICAxMDc3MDogJ1RWIE1vdmllJ1xyXG4gfTtcclxuXHJcbi8vdGhpcyBmdW5jdGlvbiB3aWxsIHNlbmQgYmFjayBzZWFyY2IgbW92aWVzIHVzZXIgaGFzIHJhdGVkIGluIHRoZSBkYXRhYmFzZVxyXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcclxuZXhwb3J0cy5zZWFyY2hSYXRlZE1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gICAgcWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKTtcclxuICAgIHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihtYXRjaGVzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcclxuICAgIHJlcy5qc29uKG1hdGNoZXMpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gc2VhcmNoIERCJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIHNlYXJjaCcpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vZnJpZW5kc2hpcCBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kTGlzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJlbGF0aW9uLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG4gICAgcWIud2hlcmUoe1xyXG4gICAgICAndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmcmllbmRzID0+IHtcclxuICAgIHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVXNlcih7aWQ6IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXIyaWR9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xyXG4gICAgICAgIHJldHVybiBmcmllbmRVc2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihmdW5jdGlvbihmcmllbmRzKXtcclxuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIGEgbGlzdCBvZiBmcmllbmQgbmFtZXMnLCBmcmllbmRzKTtcclxuICAgIHJlcy5qc29uKGZyaWVuZHMpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gZ2V0IGZyaWVuZHMnKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gZ2V0IGZyaWVuZHMnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHZhciBwZW9wbGVJZCA9IFtdO1xyXG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2dldEZyaWVuZHMnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIGlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBsaW5nLzInLGlkKVxyXG4gICAgXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgIHZhciB1c2Vyc1JhdGluZ3M9cmVzcC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBbYS5tb3ZpZWlkLCBhLnNjb3JlXX0pO1xyXG5cclxuICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmVsYXRpb25zIFdIRVJFIHVzZXIxaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIHBlb3BsZUlkLnB1c2gocmVzcFtpXS51c2VyMmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIHBlb3BsZSA9IFtdXHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xyXG4gICAgICAgICAgdmFyIGtleUlkPXt9O1xyXG4gICAgICAgICAgcGVvcGxlSWQuZm9yRWFjaChmdW5jdGlvbihhKSB7XHJcblxyXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcclxuICAgICAgICAgICAgICBrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcclxuICAgICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIGEnLGEpXHJcbiAgICAgICAgICAgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XHJcbiAgICAgICAgICAgICAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAocGVvcGxlLmxlbmd0aD09PXBlb3BsZUlkLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVvcGxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwZW9wbGVbaV0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV1beF0ucHVzaChwZW9wbGVbaV1beF1bel0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5hbCcsZmluYWwsdXNlcnNSYXRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb21wYXJpc29ucz17fTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb21wYXJpc29uc1trZXldPWNvbXAodXNlcnNSYXRpbmdzLGZpbmFsW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdmVyeUZpbmFsPVtdO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnlGaW5hbC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcclxuICAgICAgICAgICAgICAgICAgcmVzLnNlbmQodmVyeUZpbmFsKTtcclxuICAgICAgICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSk7XHJcbn07XHJcblxyXG4iXX0=