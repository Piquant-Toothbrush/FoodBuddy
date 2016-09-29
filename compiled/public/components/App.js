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
    f.fof = f.focusOnFriend.bind(f);
    f.getFriends = f.getCurrentFriends.bind(f);
    f.myFriends = f.state.myFriends;
    f.listPotentials = f.listPotentials.bind(f);
    f.logout = f.logout.bind(f);
    f.sendRequest = f.sendRequest.bind(f);
    f.find = f.findMovieBuddies.bind(f);
    f.onClick = f.changeViews.bind(f);
    f.changeViews = f.changeViews.bind(f);
    f.setCurrentUser = f.setCurrentUser.bind(f);
    f.getMovie = f.getMovie.bind(f);
    f.logout = f.logout.bind(f);
    f.acceptFriend = f.acceptFriend.bind(f);
    f.decline = f.declineFriend.bind(f);
    f.declineFriend = f.declineFriend.bind(f);
    f.listRequests = f.listPendingFriendRequests.bind(f);
    f.remove = f.removeRequest.bind(f);
    f.changeViewsMovie = f.changeViewsMovie.bind(f);
    f.buddyfunc = f.buddyRequest.bind(f);
    f.changeViewsFriends = f.changeViewsFriends.bind(f);
    f.findMovieBuddies = f.findMovieBuddies.bind(f);
    f.buddyRequest = f.buddyRequest.bind(f);
    f.listPendingFriendRequests = f.listPendingFriendRequests.bind(f);
    f.focusOnFriend = f.focusOnFriend.bind(f);
    f.listRequests = f.listPendingFriendRequests.bind(f);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZm9mIiwiZm9jdXNPbkZyaWVuZCIsImdldEZyaWVuZHMiLCJnZXRDdXJyZW50RnJpZW5kcyIsIm15RnJpZW5kcyIsImxpc3RQb3RlbnRpYWxzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJmaW5kIiwiZmluZE1vdmllQnVkZGllcyIsIm9uQ2xpY2siLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lIiwiZGVjbGluZUZyaWVuZCIsImxpc3RSZXF1ZXN0cyIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZW1vdmUiLCJyZW1vdmVSZXF1ZXN0IiwiY2hhbmdlVmlld3NNb3ZpZSIsImJ1ZGR5ZnVuYyIsImJ1ZGR5UmVxdWVzdCIsImNoYW5nZVZpZXdzRnJpZW5kcyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsInRoYXQiLCJyZXNwIiwiZXJyIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsImZyaWVuZHMyIiwicmVxdWVzdHNPZkN1cnJlbnRVc2VyIiwiaW5kZXhPZiIsInNjcm9sbFRvcCIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsInJlcXVlc3RSZXNwb25zZXMiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsIm1hcCIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUNNQSxHOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYUMsYUFBYjs7QUFFQSxNQUFLQyxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQkMsSUFBdEIsR0FBdEI7QUFDQSxNQUFLQyxHQUFMLEdBQVUsRUFBS0MsYUFBTCxDQUFtQkYsSUFBbkIsR0FBVjtBQUNBLE1BQUtHLFVBQUwsR0FBZ0IsRUFBS0MsaUJBQUwsQ0FBdUJKLElBQXZCLEdBQWhCO0FBQ0EsTUFBS0ssU0FBTCxHQUFlLEVBQUtSLEtBQUwsQ0FBV1EsU0FBMUI7QUFDQSxNQUFLQyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JOLElBQXBCLEdBQXBCO0FBQ0EsTUFBS08sTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWVAsSUFBWixHQUFaO0FBQ0EsTUFBS1EsV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCUixJQUFqQixHQUFqQjtBQUNBLE1BQUtTLElBQUwsR0FBVSxFQUFLQyxnQkFB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QixXQUF4QixFQUFxQztBQUMxQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2lELGFBREw7QUFFRSxnQ0FBQyxTQUFEO0FBQ0Usc0JBQVEsS0FBSzVFO0FBRGY7QUFGRixXQURGO0FBUUQ7QUFDRjs7OztFQTVkZWdGLE1BQU1DLFM7O0FBK2R4QkMsT0FBTzdHLEdBQVAsR0FBYUEsR0FBYjs7QUFFQSxJQUFJaUMsTUFBTSxtQ0FBVjtBQUNBO0FBQ0E0RSxPQUFPNUUsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcblxyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5mb2Y9IHRoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5saXN0UG90ZW50aWFscz10aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyk7IFxyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZD10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub25DbGljaz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvZ291dD0gdGhpcy5sb2dvdXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5saXN0UmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZT10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NNb3ZpZT10aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlmdW5jPXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmVSZXF1ZXN0PXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydCgoYSxiKT0+e3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcclxuICAgIC8vIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgYUYnKTtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpwZXJzb25Ub0FjY2VwdCwgbW92aWU6IG1vdmllfSwocmVzcCxlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnaXQgY2FtZSBiYWNrIScsIHRoYXQpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxyXG4gIH1cclxuXHJcbiAgZGVjbGluZUZyaWVuZChwZXJzb25Ub0RlY2xpbmUsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgY29uc3Qgc29ydGVkPXJlc3Auc29ydCgoYSxiKT0+KGJbMV0tYVsxXSkpO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhhdC5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkZOTUJcIixcclxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6dW5pcXVlRnJpZW5kc1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5teUZyaWVuZHMsdGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMpO1xyXG5cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgLy90aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbiwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyhwZXJzb24sIGlkeCk7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbiwgaWR4KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kUmVxdWVzdChhLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcclxuICAgIGlmICh0eXBlb2YgYT09PVwib2JqZWN0XCIpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDInKTtcclxuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY3VyckZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICBjb25zdCBmcmllbmRzMT1bXTtcclxuICAgIGNvbnN0IGZyaWVuZHMyPVtdXHJcbiAgICBmb3IgKHZhciBpPTA7aTxjdXJyRnJpZW5kcy5sZW5ndGg7aSsrKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2xpbmUgMjUxJyxjdXJyRnJpZW5kc1tpXSlcclxuICAgICAgZnJpZW5kczEucHVzaChjdXJyRnJpZW5kc1tpXVswXSk7XHJcbiAgICAgIGZyaWVuZHMyLnB1c2goY3VyckZyaWVuZHNbaV1bMF0pXHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaT0wO2k8dGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIubGVuZ3RoO2krKyl7XHJcbiAgICAgIGZyaWVuZHMxLnB1c2godGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXJbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycscGVyc29uLCBjdXJyRnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCd0b2YnLGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSwgZnJpZW5kczEubGVuZ3RoIT09MClcclxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XHJcbiAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcclxuICAgIH0gZWxzZSBpZiAoIXBlcnNvbi5sZW5ndGgpIHtcclxuICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4vLyBjb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpbmUgMjgxJyx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcik7XHJcbiAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG5jb25zb2xlLmxvZyhcIm5vdGlmcyFcIixwRlIsIHJSKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBGUixcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOnJSXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSwgcmVzcG9uc2U9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICBsaXN0UG90ZW50aWFscygpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IHBvdGVudGlhbCBmcmllbmRzJylcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byByZW0gcmVxJyk7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbmF2PTxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSBcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PntuYXZ9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZX1cclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0c30gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBhPT4oIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdKSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0fSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kc30gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFsc30gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3R9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG5cclxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuQXBwID0gQXBwO1xyXG5cclxudmFyIFVybCA9ICdodHRwczovL3JlZWxmcmllbmR6Lmhlcm9rdWFwcC5jb20nO1xyXG4vLyB2YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XHJcbndpbmRvdy5VcmwgPSBVcmxcclxuIl19