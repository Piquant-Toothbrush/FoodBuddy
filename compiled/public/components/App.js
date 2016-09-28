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
        //this.sendRequest();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZm9mIiwiZm9jdXNPbkZyaWVuZCIsImdldEZyaWVuZHMiLCJnZXRDdXJyZW50RnJpZW5kcyIsIm15RnJpZW5kcyIsImxpc3RQb3RlbnRpYWxzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJmaW5kIiwiZmluZE1vdmllQnVkZGllcyIsIm9uQ2xpY2siLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lIiwiZGVjbGluZUZyaWVuZCIsImxpc3RSZXF1ZXN0cyIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZW1vdmUiLCJyZW1vdmVSZXF1ZXN0IiwiY2hhbmdlVmlld3NNb3ZpZSIsImJ1ZGR5ZnVuYyIsImJ1ZGR5UmVxdWVzdCIsImNoYW5nZVZpZXdzRnJpZW5kcyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsImNvbnNvbGUiLCJsb2ciLCJ0aGF0IiwicmVzcCIsImVyciIsInBlcnNvblRvRGVjbGluZSIsImR1bW15Iiwic29ydGVkIiwidW5pcXVlRnJpZW5kcyIsInVuaXF1ZSIsIngiLCJwdXNoIiwidmlldyIsInBvdGVudGlhbE1vdmllQnVkZGllcyIsInVzZXJuYW1lIiwiY3VycmVudFVzZXIiLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJmcmllbmRzUmF0aW5ncyIsInJlc3BvbnNlIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImZyaWVuZFRvRm9jdXNPbiIsInBlcnNvbiIsImlkeCIsImN1cnJGcmllbmRzIiwiZnJpZW5kczEiLCJmcmllbmRzMiIsInJlcXVlc3RzT2ZDdXJyZW50VXNlciIsImluZGV4T2YiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlcXVlc3RvciIsInJlc3BvbnNlVFUiLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiZ2V0IiwiZnJpZW5kTmFtZSIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwic2VsZiIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJuYXYiLCJtYXAiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWFDLGFBQWI7O0FBRUEsVUFBS0MsZ0JBQUwsR0FBc0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXRCO0FBQ0EsVUFBS0MsR0FBTCxHQUFVLE1BQUtDLGFBQUwsQ0FBbUJGLElBQW5CLE9BQVY7QUFDQSxVQUFLRyxVQUFMLEdBQWdCLE1BQUtDLGlCQUFMLENBQXVCSixJQUF2QixPQUFoQjtBQUNBLFVBQUtLLFNBQUwsR0FBZSxNQUFLUixLQUFMLENBQVdRLFNBQTFCO0FBQ0EsVUFBS0MsY0FBTCxHQUFvQixNQUFLQSxjQUFMLENBQW9CTixJQUFwQixPQUFwQjtBQUNBLFVBQUtPLE1BQUwsR0FBWSxNQUFLQSxNQUFMLENBQVlQLElBQVosT0FBWjtBQUNBLFVBQUtRLFdBQUwsR0FBaUIsTUFBS0EsV0FBTCxDQUFpQlIsSUFBakIsT0FBakI7QUFDQSxVQUFLUyxJQUFM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ZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcblxyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5mb2Y9IHRoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5saXN0UG90ZW50aWFscz10aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyk7IFxyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZD10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub25DbGljaz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvZ291dD0gdGhpcy5sb2dvdXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5saXN0UmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZT10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NNb3ZpZT10aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlmdW5jPXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmVSZXF1ZXN0PXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydCgoYSxiKT0+e3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcclxuICAgIC8vIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgYUYnKTtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpwZXJzb25Ub0FjY2VwdCwgbW92aWU6IG1vdmllfSwocmVzcCxlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnaXQgY2FtZSBiYWNrIScsIHRoYXQpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxyXG4gIH1cclxuXHJcbiAgZGVjbGluZUZyaWVuZChwZXJzb25Ub0RlY2xpbmUsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgY29uc3Qgc29ydGVkPXJlc3Auc29ydCgoYSxiKT0+KGJbMV0tYVsxXSkpO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhhdC5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkZOTUJcIixcclxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6dW5pcXVlRnJpZW5kc1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5teUZyaWVuZHMsdGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMpO1xyXG5cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgLy90aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbiwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyhwZXJzb24sIGlkeCk7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbiwgaWR4KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kUmVxdWVzdChhLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcclxuICAgIGlmICh0eXBlb2YgYT09PVwib2JqZWN0XCIpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDInKTtcclxuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY3VyckZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICBjb25zdCBmcmllbmRzMT1bXTtcclxuICAgIGNvbnN0IGZyaWVuZHMyPVtdXHJcbiAgICBmb3IgKHZhciBpPTA7aTxjdXJyRnJpZW5kcy5sZW5ndGg7aSsrKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2xpbmUgMjUxJyxjdXJyRnJpZW5kc1tpXSlcclxuICAgICAgZnJpZW5kczEucHVzaChjdXJyRnJpZW5kc1tpXVswXSk7XHJcbiAgICAgIGZyaWVuZHMyLnB1c2goY3VyckZyaWVuZHNbaV1bMF0pXHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaT0wO2k8dGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIubGVuZ3RoO2krKyl7XHJcbiAgICAgIGZyaWVuZHMxLnB1c2godGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXJbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycscGVyc29uLCBjdXJyRnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCd0b2YnLGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSwgZnJpZW5kczEubGVuZ3RoIT09MClcclxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XHJcbiAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcclxuICAgIH0gZWxzZSBpZiAoIXBlcnNvbi5sZW5ndGgpIHtcclxuICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4vLyBjb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xpbmUgMjgxJyx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcik7XHJcbiAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG5jb25zb2xlLmxvZyhcIm5vdGlmcyFcIixwRlIsIHJSKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBGUixcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOnJSXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSwgcmVzcG9uc2U9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICBsaXN0UG90ZW50aWFscygpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IHBvdGVudGlhbCBmcmllbmRzJylcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byByZW0gcmVxJyk7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbmF2PTxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSBcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PntuYXZ9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZX1cclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0c30gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBhPT4oIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdKSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0fSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kc30gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFsc30gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3R9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG5cclxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuQXBwID0gQXBwO1xyXG5cclxudmFyIFVybCA9ICdodHRwczovL3JlZWxmcmllbmR6Lmhlcm9rdWFwcC5jb20nO1xyXG4vLyB2YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XHJcbndpbmRvdy5VcmwgPSBVcmxcclxuIl19