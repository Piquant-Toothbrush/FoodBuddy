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
    f.changeViews = f.changeViews.bind(f);
    f.setCurrentUser = f.setCurrentUser.bind(f);
    f.getMovie = f.getMovie.bind(f);
    f.acceptFriend = f.acceptFriend.bind(f);
    f.declineFriend = f.declineFriend.bind(f);
    f.changeViewsMovie = f.changeViewsMovie.bind(f);
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
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(e, f) {
      var g = this;
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

        _this3.getCurrentFriends();
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
          if (j.indexOf(f) > -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibGlzdFBvdGVudGlhbHMiLCJsb2dvdXQiLCJzZW5kUmVxdWVzdCIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJnZXRNb3ZpZSIsImFjY2VwdEZyaWVuZCIsImRlY2xpbmVGcmllbmQiLCJjaGFuZ2VWaWV3c01vdmllIiwiY2hhbmdlVmlld3NGcmllbmRzIiwiZmluZE1vdmllQnVkZGllcyIsImJ1ZGR5UmVxdWVzdCIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJmb2N1c09uRnJpZW5kIiwicmVtb3ZlUmVxdWVzdCIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsInRoYXQiLCJyZXNwIiwiZXJyIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsIm1hcCIsImZyaWVuZEluZm8iLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJmb3JFYWNoIiwicmVxIiwiaW5kZXhPZiIsInNjcm9sbFRvcCIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsInJlcXVlc3RSZXNwb25zZXMiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNNQSxHOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYUMsYUFBYjtBQUNBLE1BQUtDLGdCQUFMLEdBQXNCLEVBQUtBLGdCQUFMLENBQXNCQyxJQUF0QixHQUF0QjtBQUNBLE1BQUtDLFVBQUwsR0FBZ0IsRUFBS0MsaUJBQUwsQ0FBdUJGLElBQXZCLEdBQWhCO0FBQ0EsTUFBS0csU0FBTCxHQUFlLEVBQUtOLEtBQUwsQ0FBV00sU0FBMUI7QUFDQSxNQUFLQyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JKLElBQXBCLEdBQXBCO0FBQ0EsTUFBS0ssTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUwsSUFBWixHQUFaO0FBQ0EsTUFBS00sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTixJQUFqQixHQUFqQjtBQUNBLE1BQUtPLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQlAsSUFBakIsR0FBakI7QUFDQSxNQUFLUSxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JSLElBQXBCLEdBQXBCO0FBQ0EsTUFBS1MsUUFBTCxHQUFjLEVBQUtBLFFB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LFdBSGhCO0FBSUUsc0JBQVEsS0FBS0s7QUFKZjtBQUZGLFdBREY7QUFXRCxTQVpNLE1BWUEsSUFBSSxLQUFLZixLQUFMLENBQVc2QyxJQUFYLEtBQW9CLE1BQXhCLEVBQWdDO0FBQ3JDLGlCQUNFO0FBQUE7QUFBQTtBQUNLb0QsYUFETDtBQUVFLGdDQUFDLGNBQUQ7QUFDRSx5QkFBVyxLQUFLL0UsWUFEbEI7QUFFRSx1QkFBUyxLQUFLbEIsS0FBTCxDQUFXOEM7QUFGdEI7QUFGRixXQURGO0FBU0QsU0FWTSxNQVVBLElBQUksS0FBSzlDLEtBQUwsQ0FBVzZDLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0tvRCxhQURMO0FBRUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUtsRjtBQURmO0FBRkYsV0FERjtBQVFEO0FBQ0Y7Ozs7RUE3Y2VxRixNQUFNQyxTOztBQWdkeEJDLE9BQU94RyxHQUFQLEdBQWFBLEdBQWI7O0FBRUEsSUFBSTBCLE1BQU0sbUNBQVY7QUFDQTtBQUNBOEUsT0FBTzlFLEdBQVAsR0FBYUEsR0FBYiIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcbiAgICB0aGlzLnNlbmRXYXRjaFJlcXVlc3Q9dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZyaWVuZHM9dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5teUZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICB0aGlzLmxpc3RQb3RlbnRpYWxzPXRoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKTsgXHJcbiAgICB0aGlzLmxvZ291dD10aGlzLmxvZ291dC5iaW5kKHRoaXMpICBcclxuICAgIHRoaXMuc2VuZFJlcXVlc3Q9dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3cz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldEN1cnJlbnRVc2VyPXRoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0TW92aWU9dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hY2NlcHRGcmllbmQ9IHRoaXMuYWNjZXB0RnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRlY2xpbmVGcmllbmQ9dGhpcy5kZWNsaW5lRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzTW92aWU9dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVtb3ZlUmVxdWVzdD10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG5cclxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGVzdGluZ2dnJyk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LCAoYSwgYikgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2hhdCB5b3UgZ2V0IGJhY2sgZnJvbSBzZXJ2ZXIgZm9yIGdldCBmcmllbmRzJyxhLGIpO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgIGFbaV1bMV0gPSBcIk5vIGNvbXBhcmlzb24gdG8gYmUgbWFkZVwiO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgIGNvbnN0IGZpbmFsPSBhLnNvcnQoKGEsYik9PntyZXR1cm4gYlsxXS1hWzFdfSk7XHJcbiAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEdDRiBpcyBzZXR0aW5nIGFzIGFsbCBmcmllbmRzJywgZmluYWwpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBteUZyaWVuZHM6ZmluYWxcclxuICAgICAgfSlcclxuICAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBhY2NlcHRGcmllbmQocGVyc29uVG9BY2NlcHQsIG1vdmllKSB7XHJcbiAgXHJcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBhRicpO1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2FjY2VwdCcse3BlcnNvblRvQWNjZXB0OnBlcnNvblRvQWNjZXB0LCBtb3ZpZTogbW92aWV9LChyZXNwLGVycik9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpdCBjYW1lIGJhY2shJywgdGhhdCk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXHJcbiAgfVxyXG5cclxuICBkZWNsaW5lRnJpZW5kKHBlcnNvblRvRGVjbGluZSwgbW92aWUpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOnBlcnNvblRvRGVjbGluZSwgbW92aWU6IG1vdmllfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN0YXRlIGFmdGVyIGRlY2xpbmluZyBmcmllbmQsICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZE1vdmllQnVkZGllcygpIHtcclxuICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zdCBzb3J0ZWQ9cmVzcC5zb3J0KChhLGIpPT4oYlsxXS1hWzFdKSk7XHJcbiAgICAgIGNvbnN0IG15RnJpZW5kcz10aGF0Lm15RnJpZW5kcztcclxuICAgICAgIGNvbnN0IHVuaXF1ZUZyaWVuZHM9W107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8c29ydGVkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgbGV0IHVuaXF1ZT10cnVlO1xyXG4gICAgICAgICAgZm9yIChsZXQgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICBpZiAoc29ydGVkW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcclxuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1bmlxdWUpe1xyXG4gICAgICAgICAgICB1bmlxdWVGcmllbmRzLnB1c2goc29ydGVkW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiRk5NQlwiLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp1bmlxdWVGcmllbmRzXHJcbiAgICAgIH0pXHJcblxyXG4gICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKCk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oKCk9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goKCk9PiB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgbGV0IG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIkhvbWVcIixcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGlzLnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxyXG4gICAgfSkuY2F0Y2goZXJyPT4ge2NvbnNvbGUubG9nKGVycil9KTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZShzdGFydGluZ1N0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZFdhdGNoUmVxdWVzdChmcmllbmQpIHtcclxuICAgIGNvbnN0IG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XHJcbiAgICBjb25zdCB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcclxuICAgIGlmIChtb3ZpZS5sZW5ndGgpIHtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9tb3ZpZSByZW5kZXJcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cclxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcclxuICBnZXRNb3ZpZShxdWVyeSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIG1vdmllID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cobW92aWUpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XHJcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XHJcbiAgc2hvd01vdmllKG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9OYXYgY2hhbmdlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIC8vdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdIb21lJyl7XHJcbiAgICAgIC8vIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XHJcbiAgICAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKVxyXG4gICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBjaGFuZ2VWaWV3c01vdmllKHRhcmdldFN0YXRlLCBtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVmlld3NGcmllbmRzKHRhcmdldFN0YXRlLCBmcmllbmQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGJ1ZGR5UmVxdWVzdChwZXJzb24sIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2cocGVyc29uLCBpZHgpO1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24sIGlkeCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0eXBlb2YgYSk7XHJcbiAgICBpZiAodHlwZW9mIGE9PT1cIm9iamVjdFwiKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlO1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAxJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAyJyk7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPWN1cnJGcmllbmRzLm1hcChmcmllbmRJbmZvPT4oZnJpZW5kSW5mb1swXSkpO1xyXG4gICAgdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIuZm9yRWFjaChyZXE9PntcclxuICAgICAgZnJpZW5kczEucHVzaChyZXEpO1xyXG4gICAgfSlcclxuICAgIFxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcbiAgICBjb25zb2xlLmxvZygndGhlc2Ugc2hvdWxkIGJlIG15IGN1cnJlbnQgZnJpZW5kcyBhbmQgaW5NZW0gcmVxdWVzdHMgYW5kIEkgc2hvdWxkIG5vdCBiZSBhYmxlIG90IHNlbmQgdG8gdGhlbScsIGZyaWVuZHMxKTtcclxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XHJcbiAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICBjb25zb2xlLmxvZygnY2FzZSBjYXVnaHQgMjU0Jyk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHBlcnNvbiBpcyBhbHJlYWR5IGluIHRoZXJlISEnKVxyXG4gICAgfSBlbHNlIGlmICghcGVyc29uLmxlbmd0aCkge1xyXG4gICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuXHJcbi8vIGNvbnNvbGUubG9nKCdwZXJzb24gaXMgZGVmaW5lZD8nLHBlcnNvbik7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgIFxyXG4gICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBpbmNsdWRlIGV2ZXJ5Ym9keSB0byB3aG9tIGEgcmVxIGhhcyBldmVyIGJlZW4gc2VudCwgc2hvcnQgb2YgbW9zdCByZWNlbnQnLCByZXNwKTtcclxuICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgIGlmIChyZXNwLmluZGV4T2YocGVyc29uKT4tMSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYXNlIGNhdWdodCAyNzInKVxyXG4gICAgICAgICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IGZyaWVuZCByZXFzJylcclxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsIChyZXNwb25zZSwgZXJyb3IpPT4ge1xyXG4gICAgICBjb25zdCBwRlI9W107XHJcbiAgICAgIGNvbnN0IHJSPVtdO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRvIGxwZnInLCByZXNwb25zZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCByZXF1ZXN0b3I9cmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVFU9IHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0b3IhPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVRVPT09bnVsbCApe1xyXG4gICAgICAgICAgcEZSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdG9yPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVRVIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xyXG4gICAgICAgICAgclIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxpdHkgb2YgaW5ib3hcIixwRlIsIHJSKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpwRlIsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpyUlxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcclxuICAgIFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycsIHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byByZW0gcmVxJyk7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbmF2PTxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSBcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PntuYXZ9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZX1cclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0c30gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBhPT4oIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdKSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0fSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kc30gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFsc30gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3R9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0fSBcclxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxNeVJhdGluZ3MgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcblxyXG52YXIgVXJsID0gJ2h0dHBzOi8vcmVlbGZyaWVuZHouaGVyb2t1YXBwLmNvbSc7XHJcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcclxud2luZG93LlVybCA9IFVybFxyXG4iXX0=