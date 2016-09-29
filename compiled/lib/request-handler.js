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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsIm15c3FsIiwicmVxdWlyZSIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIlJhdGluZ3MiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJwb29sIiwiY3JlYXRlUG9vbCIsImNvbm5lY3Rpb25MaW1pdCIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImV4cG9ydHMiLCJzaWdudXBVc2VyIiwicmVxIiwicmVzIiwidXNlcm5hbWUiLCJib2R5IiwibmFtZSIsImZldGNoIiwidGhlbiIsImZvdW5kIiwic3RhdHVzIiwic2VuZCIsIm15U2Vzc2lvbiIsImNyZWF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJyZXNwb25zZSIsInJlcXVlc3RlZXMiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWUiLCJlYWNoIiwicmVxdWVzdG9yIiwicmVxdWVzdFR5cCIsIm1vdmllIiwibWVzc2FnZSIsImNhdGNoIiwianNvbiIsImVycm9yIiwiZGF0YSIsImVyciIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwidGhlUmVxdWVzdCIsImRlc3Ryb3kiLCJzZW5kUmVxdWVzdCIsIm5ld1JlcXVlc3QiLCJnZXRDb25uZWN0aW9uIiwiY29uIiwicXVlcnkiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsInJlbGVhc2UiLCJsaXN0UmVxdWVzdHMiLCJhY2NlcHQiLCJwZXJzb25Ub0FjY2VwdCIsInJlcXVlc3RUeXBlIiwicGVyc29uMSIsImlkIiwicGVyc29uMiIsInVzZXIxaWQiLCJ1c2VyMmlkIiwicmVxdWVzdDIiLCJyZW1vdmVSZXF1ZXN0IiwiZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMiLCJtb3ZpZXMiLCJwZXJzb24iLCJzcGVjaWZpY0ZyaWVuZCIsImxlbiIsImZvckVhY2giLCJtb3ZpZWlkIiwidGl0bGUiLCJzY29yZSIsInJldmlldyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJwZW9wbGUiLCJJZHMiLCJpZEtleU9iaiIsImN1cnJlbnRVc2VyIiwib2JqMSIsInJlc3BvbiIsInVzZXJpZCIsImN1cnJlbnRVc2VySW5mbyIsImNvbXBhcmlzb25zIiwia2V5IiwiZmluYWxTZW5kIiwiZGVjbGluZSIsInBlcnNvblRvRGVjbGluZSIsImFkZE9uIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZ09iaiIsInJhdGluZyIsInNhdmUiLCJhZGRPbmVNb3ZpZSIsImdlbnJlIiwibW92aWVPYmoiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZCIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiZ2V0RnJpZW5kcyIsInBlb3BsZUlkIiwidXNlcnNSYXRpbmdzIiwiaW5kZXhPZiIsImtleUlkIiwicmVzcG8iLCJyZSIsInJhbmRvbSIsInoiLCJ2ZXJ5RmluYWwiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU1BLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUM1QixNQUFNQyxJQUFPQyxLQUFLQyxHQUFMLENBQVNKLElBQU9DLENBQWhCLENBQWI7QUFDQyxTQUFPLElBQUlDLENBQVg7QUFDQSxDQUhEO0FBQUEsSUFLTUcsT0FBTyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBUUMsQ0FBUixFQUFrQjtBQUMvQixNQUFNQyxJQUFRLEVBQWQ7QUFDRSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBTUksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDOztBQUVyQyxTQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUosRUFBT0csTUFBM0IsRUFBbUNDLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJTCxFQUFNRyxDQUFOLEVBQVMsQ0FBVCxN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Q0FBVCxJQUFnQnhHLENBQWhCLEVBQXNCO0FBQ3BCdUcsc0JBQVlDLENBQVosSUFBaUIzRyxLQUFLNkwsQ0FBTCxFQUFrQjFMLEVBQU13RyxDQUFOLENBQWxCLENBQWpCO0FBQ0Q7O0FBRUQsc0JBQUl5RixJQUFVLEVBQWQ7QUFDQSx1QkFBSyxJQUFJekYsQ0FBVCxJQUFnQkQsQ0FBaEIsRUFBNEI7QUFDMUIwRixzQkFBVTdMLElBQVYsQ0FBZSxDQUFDb0csQ0FBRCxFQUFLRCxFQUFZQyxDQUFaLENBQUwsQ0FBZjtBQUNEOztBQUVEeEUsb0JBQUlRLElBQUosQ0FBU3lKLENBQVQ7QUFDQS9ILG9CQUFJTSxPQUFKO0FBQ0Q7QUFDRixlQXhDRDtBQXlDRCxhQTVDRDtBQTZDRCxXQS9DRDtBQWdERCxTQXpERDtBQTBERCxPQTdERDtBQThERCxLQWxFRDtBQW1FRCxHQXJFRDtBQXNFRCxDQXpFRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbi8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBoZWxwZXIgPSAobnVtMSxudW0yKT0+e1xyXG5jb25zdCBkaWZmID0gTWF0aC5hYnMobnVtMSAtIG51bTIpO1xyXG4gcmV0dXJuIDUgLSBkaWZmO1xyXG59O1xyXG5cclxuY29uc3QgY29tcCA9IChmaXJzdCwgc2Vjb25kKT0+IHtcclxuY29uc3QgZmluYWwgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XHJcblxyXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuY29uc3Qgc3VtID0gZmluYWwucmVkdWNlKChhLGIpID0+IGEgKyBiLCAwKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCgyMCAqIHN1bSAvIGZpbmFsLmxlbmd0aCk7XHJcbn07XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5jb25zdCBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XHJcbmNvbnN0IE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xyXG5jb25zdCBSYXRpbmcgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JhdGluZycpO1xyXG5jb25zdCBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xyXG5jb25zdCBhbGxSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9hbGxSZXF1ZXN0Jyk7XHJcblxyXG4vLyB2YXIgTW92aWVzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL21vdmllcycpO1xyXG5jb25zdCBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxuLy8gdmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxuY29uc3QgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcclxudmFyIGFsbFJlcXVlc3RzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL2FsbFJlcXVlc3RzJyk7XHJcblxyXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuXHJcbmNvbnN0IHBvb2wgID0gbXlzcWwuY3JlYXRlUG9vbCh7XHJcbiAgY29ubmVjdGlvbkxpbWl0IDogNCxcclxuICBob3N0OiBcInVzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0XCIsXHJcbiAgdXNlcjogJ2I2ZTcyNjU5ZTRmNjJlJyxcclxuICBwYXNzd29yZDogICc0Yjc1ZDQzZicsXHJcbiAgZGF0YWJhc2U6ICdoZXJva3VfODc0MzUyMWFlNjhkNTgzJ1xyXG59KTtcclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vL3VzZXIgYXV0aFxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQgPT57XHJcbiAgICBpZiAoZm91bmQpIHtcclxuICAgICAgLy9jaGVjayBwYXNzd29yZFxyXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxyXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cclxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcclxuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcclxuICAgICAgVXNlcnMuY3JlYXRlKHtcclxuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kV2F0Y2hSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSk7XHJcbiAgbGV0IHJlcXVlc3RlZXM7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICBQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgcmVxdWVzdGVlID0+IHtcclxuICAgIGFsbFJlcXVlc3RzLmNyZWF0ZSh7XHJcbiAgICAgIHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLFxyXG4gICAgICByZXF1ZXN0ZWU6IHJlcXVlc3RlZSxcclxuICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcclxuICAgICAgbW92aWU6IHJlcS5ib2R5Lm1vdmllLFxyXG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKGRvbmUgPT4ge1xyXG4gICAgcmVzcG9uc2Uuc2VuZCgnU3VjY2VzcycpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHRoZVJlcXVlc3QgPT4ge1xyXG4gICAgdGhlUmVxdWVzdC5kZXN0cm95KClcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChyZXEsIHJlc3BvbnNlKT0+IHtcclxuICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEltIGdldHRpbmcnLCByZXEuYm9keSk7XHJcbiAgbGV0IG5ld1JlcXVlc3Q7XHJcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlciA9PT0gcmVxLmJvZHkubmFtZSkge1xyXG4gICAgcmVzcG9uc2Uuc2VuZChbXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiXSk7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgbmV3UmVxdWVzdCA9IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlcixcclxuICAgICAgICByZXF1ZXN0ZWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcmVxdWVzdFR5cDogJ2ZyaWVuZCdcclxuICAgICAgfTtcclxuXHJcbiAgICBwb29sLmdldENvbm5lY3Rpb24oZnVuY3Rpb24oZXJyLCBjb24pIHtcclxuICAgICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdzZW5kUmVxdWVzdCcpOyB0aHJvdyBlcnI7IH1cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgcmVxdWVzdGVlLCByZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RvciA9ID8gQU5EIHJlcXVlc3RUeXAgPScgKyAnXCInICsgJ2ZyaWVuZCcgKyAnXCInLHJlcS5teVNlc3Npb24udXNlciwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgICBpZiAoIXJlcykge1xyXG4gICAgICAgICAgcmVzcG9uc2Uuc2VuZChbJ25vIGZyaWVuZHMnXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHBsUmVxZCA9IHJlcy5maWx0ZXIoIGEgPT4gYS5yZXNwb25zZSA9PT0gbnVsbCk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RlZXMgPSBwcGxSZXFkLm1hcCggYSA9PiBhLnJlcXVlc3RlZSApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduYW1lcyBvZiBwZW9wbGUgd2hvbSBJdmUgcmVxdWVzdGVkIGFzIGZyaWVuZHMnLCBwcGxSZXFkKTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIG5ld1JlcXVlc3QsIChlcnIsIHJlc3ApID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcC5pbnNlcnRJZCk7XHJcbiAgICAgICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RlZXMpO1xyXG4gICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5saXN0UmVxdWVzdHMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG4gIHZhciByZXF1ZXN0ZWUgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbmNvbnNvbGUubG9nKCdyZXF1ZXN0ZWUnLCByZXF1ZXN0ZWUpO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnbGlzdFJlcXVlc3RzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nICsgJ1wiJyArIHJlcXVlc3RlZSArICdcIicgKyAnJyArICdPUiByZXF1ZXN0b3IgPScgKyAnXCInICsgcmVxdWVzdGVlICsgJ1wiJyArICcnLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgICBpZiAoZXJyKSB7IHRocm93IGVycjsgfVxyXG4gICAgICBjb25zb2xlLmxvZygnYWxsIHRoZSBwZW9wbGUnLHJlcyk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQoW3JlcywgcmVxdWVzdGVlXSk7XHJcbiAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdG9yID0gcmVxLmJvZHkucGVyc29uVG9BY2NlcHQ7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuXHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdhY2NlcHQnKTsgdGhyb3cgZXJyOyB9XHJcbiAgICBpZiAobW92aWUgPT09ICcnKSB7XHJcbiAgICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInKycgQU5EIHJlcXVlc3RlZSA9ICcrJ1wiJysgcmVxdWVzdGVlKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInKycgQU5EIHJlcXVlc3RlZSA9ICcrJ1wiJysgcmVxdWVzdGVlKydcIicsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdG9yLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RlZSwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xyXG5cclxuICAgICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMlxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVxdWVzdDIgPSB7XHJcbiAgICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxyXG4gICAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcclxuICAgICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IChyZXEsIHJlcykgPT57XHJcbiAgdmFyIHJlcXVlc3RvciA9IHJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgcmVxdWVzdGVlID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxyXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbih0aGVSZXF1ZXN0KSB7XHJcbiAgICAgIHRoZVJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gIHZhciBtb3ZpZXMgPSBbXTtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XHJcbiAgdmFyIHBlcnNvbiA9IHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kO1xyXG4gIHZhciBpZCA9IG51bGw7XHJcbiAgdmFyIGxlbiA9IG51bGw7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRUaGlzRnJpZW5kc01vdmllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcGVyc29uLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cclxuICAgICAgaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZyhpZCk7XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJycnJycnJyJywgZXJyLCByZXNwLmxlbmd0aCk7XHJcbiAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbiA9IHJlc3AubGVuZ3RoO1xyXG4gICAgICAgIHJlc3AuZm9yRWFjaChhID0+IHtcclxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgICAgICAgIG1vdmllcy5wdXNoKFtyZXNwWzBdLnRpdGxlLCBhLnNjb3JlLCBhLnJldmlld10pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZXMpO1xyXG4gICAgICAgICAgICBpZiAobW92aWVzLmxlbmd0aCA9PT0gbGVuKSB7XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xyXG4gICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG4gIHBvb2wuZ2V0Q29ubmVjdGlvbigoZXJyLCBjb24pID0+IHtcclxuICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyLCAnZmluZE1vdmllQnVkZGllcycpOyB0aHJvdyBlcnI7IH1cclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICB2YXIgcGVvcGxlID0gcmVzcC5tYXAoYSA9PiBhLnVzZXJuYW1lKTtcclxuICAgICAgdmFyIElkcyA9IHJlc3AubWFwKGEgPT4gYS5pZCk7XHJcbiAgICAgIHZhciBpZEtleU9iaiA9IHt9O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlkS2V5T2JqW0lkc1tpXV0gPSBwZW9wbGVbaV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjdXJyZW50VXNlciA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnQgdXNlcicsIGN1cnJlbnRVc2VyKTtcclxuXHJcbiAgICAgIHZhciBvYmoxID0ge307XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgb2JqMVtpZEtleU9ialtJZHNbaV1dXSA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCBzY29yZSxtb3ZpZWlkLHVzZXJpZCBGUk9NIHJhdGluZ3MnLCAoZXJyLCByZXNwb24pPT4ge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3Bvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQsIHJlc3BvbltpXS5zY29yZV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ29iajEnLCBvYmoxKTtcclxuICAgICAgICB2YXIgY3VycmVudFVzZXJJbmZvID0gb2JqMVtjdXJyZW50VXNlcl07XHJcblxyXG4gICAgICAgIHZhciBjb21wYXJpc29ucyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqMSkge1xyXG4gICAgICAgICAgaWYgKGtleSAhPT0gY3VycmVudFVzZXIpIHtcclxuICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XSA9IGNvbXAoY3VycmVudFVzZXJJbmZvLCBvYmoxW2tleV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgdmFyIGZpbmFsU2VuZCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucykge1xyXG4gICAgICAgICAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCBjb21wYXJpc29uc1trZXldXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmaW5hbFNlbmQucHVzaChba2V5LCAnTm8gQ29tcGFyaXNvbiB0byBNYWtlJ10pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZCk7XHJcbiAgICAgICAgY29uLnJlbGVhc2UoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmRlY2xpbmUgPSBmdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG4gIHZhciByZXF1ZXN0b3IgPSByZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XHJcbiAgdmFyIHJlcXVlc3RlZSA9IHJlcS5teVNlc3Npb24udXNlcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuICB2YXIgYWRkT249IW1vdmllPycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInOicgQU5EIHJlcXVlc3RlZT0nKydcIicrIHJlcXVlc3RlZSsnXCInKycgQU5EIG1vdmllID0nKydcIicrbW92aWUrJ1wiJztcclxuICBwb29sLmdldENvbm5lY3Rpb24oKGVyciwgY29uKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKGVyciwgJ2RlY2xpbmUnKTsgdGhyb3cgZXJyOyB9ICAgIFxyXG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrYWRkT24sIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHsgdGhyb3cgZXJyOyB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XHJcbiAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kID0+IHtcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAndXNlciBjYW5ub3QgYmUgY3JlYXRlZCd9fSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWduaW5Vc2VyID0gKHJlcSwgcmVzKT0+IHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZm91bmQ9PntcclxuICAgIGlmIChmb3VuZCl7XHJcbiAgICAgIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKHVzZXI9PntcclxuICAgICAgICBpZiAodXNlcil7XHJcbiAgICAgICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSB1c2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZm91bmQgJywgZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSk7XHJcbiAgICAgICAgICByZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VyIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJlcS5teVNlc3Npb24uZGVzdHJveShmdW5jdGlvbihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZygnbG9nb3V0Jyk7XHJcbiAgcmVzLnNlbmQoJ2xvZ291dCcpO1xyXG59O1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL21vdmllIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXHJcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cclxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xyXG4gIGxldCB1c2VyaWQ7XHJcbiAgcmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXHJcbiAgLnRoZW4oZm91bmRVc2VyID0+IHtcclxuICAgIHVzZXJpZCA9IGZvdW5kVXNlci5hdHRyaWJ1dGVzLmlkO1xyXG4gICAgcmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxyXG4gICAgLnRoZW4oZm91bmRSYXRpbmcgPT4ge1xyXG4gICAgICBpZiAoZm91bmRSYXRpbmcpIHtcclxuICAgICAgICAvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgLy9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcclxuICAgICAgICBsZXQgcmF0aW5nT2JqO1xyXG4gICAgICAgIGlmIChyZXEuYm9keS5yYXRpbmcpIHtcclxuICAgICAgICAgIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xyXG4gICAgICAgICAgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxyXG4gICAgICAgICAgLnNhdmUocmF0aW5nT2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XHJcbiAgICAgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcclxuICAgICAgICAgIHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXHJcbiAgICAgICAgICB1c2VyaWQ6IHVzZXJpZCxcclxuICAgICAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxyXG4gICAgICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihuZXdSYXRpbmcgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JhdGluZyBjcmVhdGVkOicsIG5ld1JhdGluZy5hdHRyaWJ1dGVzKTtcclxuICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdyYXRpbmcgcmVjaWV2ZWQnKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ2Vycm9yJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2VcclxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxudmFyIGFkZE9uZU1vdmllID0gbW92aWVPYmogPT4ge1xyXG4gIGxldCBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcclxuICByZXR1cm4gbmV3IE1vdmllKHtcclxuICAgIGlkOiBtb3ZpZU9iai5pZCxcclxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcclxuICAgIGdlbnJlOiBnZW5yZSxcclxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxyXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXHJcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcclxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxyXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxyXG4gIC50aGVuKG5ld01vdmllID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XHJcbiAgICByZXR1cm4gbmV3TW92aWU7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlLCAncHJvYmxlbSBjcmVhdGluZyBtb3ZpZScpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXHJcbi8vc2hvdWxkIHJldHVybiBhbiBhcnJheSB0aGF0IGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxyXG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxyXG5cclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgUmF0aW5nLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gICAgcWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgICBxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcclxuICAgIHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuICAgIHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpO1xyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuICAgICAgcmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gICAgcWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4ocmF0aW5ncyA9PiB7XHJcbiAgICAvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xyXG4gICAgICByZXR1cm4gYXR0YWNoVXNlclJhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC50aGVuKHJhdGluZ3MgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpdmUgYXZlcmFnZSBmcmllbmQgcmF0aW5ncycpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byByZXRyaXZlIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZ3MnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyBmcmllbmQgYXZnIHJhdGluZyB0byB0aGUgcmF0aW5nIG9ialxyXG5jb25zdCBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcbiAgcmV0dXJuIGdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICAvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxyXG4gICAgaWYgKCFmcmllbmRzUmF0aW5ncykge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgIH1cclxuICAgIHJldHVybiByYXRpbmc7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxuY29uc3QgYXR0YWNoVXNlclJhdGluZyA9IChyYXRpbmcsIHVzZXJuYW1lKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpO1xyXG4gICAgcWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcbiAgICBxYi53aGVyZSh7XHJcbiAgICAgICd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxyXG4gICAgICAnbW92aWVzLnRpdGxlJzogcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsXHJcbiAgICAgICdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxyXG4gICAgfSk7XHJcbiAgfSlcclxuICAuZmV0Y2goKVxyXG4gIC50aGVuKHVzZXJSYXRpbmcgPT4ge1xyXG4gICAgaWYgKHVzZXJSYXRpbmcpIHtcclxuICAgICAgcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmF0aW5nO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyBjYW5ub3QgZmluZCB1c2VyIHJhdGluZycpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xyXG4gIGdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxyXG4gIC50aGVuKGZyaWVuZFJhdGluZ3MgPT4ge1xyXG4gICAgcmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCd1bmFibGUgdG8gcmV0cml2ZSBmcmllbmQgcmF0aW5ncyBmb3IgdGhlIG1vdmllJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5jb25zdCBnZXRGcmllbmRSYXRpbmdzID0gKHVzZXJuYW1lLCBtb3ZpZU9iaikgPT4ge1xyXG4gIHJldHVybiBVc2VyLnF1ZXJ5KHFiID0+IHtcclxuICAgIHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcbiAgICBxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXHJcbiAgICAgICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxyXG4gICAgICAnbW92aWVzLmlkJzogbW92aWVPYmouYXR0cmlidXRlcy5pZCB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gIC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xyXG4gICAgcmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnJpZW5kUmF0aW5nID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmcmllbmQgPT4ge1xyXG4gICAgICAgIGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiBmcmllbmRSYXRpbmc7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihmcmllbmRzUmF0aW5ncyA9PiB7XHJcbiAgICByZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xyXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xyXG5jb25zdCBhdmVyYWdlUmF0aW5nID0gKHJhdGluZ3MpID0+IHtcclxuICAvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXHJcbiAgaWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7IHJldHVybiBudWxsOyB9XHJcbiAgcmV0dXJuIHJhdGluZ3MucmVkdWNlKCh0b3RhbCwgcmF0aW5nKSA9PiB0b3RhbCArIHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlLCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59O1xyXG5cclxuXHJcbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxyXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cclxuY29uc3QgZ2V0T25lTW92aWVSYXRpbmcgPSAodXNlcm5hbWUsIG1vdmllT2JqKSA9PiB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcclxuICB9KVxyXG4gIC5mZXRjaCgpXHJcbiAgLnRoZW4ocmF0aW5nID0+IHtcclxuICAgIGlmICghcmF0aW5nKSB7XHJcbiAgICAgIC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcclxuICAgICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXHJcbiAgICAgIC50aGVuKG1vdmllID0+IHtcclxuICAgICAgICBtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gbW92aWU7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH1cclxuICB9KVxyXG4gIC50aGVuKHJhdGluZyA9PiB7XHJcbiAgICByZXR1cm4gZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG4gICAgLnRoZW4oZnJpZW5kc1JhdGluZ3MgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XHJcbiAgICAgIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcclxuICAgICAgY29uc29sZS5sb2coJ2FkZGVkIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZycsIHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLCByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nKTtcclxuICAgICAgcmV0dXJuIHJhdGluZztcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHJldHJpZXZlIGZyaWVuZCByYXRpbmdzJyk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSwgJyB1bmFibGUgdG8gcmV0cmlldmUgZnJpZW5kIHJhdGluZ3MnKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqIHdpdGggdGhlc2UgYXR0cmlidXRlczoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XHJcbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cclxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xyXG4gIFByb21pc2UubWFwKHJlcS5ib2R5Lm1vdmllcywgbW92aWUgPT4ge1xyXG4gICAgLy9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxyXG4gICAgcmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllLnRpdGxlLCBpZDogbW92aWUuaWR9KS5mZXRjaCgpXHJcbiAgICAudGhlbihmb3VuZE1vdmllID0+IHtcclxuICAgICAgLy9pZiBub3QgY3JlYXRlIG9uZVxyXG4gICAgICBpZiAoIWZvdW5kTW92aWUpIHtcclxuICAgICAgICByZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmb3VuZE1vdmllO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZm91bmRNb3ZpZSA9PntcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2ZvdW5kIG1vdmllJywgZm91bmRNb3ZpZSk7XHJcbiAgICAgIHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVyciwgJ2Nhbm5vdCBhZGQgbW92aWUnKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSk7XHJcbiAgfSlcclxuICAudGhlbihyYXRpbmdzID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIHJhdGluZyB0byBjbGllbnQnKTtcclxuICAgIHJlcy5qc29uKHJhdGluZ3MpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIsICdjYW5ub3QgZ2V0IG1vdmllJyk7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcclxuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xyXG5leHBvcnRzLmdldFJlY2VudFJlbGVhc2UgPSAocmVxLCByZXMpID0+IHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcbiAgbGV0IGRhdGEgPSAnJztcclxuICByZXF1ZXN0KHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL2Rpc2NvdmVyL21vdmllLycsXHJcbiAgICBxczogcGFyYW1zXHJcbiAgfSlcclxuICAub24oJ2RhdGEnLCBjaHVuayA9PiB7XHJcbiAgICBkYXRhICs9IGNodW5rO1xyXG4gIH0pXHJcbiAgLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICByZXEuYm9keS5tb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpLnJlc3VsdHM7XHJcbiAgICAvL3RyYW5zZmVycyB0aGUgbW92aWUgZGF0YSB0byBnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyB0byBkZWNvcmF0ZSB3aXRoIHNjb3JlICh1c2VyIHJhdGluZykgYW5kIGF2Z2ZyaWVuZFJhdGluZyBhdHRyaWJ1dGVcclxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xyXG5cclxuICB9KVxyXG4gIC5vbignZXJyb3InLCBlcnJvciA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvciwgJ1RoZU1vdmllREIgZG9lcyBub3QgcmVzcG9uZCcpO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXHJcbmNvbnN0IGdlbnJlcyA9IHtcclxuICAgMTI6ICdBZHZlbnR1cmUnLFxyXG4gICAxNDogJ0ZhbnRhc3knLFxyXG4gICAxNjogJ0FuaW1hdGlvbicsXHJcbiAgIDE4OiAnRHJhbWEnLFxyXG4gICAyNzogJ0hvcnJvcicsXHJcbiAgIDI4OiAnQWN0aW9uJyxcclxuICAgMzU6ICdDb21lZHknLFxyXG4gICAzNjogJ0hpc3RvcnknLFxyXG4gICAzNzogJ1dlc3Rlcm4nLFxyXG4gICA1MzogJ1RocmlsbGVyJyxcclxuICAgODA6ICdDcmltZScsXHJcbiAgIDk5OiAnRG9jdW1lbnRhcnknLFxyXG4gICA4Nzg6ICdTY2llbmNlIEZpY3Rpb24nLFxyXG4gICA5NjQ4OiAnTXlzdGVyeScsXHJcbiAgIDEwNDAyOiAnTXVzaWMnLFxyXG4gICAxMDc0OTogJ1JvbWFuY2UnLFxyXG4gICAxMDc1MTogJ0ZhbWlseScsXHJcbiAgIDEwNzUyOiAnV2FyJyxcclxuICAgMTA3Njk6ICdGb3JlaWduJyxcclxuICAgMTA3NzA6ICdUViBNb3ZpZSdcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gICAgcWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICAgIHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYCk7XHJcbiAgICBxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgICBxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4obWF0Y2hlcyA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgICByZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIHNlYXJjaCBEQicpO1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoJ3VuYWJsZSB0byBzZWFyY2gnKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHJldHVybiBSZWxhdGlvbi5xdWVyeShxYiA9PiB7XHJcbiAgICBxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICAgIHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcclxuICAgIHFiLndoZXJlKHtcclxuICAgICAgJ3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG4gICAgICByZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG4gICAgICAudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuICAgICAgICByZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XHJcbiAgICByZXMuanNvbihmcmllbmRzKTtcclxuICB9KVxyXG4gIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UsICcgdW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCgndW5hYmxlIHRvIGdldCBmcmllbmRzJyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGVvcGxlSWQgPSBbXTtcclxuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgcG9vbC5nZXRDb25uZWN0aW9uKChlcnIsIGNvbikgPT4ge1xyXG4gICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhlcnIsICdnZXRGcmllbmRzJyk7IHRocm93IGVycjsgfVxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xyXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcclxuICAgIFxyXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcclxuXHJcbiAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBwZW9wbGUgPSBbXVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcclxuICAgICAgICAgIHZhciBrZXlJZD17fTtcclxuICAgICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG5cclxuICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdXNlcm5hbWUgRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8nLCBhLCBmdW5jdGlvbihlcnIsIHJlc3BvKSB7XHJcbiAgICAgICAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXHJcbiAgICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xyXG4gICAgICAgICAgICAgICAgICByZT1be3VzZXJpZDphLG1vdmllaWQ6TWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKSxzY29yZTo5OX1dXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGVvcGxlLnB1c2gocmUubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZmluYWwgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHZlcnlGaW5hbD1bXTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbi5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH0pO1xyXG59O1xyXG5cclxuIl19