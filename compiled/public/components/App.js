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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJidWRkeVJlcXVlc3QiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwiZm9jdXNPbkZyaWVuZCIsInJlbW92ZVJlcXVlc3QiLCIkIiwicG9zdCIsIlVybCIsInRlc3QiLCJhIiwiYiIsImkiLCJsZW5ndGgiLCJmaW5hbCIsInNvcnQiLCJzZXRTdGF0ZSIsInBlcnNvblRvQWNjZXB0IiwibW92aWUiLCJ0aGF0IiwicmVzcCIsImVyciIsInBlcnNvblRvRGVjbGluZSIsImR1bW15Iiwic29ydGVkIiwidW5pcXVlRnJpZW5kcyIsInVuaXF1ZSIsIngiLCJwdXNoIiwidmlldyIsInBvdGVudGlhbE1vdmllQnVkZGllcyIsInVzZXJuYW1lIiwiY3VycmVudFVzZXIiLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJmcmllbmRzUmF0aW5ncyIsInJlc3BvbnNlIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImZyaWVuZFRvRm9jdXNPbiIsInBlcnNvbiIsImlkeCIsImN1cnJGcmllbmRzIiwiZnJpZW5kczEiLCJtYXAiLCJmcmllbmRJbmZvIiwicmVxdWVzdHNPZkN1cnJlbnRVc2VyIiwiZm9yRWFjaCIsInJlcSIsImluZGV4T2YiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlcXVlc3RvciIsInJlc3BvbnNlVFUiLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiZ2V0IiwiZnJpZW5kTmFtZSIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwic2VsZiIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJuYXYiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsImxpc3RQb3RlbnRpYWxzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNNQSxHOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYUMsYUFBYjtBQUNBLE1BQUtDLGdCQUFMLEdBQXNCLEVBQUtBLGdCQUFMLENBQXNCQyxJQUF0QixHQUF0QjtBQUNBLE1BQUtDLFVBQUwsR0FBZ0IsRUFBS0MsaUJBQUwsQ0FBdUJGLElBQXZCLEdBQWhCO0FBQ0EsTUFBS0csU0FBTCxHQUFlLEVBQUtOLEtBQUwsQ0FBV00sU0FBMUI7QUFDQSxNQUFLQyxNQUFMLEdBQVksRUFBS0EsTUFBTCxDQUFZSixJQUFaLEdBQVo7QUFDQSxNQUFLSyxXQUFMLEdBQWlCLEVBQUtBLFdBQUwsQ0FBaUJMLElBQWpCLEdBQWpCO0FBQ0EsTUFBS00sV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTixJQUFqQixHQUFqQjtBQUNBLE1BQUtPLGNBQUwsR0FBb0IsRUFBS0EsY0FBTCxDQUFvQlAsSUFBcEIsR0FBcEI7QUFDQSxNQUFLUSxRQUFMLEdBQWMsRUFBS0EsUUFBTCxDQUFjUixJQUFkLEdBQWQ7QUFDQSxNQUFLUyxZQUFMLEdBQW1CLEVBQUtBLFlBQUws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QSxJQUFJLEtBQUtkLEtBQUwsQ0FBVzRDLElBQVgsS0FBb0IsTUFBeEIsRUFBZ0M7QUFDckMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0tvRCxhQURMO0FBRUUsZ0NBQUMsY0FBRDtBQUNFLHlCQUFXLEtBQUsvRSxZQURsQjtBQUVFLHVCQUFTLEtBQUtqQixLQUFMLENBQVc2QztBQUZ0QjtBQUZGLFdBREY7QUFTRCxTQVZNLE1BVUEsSUFBSSxLQUFLN0MsS0FBTCxDQUFXNEMsSUFBWCxLQUFvQixXQUF4QixFQUFxQztBQUMxQyxpQkFDRTtBQUFBO0FBQUE7QUFDS29ELGFBREw7QUFFRSxnQ0FBQyxTQUFEO0FBQ0Usc0JBQVEsS0FBS2xGO0FBRGY7QUFGRixXQURGO0FBUUQ7QUFDRjs7OztFQTVjZXNGLE1BQU1DLFM7O0FBK2N4QkMsT0FBT3hHLEdBQVAsR0FBYUEsR0FBYjs7QUFFQSxJQUFJeUIsTUFBTSxtQ0FBVjtBQUNBO0FBQ0ErRSxPQUFPL0UsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhcnRpbmdTdGF0ZTtcclxuICAgIHRoaXMuc2VuZFdhdGNoUmVxdWVzdD10aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0RnJpZW5kcz10aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm15RnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIHRoaXMubG9nb3V0PXRoaXMubG9nb3V0LmJpbmQodGhpcykgIFxyXG4gICAgdGhpcy5zZW5kUmVxdWVzdD10aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFjY2VwdEZyaWVuZD0gdGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVjbGluZUZyaWVuZD10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NNb3ZpZT10aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NGcmllbmRzPXRoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXM9dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJ1ZGR5UmVxdWVzdD10aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5mb2N1c09uRnJpZW5kPXRoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmVSZXF1ZXN0PXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydCgoYSxiKT0+e3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgR0NGIGlzIHNldHRpbmcgYXMgYWxsIGZyaWVuZHMnLCBmaW5hbCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxyXG4gICAgICB9KVxyXG4gICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhpcy5zdGF0ZS5teUZyaWVuZHMpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICBcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoKGEsYik9PihiWzFdLWFbMV0pKTtcclxuICAgICAgY29uc3QgbXlGcmllbmRzPXRoYXQubXlGcmllbmRzO1xyXG4gICAgICAgY29uc3QgdW5pcXVlRnJpZW5kcz1bXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTxzb3J0ZWQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBsZXQgdW5pcXVlPXRydWU7XHJcbiAgICAgICAgICBmb3IgKGxldCB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xyXG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XHJcbiAgICAgICAgICAgIHVuaXF1ZUZyaWVuZHMucHVzaChzb3J0ZWRbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgLy90aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbiwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyhwZXJzb24sIGlkeCk7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbiwgaWR4KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kUmVxdWVzdChhLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcclxuICAgIGlmICh0eXBlb2YgYT09PVwib2JqZWN0XCIpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDInKTtcclxuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9Y3VyckZyaWVuZHMubWFwKGZyaWVuZEluZm89PihmcmllbmRJbmZvWzBdKSk7XHJcbiAgICB0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5mb3JFYWNoKHJlcT0+e1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHJlcSk7XHJcbiAgICB9KVxyXG4gICAgXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycscGVyc29uLCBjdXJyRnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuICAgIGNvbnNvbGUubG9nKCd0aGVzZSBzaG91bGQgYmUgbXkgY3VycmVudCBmcmllbmRzIGFuZCBpbk1lbSByZXF1ZXN0cyBhbmQgSSBzaG91bGQgbm90IGJlIGFibGUgb3Qgc2VuZCB0byB0aGVtJywgZnJpZW5kczEpO1xyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgIGNvbnNvbGUubG9nKCdjYXNlIGNhdWdodCAyNTQnKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuLy8gY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICBjb25zb2xlLmxvZygnc2hvdWxkIGluY2x1ZGUgZXZlcnlib2R5IHRvIHdob20gYSByZXEgaGFzIGV2ZXIgYmVlbiBzZW50LCBzaG9ydCBvZiBtb3N0IHJlY2VudCcsIHJlc3ApO1xyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgaWYgKHJlc3AuaW5kZXhPZihwZXJzb24pPi0xKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nhc2UgY2F1Z2h0IDI3MicpXHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcclxuICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdGFsaXR5IG9mIGluYm94XCIscEZSLCByUik7XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLCB7ZnJpZW5kTmFtZTogZnJpZW5kfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcmVtIHJlcScpO1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xyXG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG5hdj08TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gXHJcbiAgICAgICAgICAgIC8+XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcclxuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfSAvPik7XHJcbiAgICB9IFxyXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XHJcbiAgICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxkaXY+IFxyXG4gICAgICAgICAgPGRpdj57bmF2fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWV9XHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHN9IFxyXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxyXG4gICAgICAgICAgICAgICAgYT0+KCBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXSkpfSBcclxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZH0gXHJcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHN9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHN9IFxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEhvbWUgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XHJcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kc31cclxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmR9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxyXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXHJcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcclxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuQXBwID0gQXBwO1xyXG5cclxudmFyIFVybCA9ICdodHRwczovL3JlZWxmcmllbmR6Lmhlcm9rdWFwcC5jb20nO1xyXG4vLyB2YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XHJcbndpbmRvdy5VcmwgPSBVcmxcclxuIl19