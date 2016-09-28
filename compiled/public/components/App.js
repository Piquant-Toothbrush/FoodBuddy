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

    _this.state = startingState;

    _this.sendWatchRequest = _this.sendWatchRequest.bind(_this);
    _this.fof = _this.focusOnFriend.bind(_this);
    _this.getFriends = _this.getCurrentFriends.bind(_this);
    _this.myFriends = _this.state.myFriends;
    _this.listPotentials = _this.listPotentials.bind(_this);
    _this.logout = _this.logout.bind(_this);
    _this.sendRequest = _this.sendRequest.bind(_this);
    _this.find = _this.findMovieBuddies.bind(_this);
    _this.onClick = _this.changeViews.bind(_this);
    _this.changeViews = _this.changeViews.bind(_this);
    _this.setCurrentUser = _this.setCurrentUser.bind(_this);
    _this.getMovie = _this.getMovie.bind(_this);
    _this.logout = _this.logout.bind(_this);
    _this.acceptFriend = _this.acceptFriend.bind(_this);
    _this.decline = _this.declineFriend.bind(_this);
    _this.declineFriend = _this.declineFriend.bind(_this);
    _this.listRequests = _this.listPendingFriendRequests.bind(_this);
    _this.remove = _this.removeRequest.bind(_this);
    _this.changeViewsMovie = _this.changeViewsMovie.bind(_this);
    _this.buddyfunc = _this.buddyRequest.bind(_this);
    _this.changeViewsFriends = _this.changeViewsFriends.bind(_this);
    _this.findMovieBuddies = _this.findMovieBuddies.bind(_this);
    _this.buddyRequest = _this.buddyRequest.bind(_this);
    _this.listPendingFriendRequests = _this.listPendingFriendRequests.bind(_this);
    _this.focusOnFriend = _this.focusOnFriend.bind(_this);
    _this.listRequests = _this.listPendingFriendRequests.bind(_this);
    _this.removeRequest = _this.removeRequest.bind(_this);

    return _this;
  }

  _createClass(App, [{
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

        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        _this2.setState({
          myFriends: final
        });
        // console.log('thes are my friends!!!!!!!!!!!!!!!!!',this.state.myFriends)
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(personToAccept, movie) {
      // $('button').on('click',function() {
      //   console.log($(this).html());
      // })
      // console.log(final +'should be accepted, for movie....', movie)
      console.log('calling aF');
      var that = this;
      $.post(Url + '/accept', { personToAccept: personToAccept, movie: movie }, function (resp, err) {
        console.log('it came back!', that);
        that.listPendingFriendRequests();
      });

      // console.log('refreshed inbox, should delete friend request on the spot instead of moving')
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(personToDecline, movie) {
      var that = this;
      $.post(Url + '/decline', { personToDecline: personToDecline, movie: movie }, function (resp, err) {
        // console.log('this is the state after declining friend, ', this.state);
        that.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this3 = this;

      var that = this;
      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (resp, err) {
        console.log(that, _this3);
        var sorted = resp.sort(function (a, b) {
          return b[1] - a[1];
        });
        var myFriends = that.myFriends;
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

        _this3.setState({
          view: "FNMB",
          potentialMovieBuddies: uniqueFriends
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
    value: function setCurrentUser(username) {
      // console.log('calling setCurrentUser');
      this.setState({
        currentUser: username
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(name, password) {
      var _this4 = this;

      // console.log(name,password);
      $.post(Url + '/signup', { name: name, password: password }).then(function () {
        // console.log('success'); 
        _this4.setState({ username: name, view: "Home" });
      }).catch(function () {
        console.log('error');
      });
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this5 = this;

      var movieName = document.getElementById("movieToView").value;
      $.post(Url + '/getFriendRatings', { name: movieName }).then(function (response) {
        _this5.setState({
          view: "Home",
          friendsRatings: response
        });
        // console.log('our response',this.state.friendsRatings)
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this6 = this;

      $.post(Url + '/logout').then(function (response) {
        // console.log(response);
        _this6.setState(startingState);
      });
    }
  }, {
    key: 'sendWatchRequest',
    value: function sendWatchRequest(friend) {
      var movie = document.getElementById('movieToWatch').value;
      var toSend = { requestee: friend, movie: movie };
      if (movie.length) {
        $.post(Url + '/sendWatchRequest', toSend, function (resp, err) {
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
    value: function getMovie(query) {
      var _this7 = this;

      var options = {
        query: query
      };

      this.props.searchMovie(options, function (movie) {
        // console.log(movie);
        _this7.setState({
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
      // console.log(this.state);

      if (targetState === 'Friends') {
        // console.log('you switched to friends!!')
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
    value: function buddyRequest(person, idx) {
      console.log(person, idx);
      this.sendRequest(person, idx);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a, idx) {
      var _this8 = this;

      console.log(typeof a === 'undefined' ? 'undefined' : _typeof(a));
      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === "object") {
        var person = document.getElementById('findFriendByName').value;
        console.log('part 1');
      } else {
        console.log('part 2');
        var person = a || 'test';
      }
      var currFriends = this.state.myFriends;
      var friends1 = [];
      var friends2 = [];
      for (var i = 0; i < currFriends.length; i++) {
        // console.log('line 251',currFriends[i])
        friends1.push(currFriends[i][0]);
        friends2.push(currFriends[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        friends1.push(this.state.requestsOfCurrentUser[i]);
      }

      // console.log('this should also be my friends',person, currFriends,friends1,friends2)

      //console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
      if (friends1.indexOf(person) !== -1 && friends1.length !== 0) {
        $(document).scrollTop(0);
        $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
        $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);

        // console.log('this person is already in there!!')
      } else if (!person.length) {
        $(document).scrollTop(0);
        $("#enterRealFriend,#enterRealFriend2").fadeIn(1000);
        $("#enterRealFriend,#enterRealFriend2").fadeOut(1000);
      } else {

        // console.log('person is defined?',person);
        $.post(Url + '/sendRequest', { name: person }, function (resp, err) {

          _this8.setState({
            requestsOfCurrentUser: resp.concat([person])
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
        //
        console.log("notifs!", pFR, rR);
        _this9.setState({
          pendingFriendRequests: pFR,
          requestResponses: rR
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(friend) {
      var _this10 = this;

      this.setState({
        view: 'singleFriend',
        friendToFocusOn: friend
      });

      $.get(Url + '/getFriendUserRatings', { friendName: friend }, function (response) {
        _this10.setState({
          individualFriendsMovies: response
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
    value: function removeRequest(person, self, movie) {
      console.log('trying to rem req');
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
      var _this11 = this;

      var nav = React.createElement(Nav, { name: this.state.currentUser,
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
              nav
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
              Home: true
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
            nav,
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
            nav,
            React.createElement(Home, {
              change: this.changeViewsMovie
            })
          );
        } else if (this.state.view === "SingleMovie") {
          var _ret = function () {
            var that = _this11;
            return {
              v: React.createElement(
                'div',
                { onClick: function onClick() {
                    return console.log(that.state);
                  } },
                nav,
                React.createElement(SingleMovieRating, {
                  compatibility: _this11.state.myFriends,
                  currentMovie: _this11.state.movie,
                  change: _this11.changeViewsFriends,
                  fof: _this11.focusOnFriend
                })
              )
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else if (this.state.view === 'singleFriend') {
          return React.createElement(
            'div',
            null,
            nav,
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
            nav,
            React.createElement(FindMovieBuddy, {

              buddyfunc: this.buddyRequest,
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
          return React.createElement(
            'div',
            null,
            nav,
            React.createElement(MyRatings, {
              change: this.changeViewsMovie
            })
          );
        }
    }
  }]);

  return App;
}(React.Component);

window.App = App;

var Url = 'https://reelfriendz.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZm9mIiwiZm9jdXNPbkZyaWVuZCIsImdldEZyaWVuZHMiLCJnZXRDdXJyZW50RnJpZW5kcyIsIm15RnJpZW5kcyIsImxpc3RQb3RlbnRpYWxzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJmaW5kIiwiZmluZE1vdmllQnVkZGllcyIsIm9uQ2xpY2siLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lIiwiZGVjbGluZUZyaWVuZCIsImxpc3RSZXF1ZXN0cyIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZW1vdmUiLCJyZW1vdmVSZXF1ZXN0IiwiY2hhbmdlVmlld3NNb3ZpZSIsImJ1ZGR5ZnVuYyIsImJ1ZGR5UmVxdWVzdCIsImNoYW5nZVZpZXdzRnJpZW5kcyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsImNvbnNvbGUiLCJsb2ciLCJ0aGF0IiwicmVzcCIsImVyciIsInBlcnNvblRvRGVjbGluZSIsImR1bW15Iiwic29ydGVkIiwidW5pcXVlRnJpZW5kcyIsInVuaXF1ZSIsIngiLCJwdXNoIiwidmlldyIsInBvdGVudGlhbE1vdmllQnVkZGllcyIsInVzZXJuYW1lIiwiY3VycmVudFVzZXIiLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJmcmllbmRzUmF0aW5ncyIsInJlc3BvbnNlIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImZyaWVuZFRvRm9jdXNPbiIsInBlcnNvbiIsImlkeCIsImN1cnJGcmllbmRzIiwiZnJpZW5kczEiLCJmcmllbmRzMiIsInJlcXVlc3RzT2ZDdXJyZW50VXNlciIsImluZGV4T2YiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlcXVlc3RvciIsInJlc3BvbnNlVFUiLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiZ2V0IiwiZnJpZW5kTmFtZSIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwic2VsZiIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJuYXYiLCJtYXAiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWFDLGFBQWI7O0FBRUEsVUFBS0MsZ0JBQUwsR0FBc0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXRCO0FBQ0EsVUFBS0MsR0FBTCxHQUFVLE1BQUtDLGFBQUwsQ0FBbUJGLElBQW5CLE9BQVY7QUFDQSxVQUFLRyxVQUFMLEdBQWdCLE1BQUtDLGlCQUFMLENBQXVCSixJQUF2QixPQUFoQjtBQUNBLFVBQUtLLFNBQUwsR0FBZSxNQUFLUixLQUFMLENBQVdRLFNBQTFCO0FBQ0EsVUFBS0MsY0FBTCxHQUFvQixNQUFLQSxjQUFMLENBQW9CTixJQUFwQixPQUFwQjtBQUNBLFVBQUtPLE1BQUwsR0FBWSxNQUFLQSxNQUFMLENBQVlQLElBQVosT0FBWjtBQUNBLFVBQUtRLFdBQUwsR0FBaUIsTUFBS0EsV0FBTCxDQUFpQlIsSUFBakIsT0FBakI7QUFDQSxVQUFLUyxJQUFM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b3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSBzdGFydGluZ1N0YXRlO1xyXG5cclxuICAgIHRoaXMuc2VuZFdhdGNoUmVxdWVzdD10aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9mPSB0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0RnJpZW5kcz10aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm15RnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIHRoaXMubGlzdFBvdGVudGlhbHM9dGhpcy5saXN0UG90ZW50aWFscy5iaW5kKHRoaXMpOyBcclxuICAgIHRoaXMubG9nb3V0PXRoaXMubG9nb3V0LmJpbmQodGhpcykgIFxyXG4gICAgdGhpcy5zZW5kUmVxdWVzdD10aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZpbmQ9dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uQ2xpY2s9dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3cz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldEN1cnJlbnRVc2VyPXRoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0TW92aWU9dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5sb2dvdXQ9IHRoaXMubG9nb3V0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFjY2VwdEZyaWVuZD0gdGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVjbGluZT10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVjbGluZUZyaWVuZD10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmU9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzTW92aWU9dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJ1ZGR5ZnVuYz10aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHM9dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZE1vdmllQnVkZGllcz10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlSZXF1ZXN0PXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvY3VzT25GcmllbmQ9dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVtb3ZlUmVxdWVzdD10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGVzdGluZ2dnJyk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LCAoYSwgYikgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2hhdCB5b3UgZ2V0IGJhY2sgZnJvbSBzZXJ2ZXIgZm9yIGdldCBmcmllbmRzJyxhLGIpO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgIGFbaV1bMV0gPSBcIk5vIGNvbXBhcmlzb24gdG8gYmUgbWFkZVwiO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgIGNvbnN0IGZpbmFsPSBhLnNvcnQoKGEsYik9PntyZXR1cm4gYlsxXS1hWzFdfSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxyXG4gICAgICB9KVxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhlcyBhcmUgbXkgZnJpZW5kcyEhISEhISEhISEhISEhISEhJyx0aGlzLnN0YXRlLm15RnJpZW5kcylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBhY2NlcHRGcmllbmQocGVyc29uVG9BY2NlcHQsIG1vdmllKSB7XHJcbiAgICAvLyAkKCdidXR0b24nKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XHJcbiAgICAvLyB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coZmluYWwgKydzaG91bGQgYmUgYWNjZXB0ZWQsIGZvciBtb3ZpZS4uLi4nLCBtb3ZpZSlcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoYXQsdGhpcyk7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoKGEsYik9PihiWzFdLWFbMV0pKTtcclxuICAgICAgY29uc3QgbXlGcmllbmRzPXRoYXQubXlGcmllbmRzO1xyXG4gICAgICAgY29uc3QgdW5pcXVlRnJpZW5kcz1bXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTxzb3J0ZWQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBsZXQgdW5pcXVlPXRydWU7XHJcbiAgICAgICAgICBmb3IgKGxldCB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xyXG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XHJcbiAgICAgICAgICAgIHVuaXF1ZUZyaWVuZHMucHVzaChzb3J0ZWRbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubXlGcmllbmRzLHRoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzKTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oKCk9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goKCk9PiB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgbGV0IG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIkhvbWVcIixcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGlzLnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxyXG4gICAgfSkuY2F0Y2goZXJyPT4ge2NvbnNvbGUubG9nKGVycil9KTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZShzdGFydGluZ1N0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZFdhdGNoUmVxdWVzdChmcmllbmQpIHtcclxuICAgIGNvbnN0IG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XHJcbiAgICBjb25zdCB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcclxuICAgIGlmIChtb3ZpZS5sZW5ndGgpIHtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9tb3ZpZSByZW5kZXJcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cclxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcclxuICBnZXRNb3ZpZShxdWVyeSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIG1vdmllID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cobW92aWUpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XHJcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XHJcbiAgc2hvd01vdmllKG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9OYXYgY2hhbmdlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICAvLyB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBidWRkeVJlcXVlc3QocGVyc29uLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHBlcnNvbiwgaWR4KTtcclxuICAgIHRoaXMuc2VuZFJlcXVlc3QocGVyc29uLCBpZHgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEsIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2codHlwZW9mIGEpO1xyXG4gICAgaWYgKHR5cGVvZiBhPT09XCJvYmplY3RcIil7XHJcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZTtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMicpO1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPVtdO1xyXG4gICAgY29uc3QgZnJpZW5kczI9W11cclxuICAgIGZvciAodmFyIGk9MDtpPGN1cnJGcmllbmRzLmxlbmd0aDtpKyspe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnbGluZSAyNTEnLGN1cnJGcmllbmRzW2ldKVxyXG4gICAgICBmcmllbmRzMS5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKTtcclxuICAgICAgZnJpZW5kczIucHVzaChjdXJyRnJpZW5kc1tpXVswXSlcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcclxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyxwZXJzb24sIGN1cnJGcmllbmRzLGZyaWVuZHMxLGZyaWVuZHMyKVxyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHBlcnNvbiBpcyBhbHJlYWR5IGluIHRoZXJlISEnKVxyXG4gICAgfSBlbHNlIGlmICghcGVyc29uLmxlbmd0aCkge1xyXG4gICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuXHJcbi8vIGNvbnNvbGUubG9nKCdwZXJzb24gaXMgZGVmaW5lZD8nLHBlcnNvbik7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpyZXNwLmNvbmNhdChbcGVyc29uXSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGluZSAyODEnLHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyKTtcclxuICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmICggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IGZyaWVuZCByZXFzJylcclxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsIChyZXNwb25zZSwgZXJyb3IpPT4ge1xyXG4gICAgICBjb25zdCBwRlI9W107XHJcbiAgICAgIGNvbnN0IHJSPVtdO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRvIGxwZnInLCByZXNwb25zZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCByZXF1ZXN0b3I9cmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVFU9IHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0b3IhPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVRVPT09bnVsbCApe1xyXG4gICAgICAgICAgcEZSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdG9yPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVRVIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xyXG4gICAgICAgICAgclIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vXHJcbmNvbnNvbGUubG9nKFwibm90aWZzIVwiLHBGUiwgclIpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZT0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIGxpc3RQb3RlbnRpYWxzKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XHJcbiAgICBjb25zb2xlLmxvZygndHJ5aW5nIHRvIHJlbSByZXEnKTtcclxuICAgIHZhciB0aGF0PSB0aGlzO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcclxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcclxuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBuYXY9PE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9IFxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XHJcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0vPik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcclxuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+e25hdn08L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaE1vdmllPXt0aGlzLmdldE1vdmllfVxyXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSW5ib3hcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH1cclxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8SW5ib3ggXHJcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICAgIGFjY2VwdD0ge3RoaXMuYWNjZXB0RnJpZW5kfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGxpc3RSZXF1ZXN0cz17dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzfSBcclxuICAgICAgICAgICAgICBwcGxXaG9XYW50VG9CZUZyaWVuZHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzLm1hcChcclxuICAgICAgICAgICAgICAgIGE9PiggW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV0pKX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3R9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGcmllbmRzIFxyXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3R9IFxyXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmR9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzfSBcclxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXHJcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzfSBcclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxIb21lIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxyXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHN9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcclxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxyXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXHJcblxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0fSBcclxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxNeVJhdGluZ3MgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcblxyXG52YXIgVXJsID0gJ2h0dHBzOi8vcmVlbGZyaWVuZHouaGVyb2t1YXBwLmNvbSc7XHJcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcclxud2luZG93LlVybCA9IFVybFxyXG4iXX0=