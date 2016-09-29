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
          h = g.map(function (j) {
        return j[0];
      });

      this.state.requestsOfCurrentUser.forEach(function (j) {
        h.push(j);
      });

      // console.log('this should also be my friends',person, currFriends,friends1,friends2)

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
        $.post(Url + '/sendRequest', { name: f }, function (j, k) {

          $(document).scrollTop(0);
          if (f.indexOf(j) > -1) {
            $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
            $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);
          } else {
            $("#reqSent,#reqSent2").fadeIn(1000);
            $("#reqSent,#reqSent2").fadeOut(1000);
          }

          _this8.setState({
            requestsOfCurrentUser: j.concat([f])
          });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibGlzdFBvdGVudGlhbHMiLCJsb2dvdXQiLCJzZW5kUmVxdWVzdCIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJnZXRNb3ZpZSIsImFjY2VwdEZyaWVuZCIsImRlY2xpbmVGcmllbmQiLCJjaGFuZ2VWaWV3c01vdmllIiwiY2hhbmdlVmlld3NGcmllbmRzIiwiZmluZE1vdmllQnVkZGllcyIsImJ1ZGR5UmVxdWVzdCIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJmb2N1c09uRnJpZW5kIiwicmVtb3ZlUmVxdWVzdCIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsInRoYXQiLCJyZXNwIiwiZXJyIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsIm1hcCIsImZyaWVuZEluZm8iLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJmb3JFYWNoIiwicmVxIiwiaW5kZXhPZiIsInNjcm9sbFRvcCIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsInJlcXVlc3RSZXNwb25zZXMiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNNQSxHOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYUMsYUFBYjtBQUNBLE1BQUtDLGdCQUFMLEdBQXNCLEVBQUtBLGdCQUFMLENBQXNCQyxJQUF0QixHQUF0QjtBQUNBLE1BQUtDLFVBQUwsR0FBZ0IsRUFBS0MsaUJBQUwsQ0FBdUJGLElBQXZCLEdBQWhCO0FBQ0EsTUFBS0csU0FBTCxHQUFlLEVBQUtOLEtBQUwsQ0FBV00sU0FBMUI7QUFDQSxNQUFLQyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JKLElBQXBCLEdBQXBCO0FBQ0EsTUFBS0ssTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUwsSUFBWixHQUFaO0FBQ0EsTUFBS00sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTixJQUFqQixHQUFqQjtBQUNBO0FBQ0EsTUFBS08sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCUCxJQUFqQixHQUFqQjtBQUNBLE1BQUtRLGNBQUwsR0FBb0IsRUFBS0EsY0FBTCxDQUFvQlIsSUFBcEIsR0FBcEI7QUFDQSxNQUFLUyxRQUFMLEdBQWMsRUFB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RyxLQUFMLENBQVcwRix1QkFEN0I7QUFFRSwwQkFBWSxLQUFLMUYsS0FBTCxDQUFXa0UsZUFGekI7QUFHRSx1QkFBUyxLQUFLeEQsV0FIaEI7QUFJRSxzQkFBUSxLQUFLSztBQUpmO0FBRkYsV0FERjtBQVdELFNBWk0sTUFZQSxJQUFJLEtBQUtmLEtBQUwsQ0FBVzZDLElBQVgsS0FBb0IsTUFBeEIsRUFBZ0M7QUFDckMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0tvRCxhQURMO0FBRUUsZ0NBQUMsY0FBRDtBQUNFLHlCQUFXLEtBQUsvRSxZQURsQjtBQUVFLHVCQUFTLEtBQUtsQixLQUFMLENBQVc4QztBQUZ0QjtBQUZGLFdBREY7QUFTRCxTQVZNLE1BVUEsSUFBSSxLQUFLOUMsS0FBTCxDQUFXNkMsSUFBWCxLQUFvQixXQUF4QixFQUFxQztBQUMxQyxpQkFDRTtBQUFBO0FBQUE7QUFDS29ELGFBREw7QUFFRSxnQ0FBQyxTQUFEO0FBQ0Usc0JBQVEsS0FBS2xGO0FBRGY7QUFGRixXQURGO0FBUUQ7QUFDRjs7OztFQXpkZXFGLE1BQU1DLFM7O0FBNGR4QkMsT0FBT3hHLEdBQVAsR0FBYUEsR0FBYjs7QUFFQSxJQUFJMEIsTUFBTSxtQ0FBVjtBQUNBO0FBQ0E4RSxPQUFPOUUsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcbiAgICB0aGlzLnNlbmRXYXRjaFJlcXVlc3Q9dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZyaWVuZHM9dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5teUZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICB0aGlzLmxpc3RQb3RlbnRpYWxzPXRoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKTsgXHJcbiAgICB0aGlzLmxvZ291dD10aGlzLmxvZ291dC5iaW5kKHRoaXMpICBcclxuICAgIHRoaXMuc2VuZFJlcXVlc3Q9dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgLy90aGlzLm9uQ2xpY2s9dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3cz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldEN1cnJlbnRVc2VyPXRoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0TW92aWU9dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hY2NlcHRGcmllbmQ9IHRoaXMuYWNjZXB0RnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICAvL3RoaXMuZGVjbGluZT10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVjbGluZUZyaWVuZD10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIC8vdGhpcy5saXN0UmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICAvL3RoaXMucmVtb3ZlPXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c01vdmllPXRoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgLy90aGlzLmJ1ZGR5ZnVuYz10aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHM9dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZE1vdmllQnVkZGllcz10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlSZXF1ZXN0PXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvY3VzT25GcmllbmQ9dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZVJlcXVlc3Q9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSwgKGEsIGIpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcclxuICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICBjb25zdCBmaW5hbD0gYS5zb3J0KChhLGIpPT57cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBteUZyaWVuZHM6ZmluYWxcclxuICAgICAgfSlcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhpcy5zdGF0ZS5teUZyaWVuZHMpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0RnJpZW5kKHBlcnNvblRvQWNjZXB0LCBtb3ZpZSkge1xyXG4gICAgLy8gJCgnYnV0dG9uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coJCh0aGlzKS5odG1sKCkpO1xyXG4gICAgLy8gfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsICsnc2hvdWxkIGJlIGFjY2VwdGVkLCBmb3IgbW92aWUuLi4uJywgbW92aWUpXHJcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBhRicpO1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2FjY2VwdCcse3BlcnNvblRvQWNjZXB0OnBlcnNvblRvQWNjZXB0LCBtb3ZpZTogbW92aWV9LChyZXNwLGVycik9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpdCBjYW1lIGJhY2shJywgdGhhdCk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXHJcbiAgfVxyXG5cclxuICBkZWNsaW5lRnJpZW5kKHBlcnNvblRvRGVjbGluZSwgbW92aWUpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOnBlcnNvblRvRGVjbGluZSwgbW92aWU6IG1vdmllfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN0YXRlIGFmdGVyIGRlY2xpbmluZyBmcmllbmQsICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZE1vdmllQnVkZGllcygpIHtcclxuICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zdCBzb3J0ZWQ9cmVzcC5zb3J0KChhLGIpPT4oYlsxXS1hWzFdKSk7XHJcbiAgICAgIGNvbnN0IG15RnJpZW5kcz10aGF0Lm15RnJpZW5kcztcclxuICAgICAgIGNvbnN0IHVuaXF1ZUZyaWVuZHM9W107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8c29ydGVkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgbGV0IHVuaXF1ZT10cnVlO1xyXG4gICAgICAgICAgZm9yIChsZXQgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICBpZiAoc29ydGVkW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcclxuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1bmlxdWUpe1xyXG4gICAgICAgICAgICB1bmlxdWVGcmllbmRzLnB1c2goc29ydGVkW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiRk5NQlwiLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp1bmlxdWVGcmllbmRzXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm15RnJpZW5kcyx0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VWaWV3KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xyXG4gICAgLy8gY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKCgpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcclxuICAgIH0pLmNhdGNoKCgpPT4ge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcclxuICAgIGxldCBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhpcy5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuICAgIH0pLmNhdGNoKGVycj0+IHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhcnRpbmdTdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XHJcbiAgICBjb25zdCBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xyXG4gICAgY29uc3QgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XHJcbiAgICBpZiAobW92aWUubGVuZ3RoKSB7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQsIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3AsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IG5lZWQgdG8gZW50ZXIgYSBtb3ZpZSB0byBzZW5kIGEgd2F0Y2ggcmVxdWVzdCEhISEnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vbW92aWUgcmVuZGVyXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXHJcbiAgLy93aGljaCBnZXRzIHBhc3NlZCBkb3duIHRvIHRoZSBNb3ZpZSBTZWFyY2ggXHJcbiAgZ2V0TW92aWUocXVlcnkpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCBtb3ZpZSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmllKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIk1vdmllU2VhcmNoVmlld1wiLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxyXG4gIC8vb250byB0aGUgc3RhdGV2aWV3IG9mIG1vdmllc2VhcmNodmlld1xyXG4gIHNob3dNb3ZpZShtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vTmF2IGNoYW5nZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXHJcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICAvL3RoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICAvLyB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBidWRkeVJlcXVlc3QocGVyc29uLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHBlcnNvbiwgaWR4KTtcclxuICAgIHRoaXMuc2VuZFJlcXVlc3QocGVyc29uLCBpZHgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEsIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2codHlwZW9mIGEpO1xyXG4gICAgaWYgKHR5cGVvZiBhPT09XCJvYmplY3RcIil7XHJcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZTtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMicpO1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPWN1cnJGcmllbmRzLm1hcCgoZnJpZW5kSW5mbyk9PihmcmllbmRJbmZvWzBdKSk7XHJcbiAgICB0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5mb3JFYWNoKChyZXEpPT57XHJcbiAgICAgIGZyaWVuZHMxLnB1c2gocmVxKVxyXG4gICAgfSlcclxuICAgIFxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcbiAgICBjb25zb2xlLmxvZygndGhlc2Ugc2hvdWxkIGJlIG15IGN1cnJlbnQgZnJpZW5kcywgYW5kIEkgc2hvdWxkIG5vdCBiZSBhYmxlIG90IHNlbmQgdG8gdGhlbScsIGZyaWVuZHMxKTtcclxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XHJcbiAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcclxuICAgIH0gZWxzZSBpZiAoIXBlcnNvbi5sZW5ndGgpIHtcclxuICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4vLyBjb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgaW5jbHVkZSBldmVyeWJvZHkgdG8gd2hvbSBhIHJlcSBoYXMgZXZlciBiZWVuIHNlbnQsIHNob3J0IG9mIG1vc3QgcmVjZW50JywgcmVzcCk7XHJcblxyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgaWYgKHBlcnNvbi5pbmRleE9mKHJlc3ApPi0xKXtcclxuICAgICAgICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpyZXNwLmNvbmNhdChbcGVyc29uXSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIGlmICggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcclxuICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdGFsaXR5IG9mIGluYm94XCIscEZSLCByUik7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZT0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIGxpc3RQb3RlbnRpYWxzKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XHJcbiAgICBjb25zb2xlLmxvZygndHJ5aW5nIHRvIHJlbSByZXEnKTtcclxuICAgIHZhciB0aGF0PSB0aGlzO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcclxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcclxuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBuYXY9PE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9IFxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XHJcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0vPik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcclxuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+e25hdn08L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaE1vdmllPXt0aGlzLmdldE1vdmllfVxyXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSW5ib3hcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH1cclxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8SW5ib3ggXHJcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICAgIGFjY2VwdD0ge3RoaXMuYWNjZXB0RnJpZW5kfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGxpc3RSZXF1ZXN0cz17dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzfSBcclxuICAgICAgICAgICAgICBwcGxXaG9XYW50VG9CZUZyaWVuZHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzLm1hcChcclxuICAgICAgICAgICAgICAgIGE9PiggW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV0pKX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3R9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGcmllbmRzIFxyXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3R9IFxyXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmR9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzfSBcclxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXHJcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzfSBcclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxIb21lIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxyXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHN9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcclxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxyXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3R9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxuXHJcbnZhciBVcmwgPSAnaHR0cHM6Ly9yZWVsZnJpZW5kei5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsXHJcbiJdfQ==