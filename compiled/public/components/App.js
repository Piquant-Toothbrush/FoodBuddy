'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (c) { return typeof c; } : function (c) { return c && typeof Symbol === "function" && c.constructor === Symbol ? "symbol" : typeof c; };

var _createClass = function () { function c(d, e) { for (var i = 0; i < e.length; i++) { var f = e[i]; f.enumerable = f.enumerable || !1; f.configurable = !0; if ("value" in f) f.writable = !0; Object.defineProperty(d, f.key, f); } } return function (d, e, f) { if (e) c(d.prototype, e); if (f) c(d, f); return d; }; }();

function _classCallCheck(c, d) { if (!(c instanceof d)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(c, d) { if (!c) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return d && (typeof d === "object" || typeof d === "function") ? d : c; }

function _inherits(c, d) { if (typeof d !== "function" && d !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof d); } c.prototype = Object.create(d && d.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }); if (d) Object.setPrototypeOf ? Object.setPrototypeOf(c, d) : c.__proto__ = d; }

var App = function (c) {
  _inherits(d, c);

  function d(e) {
    _classCallCheck(this, d);

    var f = _possibleConstructorReturn(this, (d.__proto__ || Object.getPrototypeOf(d)).call(this, e));

    f.state = startingState;
    f.sendWatchRequest = f.sendWatchRequest.bind(f);
    f.getFriends = f.getCurrentFriends.bind(f);
    f.myFriends = f.state.myFriends;
    f.listPotentials = f.listPotentials.bind(f);
    f.logout = f.logout.bind(f);
    f.sendRequest = f.sendRequest.bind(f);
    //this.onClick=this.changeViews.bind(this);
    f.changeViews = f.changeViews.bind(f);
    f.setCurrentUser = f.setCurrentUser.bind(f);
    f.getMovie = f.getMovie.bind(f);
    f.acceptFriend = f.acceptFriend.bind(f);
    //this.decline=this.declineFriend.bind(this);
    f.declineFriend = f.declineFriend.bind(f);
    //this.listRequests=this.listPendingFriendRequests.bind(this);
    //this.remove=this.removeRequest.bind(this);
    f.changeViewsMovie = f.changeViewsMovie.bind(f);
    //this.buddyfunc=this.buddyRequest.bind(this);
    f.changeViewsFriends = f.changeViewsFriends.bind(f);
    f.findMovieBuddies = f.findMovieBuddies.bind(f);
    f.buddyRequest = f.buddyRequest.bind(f);
    f.listPendingFriendRequests = f.listPendingFriendRequests.bind(f);
    f.focusOnFriend = f.focusOnFriend.bind(f);
    f.removeRequest = f.removeRequest.bind(f);

    return f;
  }

  _createClass(d, [{
    key: 'getCurrentFriends',
    value: function getCurrentFriends() {
      var _this2 = this;

      // console.log('testinggg');
      $.post(Url + '/getFriends', { test: 'info' }, function (a, b) {
        // console.log('what you get back from server for get friends',a,b);
        for (var i = 0; i < a.length; i++) {
          if (a[i][1] === null) {
            a[i][1] = "No comparison to be made";
          }
        }

        var e = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        _this2.setState({
          myFriends: e
        });
        // console.log('thes are my friends!!!!!!!!!!!!!!!!!',this.state.myFriends)
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(e, f) {
      var g = this;
      // $('button').on('click',function() {
      //   console.log($(this).html());
      // })
      // console.log(final +'should be accepted, for movie....', movie)

      $.post(Url + '/accept', { personToAccept: e, movie: f }, function (h, j) {
        g.listPendingFriendRequests();
      });

      // console.log('refreshed inbox, should delete friend request on the spot instead of moving')
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(e, f) {
      var g = this;
      $.post(Url + '/decline', { personToDecline: e, movie: f }, function (h, j) {
        // console.log('this is the state after declining friend, ', this.state);
        g.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this3 = this,
          e = this;

      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (f, g) {
        var h = f.sort(function (a, b) {
          return b[1] - a[1];
        }),
            j = e.myFriends,
            k = [];

        for (var i = 0; i < h.length; i++) {
          var l = !0;
          for (var x = 0; x < j.length; x++) {
            if (h[i][0] === j[x][0]) {
              l = !1;
            }
          }
          if (l) {
            k.push(h[i]);
          }
        }

        _this3.setState({
          view: "FNMB",
          potentialMovieBuddies: k
        });

        // console.log(this.state.myFriends,this.state.potentialMovieBuddies);
      });
    }
  }, {
    key: 'changeView',
    value: function changeView() {
      this.setState({
        view: "SignUp"
      });
    }
  }, {
    key: 'setCurrentUser',
    value: function setCurrentUser(e) {
      // console.log('calling setCurrentUser');
      this.setState({
        currentUser: e
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(e, f) {
      var _this4 = this;

      // console.log(name,password);
      $.post(Url + '/signup', { name: e, password: f }).then(function () {
        // console.log('success'); 
        _this4.setState({ username: e, view: "Home" });
      }).catch(function () {});
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this5 = this,
          e = document.getElementById("movieToView").value;

      $.post(Url + '/getFriendRatings', { name: e }).then(function (f) {
        _this5.setState({
          view: "Home",
          friendsRatings: f
        });
        // console.log('our response',this.state.friendsRatings)
      }).catch(function (f) {});
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this6 = this;

      $.post(Url + '/logout').then(function (e) {
        // console.log(response);
        _this6.setState(startingState);
      });
    }
  }, {
    key: 'sendWatchRequest',
    value: function sendWatchRequest(e) {
      var f = document.getElementById('movieToWatch').value,
          g = { requestee: e, movie: f };

      if (f.length) {
        $.post(Url + '/sendWatchRequest', g, function (h, j) {
          // console.log(resp, err);
        });
        document.getElementById('movieToWatch').value = '';
      } else {
        // console.log('you need to enter a movie to send a watch request!!!!')
      }
    }

    /////////////////////
    /////movie render
    /////////////////////
    //call searchmovie function
    //which gets passed down to the Movie Search 

  }, {
    key: 'getMovie',
    value: function getMovie(e) {
      var _this7 = this,
          f = {
        query: e
      };

      this.props.searchMovie(f, function (g) {
        // console.log(movie);
        _this7.setState({
          view: "MovieSearchView",
          movie: g
        });
      });
    }
    //show the movie searched in friend movie list
    //onto the stateview of moviesearchview

  }, {
    key: 'showMovie',
    value: function showMovie(e) {
      this.setState({
        movie: e
      });
    }
    /////////////////////
    /////Nav change
    /////////////////////

  }, {
    key: 'changeViews',
    value: function changeViews(e) {
      // console.log(this.state);

      if (e === 'Friends') {
        // console.log('you switched to friends!!')
        this.getCurrentFriends();
        //this.sendRequest();
      }

      if (e === 'Home') {
        // this.getCurrentFriends()
        this.sendRequest();
      }

      if (e === "Inbox") {
        this.listPendingFriendRequests();
      }

      this.setState({
        view: e
      });
    }
  }, {
    key: 'changeViewsMovie',
    value: function changeViewsMovie(e, f) {
      this.setState({
        view: e,
        movie: f
      });
    }
  }, {
    key: 'changeViewsFriends',
    value: function changeViewsFriends(e, f) {
      this.setState({
        view: e,
        friendToFocusOn: f
      });
    }
  }, {
    key: 'buddyRequest',
    value: function buddyRequest(e, f) {
      this.sendRequest(e, f);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a, e) {
      var _this8 = this;

      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === "object") {
        var f = document.getElementById('findFriendByName').value;
      } else {
        var f = a || 'test';
      }
      var g = this.state.myFriends,
          h = [],
          j = [];

      for (var i = 0; i < g.length; i++) {
        // console.log('line 251',currFriends[i])
        h.push(g[i][0]);
        j.push(g[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        h.push(this.state.requestsOfCurrentUser[i]);
      }

      // console.log('this should also be my friends',person, currFriends,friends1,friends2)

      //console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
      if (h.indexOf(f) !== -1 && h.length !== 0) {
        $(document).scrollTop(0);
        $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
        $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);

        // console.log('this person is already in there!!')
      } else if (!f.length) {
        $(document).scrollTop(0);
        $("#enterRealFriend,#enterRealFriend2").fadeIn(1000);
        $("#enterRealFriend,#enterRealFriend2").fadeOut(1000);
      } else {

        // console.log('person is defined?',person);
        $.post(Url + '/sendRequest', { name: f }, function (k, l) {

          _this8.setState({
            requestsOfCurrentUser: k.concat([f])
          });
          // console.log('line 281',this.state.requestsOfCurrentUser);
          $(document).scrollTop(0);
          $("#reqSent,#reqSent2").fadeIn(1000);
          $("#reqSent,#reqSent2").fadeOut(1000);
        });
        if (document.getElementById('findFriendByName') !== null) {
          document.getElementById('findFriendByName').value = '';
        }
      }
    }
  }, {
    key: 'listPendingFriendRequests',
    value: function listPendingFriendRequests() {
      var _this9 = this;

      // console.log('this should list friend reqs')
      $.post(Url + '/listRequests', function (e, f) {
        var g = [],
            h = [];


        for (var i = 0; i < e[0].length; i++) {
          var j = e[0][i].requestor,
              k = e[0][i].response;

          if (j !== e[1] && k === null) {
            g.push(e[0][i]);
          }
          if (j === e[1] && k !== null && e[0][i].requestee !== 'test') {
            h.push(e[0][i]);
          }
        }
        //

        _this9.setState({
          pendingFriendRequests: g,
          requestResponses: h
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(e) {
      var _this10 = this;

      this.setState({
        view: 'singleFriend',
        friendToFocusOn: e
      });

      $.get(Url + '/getFriendUserRatings', { friendName: e }, function (f) {
        _this10.setState({
          individualFriendsMovies: f
        });
      });
    }
  }, {
    key: 'listPotentials',
    value: function listPotentials() {
      // console.log('this should list potential friends')
    }
  }, {
    key: 'removeRequest',
    value: function removeRequest(e, f, g) {
      var h = this;
      $.ajax({
        url: Url + '/removeRequest',
        type: 'DELETE',
        data: {
          requestor: f,
          requestee: e,
          movie: g
        },
        success: function success(j) {
          h.listPendingFriendRequests();
        },
        error: function error(j) {}
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var e = React.createElement(Nav, { name: this.state.currentUser,
        find: this.findMovieBuddies,
        onClick: this.changeViews,
        logout: this.logout
      });

      if (this.state.view === 'Login') {
        return React.createElement(LogIn, { changeViews: this.changeViews, setCurrentUser: this.setCurrentUser });
      } else if (this.state.view === "SignUp") {
        return React.createElement(SignUp, { changeViews: this.changeViews, setCurrentUser: this.setCurrentUser });
      }
      //this view is added for moviesearch rendering
      else if (this.state.view === "MovieSearchView") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              e
            ),
            React.createElement(
              'div',
              null,
              React.createElement(MovieRating, {
                handleSearchMovie: this.getMovie,
                movie: this.state.movie
              })
            )
          );
        } else if (this.state.view === "Inbox") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies,
              onClick: this.changeViews,
              logout: this.logout,
              Home: !0
            }),
            React.createElement(Inbox, {
              requests: this.state.pendingFriendRequests,
              responsesAnswered: this.state.requestResponses,
              logout: this.logout,
              accept: this.acceptFriend,
              decline: this.declineFriend,
              listRequests: this.listPendingFriendRequests,
              pplWhoWantToBeFriends: this.state.pendingFriendRequests.map(function (a) {
                return [a.requestor, a.requestTyp, a.movie === null ? "" : a.movie, "Message:" + a.message === 'null' ? "none" : a.message];
              }),
              remove: this.removeRequest
            })
          );
        } else if (this.state.view === "Friends") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(Friends, {
              sendWatchRequest: this.sendWatchRequest,
              fof: this.focusOnFriend,
              getFriends: this.getCurrentFriends,
              myFriends: this.state.myFriends,
              listPotentials: this.listPotentials,
              logout: this.logout,
              sendRequest: this.sendRequest
            })
          );
        } else if (this.state.view === "Home") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(Home, {
              change: this.changeViewsMovie
            })
          );
        } else if (this.state.view === "SingleMovie") {
          var f = this;
          return React.createElement(
            'div',
            { onClick: function onClick() {
                return void 0;
              } },
            e,
            React.createElement(SingleMovieRating, {
              compatibility: this.state.myFriends,
              currentMovie: this.state.movie,
              change: this.changeViewsFriends,
              fof: this.focusOnFriend
            })
          );
        } else if (this.state.view === 'singleFriend') {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(SingleFriend, {
              moviesOfFriend: this.state.individualFriendsMovies,
              friendName: this.state.friendToFocusOn,
              onClick: this.changeViews,
              change: this.changeViewsMovie
            })
          );
        } else if (this.state.view === "FNMB") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(FindMovieBuddy, {

              buddyfunc: this.buddyRequest,
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(MyRatings, {
              change: this.changeViewsMovie
            })
          );
        }
    }
  }]);

  return d;
}(React.Component);

window.App = App;

var Url = 'https://reelfriendz.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibGlzdFBvdGVudGlhbHMiLCJsb2dvdXQiLCJzZW5kUmVxdWVzdCIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJnZXRNb3ZpZSIsImFjY2VwdEZyaWVuZCIsImRlY2xpbmVGcmllbmQiLCJjaGFuZ2VWaWV3c01vdmllIiwiY2hhbmdlVmlld3NGcmllbmRzIiwiZmluZE1vdmllQnVkZGllcyIsImJ1ZGR5UmVxdWVzdCIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJmb2N1c09uRnJpZW5kIiwicmVtb3ZlUmVxdWVzdCIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsInRoYXQiLCJyZXNwIiwiZXJyIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsImZyaWVuZHMyIiwicmVxdWVzdHNPZkN1cnJlbnRVc2VyIiwiaW5kZXhPZiIsInNjcm9sbFRvcCIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsInJlcXVlc3RSZXNwb25zZXMiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsIm1hcCIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNNQSxHOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYUMsYUFBYjtBQUNBLE1BQUtDLGdCQUFMLEdBQXNCLEVBQUtBLGdCQUFMLENBQXNCQyxJQUF0QixHQUF0QjtBQUNBLE1BQUtDLFVBQUwsR0FBZ0IsRUFBS0MsaUJBQUwsQ0FBdUJGLElBQXZCLEdBQWhCO0FBQ0EsTUFBS0csU0FBTCxHQUFlLEVBQUtOLEtBQUwsQ0FBV00sU0FBMUI7QUFDQSxNQUFLQyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JKLElBQXBCLEdBQXBCO0FBQ0EsTUFBS0ssTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUwsSUFBWixHQUFaO0FBQ0EsTUFBS00sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTixJQUFqQixHQUFqQjtBQUNBO0FBQ0EsTUFBS08sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCUCxJQUFqQixHQUFqQjtBQUNBLE1BQUtRLGNBQUwsR0FBb0IsRUFBS0EsY0FBTCxDQUFvQlIsSUFBcEIsR0FBcEI7QUFDQSxNQUFLUyxRQUFMLEdBQWMsRUFBS0EsUUFBTCxDQUFjVCxJQUFk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QURMO0FBRUUsZ0NBQUMsWUFBRDtBQUNFLDhCQUFnQixLQUFLOUYsS0FBTCxDQUFXdUYsdUJBRDdCO0FBRUUsMEJBQVksS0FBS3ZGLEtBQUwsQ0FBV2tFLGVBRnpCO0FBR0UsdUJBQVMsS0FBS3hELFdBSGhCO0FBSUUsc0JBQVEsS0FBS0s7QUFKZjtBQUZGLFdBREY7QUFXRCxTQVpNLE1BWUEsSUFBSSxLQUFLZixLQUFMLENBQVc2QyxJQUFYLEtBQW9CLE1BQXhCLEVBQWdDO0FBQ3JDLGlCQUNFO0FBQUE7QUFBQTtBQUNLaUQsYUFETDtBQUVFLGdDQUFDLGNBQUQ7O0FBRUUseUJBQVcsS0FBSzVFLFlBRmxCO0FBR0UsdUJBQVMsS0FBS2xCLEtBQUwsQ0FBVzhDO0FBSHRCO0FBRkYsV0FERjtBQVVELFNBWE0sTUFXQSxJQUFJLEtBQUs5QyxLQUFMLENBQVc2QyxJQUFYLEtBQW9CLFdBQXhCLEVBQXFDO0FBQzFDLGlCQUNFO0FBQUE7QUFBQTtBQUNLaUQsYUFETDtBQUVFLGdDQUFDLFNBQUQ7QUFDRSxzQkFBUSxLQUFLL0U7QUFEZjtBQUZGLFdBREY7QUFRRDtBQUNGOzs7O0VBdmRlbUYsTUFBTUMsUzs7QUEwZHhCQyxPQUFPdEcsR0FBUCxHQUFhQSxHQUFiOztBQUVBLElBQUkwQixNQUFNLG1DQUFWO0FBQ0E7QUFDQTRFLE9BQU81RSxHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0gc3RhcnRpbmdTdGF0ZTtcclxuICAgIHRoaXMuc2VuZFdhdGNoUmVxdWVzdD10aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0RnJpZW5kcz10aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm15RnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIHRoaXMubGlzdFBvdGVudGlhbHM9dGhpcy5saXN0UG90ZW50aWFscy5iaW5kKHRoaXMpOyBcclxuICAgIHRoaXMubG9nb3V0PXRoaXMubG9nb3V0LmJpbmQodGhpcykgIFxyXG4gICAgdGhpcy5zZW5kUmVxdWVzdD10aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICAvL3RoaXMub25DbGljaz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFjY2VwdEZyaWVuZD0gdGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIC8vdGhpcy5kZWNsaW5lPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgLy90aGlzLmxpc3RSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIC8vdGhpcy5yZW1vdmU9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzTW92aWU9dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyk7XHJcbiAgICAvL3RoaXMuYnVkZHlmdW5jPXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVtb3ZlUmVxdWVzdD10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGVzdGluZ2dnJyk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LCAoYSwgYikgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2hhdCB5b3UgZ2V0IGJhY2sgZnJvbSBzZXJ2ZXIgZm9yIGdldCBmcmllbmRzJyxhLGIpO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgIGFbaV1bMV0gPSBcIk5vIGNvbXBhcmlzb24gdG8gYmUgbWFkZVwiO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgIGNvbnN0IGZpbmFsPSBhLnNvcnQoKGEsYik9PntyZXR1cm4gYlsxXS1hWzFdfSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxyXG4gICAgICB9KVxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhlcyBhcmUgbXkgZnJpZW5kcyEhISEhISEhISEhISEhISEhJyx0aGlzLnN0YXRlLm15RnJpZW5kcylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBhY2NlcHRGcmllbmQocGVyc29uVG9BY2NlcHQsIG1vdmllKSB7XHJcbiAgICAvLyAkKCdidXR0b24nKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XHJcbiAgICAvLyB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coZmluYWwgKydzaG91bGQgYmUgYWNjZXB0ZWQsIGZvciBtb3ZpZS4uLi4nLCBtb3ZpZSlcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoKGEsYik9PihiWzFdLWFbMV0pKTtcclxuICAgICAgY29uc3QgbXlGcmllbmRzPXRoYXQubXlGcmllbmRzO1xyXG4gICAgICAgY29uc3QgdW5pcXVlRnJpZW5kcz1bXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTxzb3J0ZWQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBsZXQgdW5pcXVlPXRydWU7XHJcbiAgICAgICAgICBmb3IgKGxldCB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xyXG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XHJcbiAgICAgICAgICAgIHVuaXF1ZUZyaWVuZHMucHVzaChzb3J0ZWRbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubXlGcmllbmRzLHRoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzKTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oKCk9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goKCk9PiB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgbGV0IG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIkhvbWVcIixcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGlzLnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxyXG4gICAgfSkuY2F0Y2goZXJyPT4ge2NvbnNvbGUubG9nKGVycil9KTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZShzdGFydGluZ1N0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZFdhdGNoUmVxdWVzdChmcmllbmQpIHtcclxuICAgIGNvbnN0IG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XHJcbiAgICBjb25zdCB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcclxuICAgIGlmIChtb3ZpZS5sZW5ndGgpIHtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9tb3ZpZSByZW5kZXJcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cclxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcclxuICBnZXRNb3ZpZShxdWVyeSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIG1vdmllID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cobW92aWUpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XHJcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XHJcbiAgc2hvd01vdmllKG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9OYXYgY2hhbmdlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIC8vdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdIb21lJyl7XHJcbiAgICAgIC8vIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XHJcbiAgICAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKVxyXG4gICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBjaGFuZ2VWaWV3c01vdmllKHRhcmdldFN0YXRlLCBtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVmlld3NGcmllbmRzKHRhcmdldFN0YXRlLCBmcmllbmQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGJ1ZGR5UmVxdWVzdChwZXJzb24sIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2cocGVyc29uLCBpZHgpO1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24sIGlkeCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0eXBlb2YgYSk7XHJcbiAgICBpZiAodHlwZW9mIGE9PT1cIm9iamVjdFwiKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlO1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAxJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAyJyk7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9W107XHJcbiAgICBjb25zdCBmcmllbmRzMj1bXVxyXG4gICAgZm9yICh2YXIgaT0wO2k8Y3VyckZyaWVuZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5lIDI1MScsY3VyckZyaWVuZHNbaV0pXHJcbiAgICAgIGZyaWVuZHMxLnB1c2goY3VyckZyaWVuZHNbaV1bMF0pO1xyXG4gICAgICBmcmllbmRzMi5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygndG9mJyxmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEsIGZyaWVuZHMxLmxlbmd0aCE9PTApXHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuLy8gY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5lIDI4MScsdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIpO1xyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJywgKHJlc3BvbnNlLCBlcnJvcik9PiB7XHJcbiAgICAgIGNvbnN0IHBGUj1bXTtcclxuICAgICAgY29uc3QgclI9W107XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgdG8gbHBmcicsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGk9MDtpPHJlc3BvbnNlWzBdLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3Rvcj1yZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ107XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VUVT0gcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ107XHJcbiAgICAgICAgaWYgKHJlcXVlc3RvciE9PXJlc3BvbnNlWzFdICYmIHJlc3BvbnNlVFU9PT1udWxsICl7XHJcbiAgICAgICAgICBwRlIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0b3I9PT1yZXNwb25zZVsxXSAmJnJlc3BvbnNlVFUhPT1udWxsICYmIHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0ZWUnXSE9PSd0ZXN0Jyl7XHJcbiAgICAgICAgICByUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy9cclxuY29uc29sZS5sb2coXCJub3RpZnMhXCIscEZSLCByUik7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpwRlIsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpyUlxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcclxuICAgIFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycse2ZyaWVuZE5hbWU6IGZyaWVuZH0sIHJlc3BvbnNlPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgbGlzdFBvdGVudGlhbHMoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBwb3RlbnRpYWwgZnJpZW5kcycpXHJcbiAgfVxyXG5cclxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcmVtIHJlcScpO1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xyXG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG5hdj08TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gXHJcbiAgICAgICAgICAgIC8+XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcclxuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfSAvPik7XHJcbiAgICB9IFxyXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XHJcbiAgICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxkaXY+IFxyXG4gICAgICAgICAgPGRpdj57bmF2fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWV9XHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHN9IFxyXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxyXG4gICAgICAgICAgICAgICAgYT0+KCBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXSkpfSBcclxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZH0gXHJcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHN9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHN9IFxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEhvbWUgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XHJcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kc31cclxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmR9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxyXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXHJcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcclxuXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3R9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxuXHJcbnZhciBVcmwgPSAnaHR0cHM6Ly9yZWVsZnJpZW5kei5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsXHJcbiJdfQ==