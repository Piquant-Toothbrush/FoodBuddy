'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      view: 'Login',
      friendsRatings: [],
      movie: null,
      friendRequests: [],
      pendingFriendRequests: [],
      myFriends: [],
      friendToFocusOn: '',
      individualFriendsMovies: [],
      potentialMovieBuddies: {},
      username: null,
      requestResponses: [],
      currentUser: null,
      requestsOfCurrentUser: []
    };
    return _this;
  }

  _createClass(App, [{
    key: 'getCurrentFriends',
    value: function getCurrentFriends() {
      var _this2 = this;

      console.log('testinggg');
      $.post(Url + '/getFriends', { test: 'info' }, function (a, b) {
        console.log('what you get back from server for get friends', a, b);
        for (var i = 0; i < a.length; i++) {
          if (a[i][1] === null) {
            a[i][1] = "No comparison to be made";
          }
        }

        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        _this2.setState({
          myFriends: final
        });
        console.log('thes are my friends!!!!!!!!!!!!!!!!!', _this2.state.myFriends);
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(personToAccept, movie) {
      var _this3 = this;

      // $('button').on('click',function() {
      //   console.log($(this).html());
      // })
      // console.log(final +'should be accepted, for movie....', movie)

      $.post(Url + '/accept', { personToAccept: personToAccept, movie: movie }, function (resp, err) {
        _this3.listPendingFriendRequests();
      });

      console.log('refreshed inbox, should delete friend request on the spot instead of moving');
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(personToDecline, movie) {
      var _this4 = this;

      $.post(Url + '/decline', { personToDecline: personToDecline, movie: movie }, function (resp, err) {
        console.log('this is the state after declining friend, ', _this4.state);
        _this4.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this5 = this;

      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (resp, err) {
        var sorted = resp.sort(function (a, b) {
          return b[1] - a[1];
        });
        var myFriends = _this5.state.myFriends;
        var uniqueFriends = [];
        for (var i = 0; i < sorted.length; i++) {
          var unique = true;
          for (var x = 0; x < myFriends.length; x++) {
            if (sorted[i][0] === myFriends[x][0]) {
              unique = false;
            }
          }
          if (unique) {
            uniqueFriends.push(sorted[i]);
          }
        }

        _this5.setState({
          view: "FNMB",
          potentialMovieBuddies: uniqueFriends
        });

        console.log(_this5.state.myFriends, _this5.state.potentialMovieBuddies);
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
    value: function setCurrentUser(username) {
      console.log('calling setCurrentUser');
      this.setState({
        currentUser: username
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(name, password) {
      var _this6 = this;

      console.log(name, password);
      $.post(Url + '/signup', { name: name, password: password }).then(function () {
        console.log('success');
        _this6.setState({ username: name, view: "Home" });
      }).catch(function () {
        console.log('error');
      });
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this7 = this;

      var movieName = document.getElementById("movieToView").value;
      $.post(Url + '/getFriendRatings', { name: movieName }).then(function (response) {
        _this7.setState({
          view: "Home",
          friendsRatings: response
        });
        console.log('our response', _this7.state.friendsRatings);
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this8 = this;

      $.post(Url + '/logout').then(function (response) {
        console.log(response);
        _this8.setState({
          view: "Login",
          friendsRatings: [],
          movie: null,
          friendRequests: [],
          pendingFriendRequests: [],
          myFriends: [],
          friendToFocusOn: '',
          individualFriendsMovies: [],
          potentialMovieBuddies: {},
          username: null,
          requestResponses: [],
          currentUser: null,
          requestsOfCurrentUser: []
        });
      });
    }
  }, {
    key: 'sendWatchRequest',
    value: function sendWatchRequest(friend) {
      var movie = document.getElementById('movieToWatch').value;
      var toSend = { requestee: friend, movie: movie };
      if (movie.length) {
        $.post(Url + '/sendWatchRequest', toSend, function (resp, err) {
          console.log(resp, err);
        });
        document.getElementById('movieToWatch').value = '';
      } else {
        console.log('you need to enter a movie to send a watch request!!!!');
      }
    }

    /////////////////////
    /////movie render
    /////////////////////
    //call searchmovie function
    //which gets passed down to the Movie Search 

  }, {
    key: 'getMovie',
    value: function getMovie(query) {
      var _this9 = this;

      var options = {
        query: query
      };

      this.props.searchMovie(options, function (movie) {
        console.log(movie);
        _this9.setState({
          view: "MovieSearchView",
          movie: movie
        });
      });
    }
    //show the movie searched in friend movie list
    //onto the stateview of moviesearchview

  }, {
    key: 'showMovie',
    value: function showMovie(movie) {
      this.setState({
        movie: movie
      });
    }
    /////////////////////
    /////Nav change
    /////////////////////

  }, {
    key: 'changeViews',
    value: function changeViews(targetState) {
      console.log(this.state);

      if (targetState === 'Friends') {
        console.log('you switched to friends!!');
        this.getCurrentFriends();
        this.sendRequest();
      }

      if (targetState === 'Home') {
        // this.getCurrentFriends()
        this.sendRequest();
      }

      if (targetState === "Inbox") {
        this.listPendingFriendRequests();
      }

      this.setState({
        view: targetState
      });
    }
  }, {
    key: 'changeViewsMovie',
    value: function changeViewsMovie(targetState, movie) {
      this.setState({
        view: targetState,
        movie: movie
      });
    }
  }, {
    key: 'changeViewsFriends',
    value: function changeViewsFriends(targetState, friend) {
      this.setState({
        view: targetState,
        friendToFocusOn: friend
      });
    }
  }, {
    key: 'buddyRequest',
    value: function buddyRequest(person) {
      this.sendRequest(person);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a) {
      var _this10 = this;

      console.log('send request is being run!!');

      if (document.getElementById('findFriendByName') !== null) {
        var person = document.getElementById('findFriendByName').value;
      } else {
        var person = a || 'test';
      }
      var currFriends = this.state.myFriends;
      var friends1 = [];
      var friends2 = [];
      for (var i = 0; i < currFriends.length; i++) {
        console.log('line 251', currFriends[i]);
        friends1.push(currFriends[i][0]);
        friends2.push(currFriends[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        friends1.push(this.state.requestsOfCurrentUser[i]);
      }

      console.log('this should also be my friends', person, currFriends, friends1, friends2);

      //console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
      if (friends1.indexOf(person) !== -1 && friends1.length !== 0) {
        $("#AlreadyReq").fadeIn(1000);
        $("#AlreadyReq").fadeOut(1000);
        console.log('this person is already in there!!');
      } else if (!person.length) {
        $("#enterRealFriend").fadeIn(1000);
        $("#enterRealFriend").fadeOut(1000);
      } else {

        console.log('person is defined?', person);
        $.post(Url + '/sendRequest', { name: person }, function (resp, err) {

          _this10.setState({
            requestsOfCurrentUser: resp.concat([person])
          });
          // console.log('line 281',this.state.requestsOfCurrentUser);

          $("#reqSent").fadeIn(1000);
          $("#reqSent").fadeOut(1000);
        });
        if (document.getElementById('findFriendByName') !== null) {
          document.getElementById('findFriendByName').value = '';
        }
      }
    }
  }, {
    key: 'listPendingFriendRequests',
    value: function listPendingFriendRequests() {
      var _this11 = this;

      console.log('this should list friend reqs');
      $.post(Url + '/listRequests', function (response, error) {
        var pFR = [];
        var rR = [];
        console.log('response to lpfr', response);

        for (var i = 0; i < response[0].length; i++) {
          var requestor = response[0][i]['requestor'];
          var responseTU = response[0][i]['response'];
          if (requestor !== response[1] && responseTU === null) {
            pFR.push(response[0][i]);
          }
          if (requestor === response[1] && responseTU !== null && response[0][i]['requestee'] !== 'test') {
            rR.push(response[0][i]);
          }
        }

        _this11.setState({
          pendingFriendRequests: pFR,
          requestResponses: rR
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(friend) {
      var _this12 = this;

      this.setState({
        view: 'singleFriend',
        friendToFocusOn: friend
      });

      $.get(Url + '/getFriendUserRatings', { friendName: friend }, function (response) {
        _this12.setState({
          individualFriendsMovies: response
        });
      });
    }
  }, {
    key: 'listPotentials',
    value: function listPotentials() {
      console.log('this should list potential friends');
    }
  }, {
    key: 'removeRequest',
    value: function removeRequest(person, self, movie) {
      var that = this;
      $.ajax({
        url: Url + '/removeRequest',
        type: 'DELETE',
        data: {
          requestor: self,
          requestee: person,
          movie: movie
        },
        success: function success(response) {
          console.log('REQUEST REMOVED! Movie is: ', movie);
          that.listPendingFriendRequests();
        },
        error: function error(_error) {
          console.log(_error);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this13 = this;

      if (this.state.view === 'Login') {
        return React.createElement(LogIn, { changeViews: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
      } else if (this.state.view === "SignUp") {
        return React.createElement(SignUp, { changeViews: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
      }
      //this view is added for moviesearch rendering
      else if (this.state.view === "MovieSearchView") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(MovieRating, {
                handleSearchMovie: this.getMovie.bind(this),
                movie: this.state.movie
              })
            )
          );
        } else if (this.state.view === "Inbox") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this),
              Home: true
            }),
            React.createElement(Inbox, {
              requests: this.state.pendingFriendRequests,
              responsesAnswered: this.state.requestResponses,
              logout: this.logout.bind(this),
              accept: this.acceptFriend.bind(this),
              decline: this.declineFriend.bind(this),
              listRequests: this.listPendingFriendRequests.bind(this),
              pplWhoWantToBeFriends: this.state.pendingFriendRequests.map(function (a) {
                return [a.requestor, a.requestTyp, a.movie === null ? "" : a.movie, "Message:" + a.message === 'null' ? "none" : a.message];
              }),
              remove: this.removeRequest.bind(this)
            })
          );
        } else if (this.state.view === "Friends") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this) }),
            React.createElement(Friends, {
              sendWatchRequest: this.sendWatchRequest.bind(this),
              fof: this.focusOnFriend.bind(this),
              getFriends: this.getCurrentFriends.bind(this),
              myFriends: this.state.myFriends,
              listPotentials: this.listPotentials.bind(this),
              logout: this.logout.bind(this),
              sendRequest: this.sendRequest.bind(this)
            })
          );
        } else if (this.state.view === "Home") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(Home, {
              change: this.changeViewsMovie.bind(this)
            })
          );
        } else if (this.state.view === "SingleMovie") {
          var _ret = function () {
            var that = _this13;
            return {
              v: React.createElement(
                'div',
                { onClick: function onClick() {
                    return console.log(that.state);
                  } },
                React.createElement(Nav, { name: _this13.state.currentUser,
                  onClick: _this13.changeViews.bind(_this13),
                  logout: _this13.logout.bind(_this13)
                }),
                React.createElement(SingleMovieRating, {
                  compatibility: _this13.state.myFriends,
                  currentMovie: _this13.state.movie,
                  change: _this13.changeViewsFriends.bind(_this13),
                  fof: _this13.focusOnFriend.bind(_this13)
                })
              )
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else if (this.state.view === 'singleFriend') {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(SingleFriend, {
              moviesOfFriend: this.state.individualFriendsMovies,
              friendName: this.state.friendToFocusOn,
              onClick: this.changeViews.bind(this),
              change: this.changeViewsMovie.bind(this)
            })
          );
        } else if (this.state.view === "FNMB") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(FindMovieBuddy, {
              buddyfunc: this.buddyRequest.bind(this),
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(MyRatings, {
              change: this.changeViewsMovie.bind(this)
            })
          );
        }
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//var Url = 'https://reelpals.herokuapp.com';
var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwidmlldyIsImZyaWVuZHNSYXRpbmdzIiwibW92aWUiLCJmcmllbmRSZXF1ZXN0cyIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsIm15RnJpZW5kcyIsImZyaWVuZFRvRm9jdXNPbiIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiY3VycmVudFVzZXIiLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJjb25zb2xlIiwibG9nIiwiJCIsInBvc3QiLCJVcmwiLCJ0ZXN0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwiZmluYWwiLCJzb3J0Iiwic2V0U3RhdGUiLCJwZXJzb25Ub0FjY2VwdCIsInJlc3AiLCJlcnIiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJyZXNwb25zZSIsImZyaWVuZCIsInRvU2VuZCIsInJlcXVlc3RlZSIsInF1ZXJ5Iiwib3B0aW9ucyIsInNlYXJjaE1vdmllIiwidGFyZ2V0U3RhdGUiLCJnZXRDdXJyZW50RnJpZW5kcyIsInNlbmRSZXF1ZXN0IiwicGVyc29uIiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsImZyaWVuZHMyIiwiaW5kZXhPZiIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsImdldCIsImZyaWVuZE5hbWUiLCJzZWxmIiwidGhhdCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJjaGFuZ2VWaWV3cyIsImJpbmQiLCJzZXRDdXJyZW50VXNlciIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJsb2dvdXQiLCJnZXRNb3ZpZSIsImFjY2VwdEZyaWVuZCIsImRlY2xpbmVGcmllbmQiLCJtYXAiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsInJlbW92ZVJlcXVlc3QiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwiZm9jdXNPbkZyaWVuZCIsImxpc3RQb3RlbnRpYWxzIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImJ1ZGR5UmVxdWVzdCIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTUEsRzs7O0FBQ0osZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsWUFBTSxPQURLO0FBRVhDLHNCQUFnQixFQUZMO0FBR1hDLGFBQU8sSUFISTtBQUlYQyxzQkFBZ0IsRUFKTDtBQUtYQyw2QkFBdUIsRUFMWjtBQU1YQyxpQkFBVyxFQU5BO0FBT1hDLHVCQUFpQixFQVBOO0FBUVhDLCtCQUF5QixFQVJkO0FBU1hDLDZCQUF1QixFQVRaO0FBVVhDLGdCQUFVLElBVkM7QUFXWEMsd0JBQWtCLEVBWFA7QUFZWEMsbUJBQWEsSUFaRjtBQWFYQyw2QkFBdUI7QUFiWixLQUFiO0FBSGlCO0FBa0JsQjs7Ozt3Q0FFbUI7QUFBQTs7QUFFbEJDLGNBQVFDLEdBQVIsQ0FBWSxXQUFaO0FBQ0FDLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxhQUFiLEVBQTJCLEVBQUNDLE1BQUssTUFBTixFQUEzQixFQUEwQyxVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUNsRFAsZ0JBQVFDLEdBQVIsQ0FBWSwrQ0FBWixFQUE0REssQ0FBNUQsRUFBOERDLENBQTlEO0FBQ08sYUFBSyxJQUFJQyxJQUFFLENBQVgsRUFBYUEsSUFBRUYsRUFB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QXNCLElBQXRCLENBRlg7QUFHRSxzQkFBUSxLQUFLRyxNQUFMLENBQVlILElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUtjLGdCQUFMLENBQXNCZCxJQUF0QixDQUEyQixJQUEzQjtBQURWO0FBTkYsV0FERjtBQVlEO0FBQ0Y7Ozs7RUFyZWVpQixNQUFNQyxTOztBQXdleEJDLE9BQU9wRyxHQUFQLEdBQWFBLEdBQWI7QUFDQTtBQUNDLElBQUlvQixNQUFNLHVCQUFWO0FBQ0RnRixPQUFPaEYsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2aWV3OiAnTG9naW4nLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczogW10sXHJcbiAgICAgIG1vdmllOiBudWxsLFxyXG4gICAgICBmcmllbmRSZXF1ZXN0czogW10sXHJcbiAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czogW10sXHJcbiAgICAgIG15RnJpZW5kczogW10sXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogJycsXHJcbiAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiBbXSxcclxuICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOiB7fSxcclxuICAgICAgdXNlcm5hbWU6IG51bGwsXHJcbiAgICAgIHJlcXVlc3RSZXNwb25zZXM6IFtdLFxyXG4gICAgICBjdXJyZW50VXNlcjogbnVsbCxcclxuICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcclxuICAgIC8vIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxyXG5cclxuICAgICQucG9zdChVcmwgKyAnL2FjY2VwdCcse3BlcnNvblRvQWNjZXB0OnBlcnNvblRvQWNjZXB0LCBtb3ZpZTogbW92aWV9LChyZXNwLGVycik9PiB7XHJcbiAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXHJcbiAgfVxyXG5cclxuICBkZWNsaW5lRnJpZW5kKHBlcnNvblRvRGVjbGluZSwgbW92aWUpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICBcclxuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zdCBzb3J0ZWQ9cmVzcC5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiRk5NQlwiLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp1bmlxdWVGcmllbmRzXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm15RnJpZW5kcyx0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VWaWV3KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xyXG4gICAgY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKCgpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcclxuICAgIH0pLmNhdGNoKCgpPT4ge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcclxuICAgIGxldCBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhpcy5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuICAgIH0pLmNhdGNoKGVycj0+IHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJMb2dpblwiLFxyXG4gICAgICAgIGZyaWVuZHNSYXRpbmdzOltdLFxyXG4gICAgICAgIG1vdmllOiBudWxsLFxyXG4gICAgICAgIGZyaWVuZFJlcXVlc3RzOltdLFxyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpbXSxcclxuICAgICAgICBteUZyaWVuZHM6W10sXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOicnLFxyXG4gICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOltdLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcclxuICAgICAgICB1c2VybmFtZTogbnVsbCxcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOltdLFxyXG4gICAgICAgIGN1cnJlbnRVc2VyOm51bGwsXHJcbiAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOltdXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vTmF2IGNoYW5nZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xyXG4gICAgICBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXHJcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbikge1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24pO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEpIHtcclxuY29uc29sZS5sb2coJ3NlbmQgcmVxdWVzdCBpcyBiZWluZyBydW4hIScpXHJcblxyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPVtdO1xyXG4gICAgY29uc3QgZnJpZW5kczI9W11cclxuICAgIGZvciAodmFyIGk9MDtpPGN1cnJGcmllbmRzLmxlbmd0aDtpKyspe1xyXG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLGN1cnJGcmllbmRzW2ldKVxyXG4gICAgICBmcmllbmRzMS5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKTtcclxuICAgICAgZnJpZW5kczIucHVzaChjdXJyRnJpZW5kc1tpXVswXSlcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcclxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyxwZXJzb24sIGN1cnJGcmllbmRzLGZyaWVuZHMxLGZyaWVuZHMyKVxyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHBlcnNvbiBpcyBhbHJlYWR5IGluIHRoZXJlISEnKVxyXG4gICAgfSBlbHNlIGlmICghcGVyc29uLmxlbmd0aCkge1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5lIDI4MScsdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIpO1xyXG5cclxuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJywgKHJlc3BvbnNlLCBlcnJvcik9PiB7XHJcbiAgICAgIGNvbnN0IHBGUj1bXTtcclxuICAgICAgY29uc3QgclI9W107XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBGUixcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOnJSXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSwgcmVzcG9uc2U9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICBsaXN0UG90ZW50aWFscygpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IHBvdGVudGlhbCBmcmllbmRzJylcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX0gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKX0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWUuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihhKXtyZXR1cm4gW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV19KX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcbi8vdmFyIFVybCA9ICdodHRwczovL3JlZWxwYWxzLmhlcm9rdWFwcC5jb20nO1xyXG4gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsOyJdfQ==