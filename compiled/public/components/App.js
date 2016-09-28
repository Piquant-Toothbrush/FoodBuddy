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
var Url = 'https://floating-ravine-23725.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZm9mIiwiZm9jdXNPbkZyaWVuZCIsImdldEZyaWVuZHMiLCJnZXRDdXJyZW50RnJpZW5kcyIsIm15RnJpZW5kcyIsImxpc3RQb3RlbnRpYWxzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJmaW5kIiwiZmluZE1vdmllQnVkZGllcyIsIm9uQ2xpY2siLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lIiwiZGVjbGluZUZyaWVuZCIsImxpc3RSZXF1ZXN0cyIsImxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZW1vdmUiLCJyZW1vdmVSZXF1ZXN0IiwiY2hhbmdlVmlld3NNb3ZpZSIsImJ1ZGR5ZnVuYyIsImJ1ZGR5UmVxdWVzdCIsImNoYW5nZVZpZXdzRnJpZW5kcyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJtb3ZpZSIsImNvbnNvbGUiLCJsb2ciLCJ0aGF0IiwicmVzcCIsImVyciIsInBlcnNvblRvRGVjbGluZSIsImR1bW15Iiwic29ydGVkIiwidW5pcXVlRnJpZW5kcyIsInVuaXF1ZSIsIngiLCJwdXNoIiwidmlldyIsInBvdGVudGlhbE1vdmllQnVkZGllcyIsInVzZXJuYW1lIiwiY3VycmVudFVzZXIiLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJmcmllbmRzUmF0aW5ncyIsInJlc3BvbnNlIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImZyaWVuZFRvRm9jdXNPbiIsInBlcnNvbiIsImlkeCIsImN1cnJGcmllbmRzIiwiZnJpZW5kczEiLCJmcmllbmRzMiIsInJlcXVlc3RzT2ZDdXJyZW50VXNlciIsImluZGV4T2YiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlcXVlc3RvciIsInJlc3BvbnNlVFUiLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiZ2V0IiwiZnJpZW5kTmFtZSIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwic2VsZiIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJuYXYiLCJtYXAiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWFDLGFBQWI7O0FBRUEsVUFBS0MsZ0JBQUwsR0FBc0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXRCO0FBQ0EsVUFBS0MsR0FBTCxHQUFVLE1BQUtDLGFBQUwsQ0FBbUJGLElBQW5CLE9BQVY7QUFDQSxVQUFLRyxVQUFMLEdBQWdCLE1BQUtDLGlCQUFMLENBQXVCSixJQUF2QixPQUFoQjtBQUNBLFVBQUtLLFNBQUwsR0FBZSxNQUFLUixLQUFMLENBQVdRLFNBQTFCO0FBQ0EsVUFBS0MsY0FBTCxHQUFvQixNQUFLQSxjQUFMLENBQW9CTixJQUFwQixPQUFwQjtBQUNBLFVBQUtPLE1BQUwsR0FBWSxNQUFLQSxNQUFMLENBQVlQLElBQVosT0FBWjtBQUNBLFVBQUtRLFdBQUwsR0FBaUIsTUFBS0EsV0FBTCxDQUFpQlIsSUFBakIsT0FBakI7QUFDQSxVQUFLUyxJQUFM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dXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcblxyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5mb2Y9IHRoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5saXN0UG90ZW50aWFscz10aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyk7IFxyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZD10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub25DbGljaz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvZ291dD0gdGhpcy5sb2dvdXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5saXN0UmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZT10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NNb3ZpZT10aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlmdW5jPXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmVSZXF1ZXN0PXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydCgoYSxiKT0+e3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcclxuICAgIC8vIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgYUYnKTtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpwZXJzb25Ub0FjY2VwdCwgbW92aWU6IG1vdmllfSwocmVzcCxlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnaXQgY2FtZSBiYWNrIScsIHRoYXQpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxyXG4gIH1cclxuXHJcbiAgZGVjbGluZUZyaWVuZChwZXJzb25Ub0RlY2xpbmUsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2codGhhdCx0aGlzKTtcclxuICAgICAgY29uc3Qgc29ydGVkPXJlc3Auc29ydCgoYSxiKT0+KGJbMV0tYVsxXSkpO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhhdC5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkZOTUJcIixcclxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6dW5pcXVlRnJpZW5kc1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5teUZyaWVuZHMsdGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMpO1xyXG5cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdIb21lJyl7XHJcbiAgICAgIC8vIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XHJcbiAgICAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKVxyXG4gICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBjaGFuZ2VWaWV3c01vdmllKHRhcmdldFN0YXRlLCBtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVmlld3NGcmllbmRzKHRhcmdldFN0YXRlLCBmcmllbmQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGJ1ZGR5UmVxdWVzdChwZXJzb24sIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2cocGVyc29uLCBpZHgpO1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24sIGlkeCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0eXBlb2YgYSk7XHJcbiAgICBpZiAodHlwZW9mIGE9PT1cIm9iamVjdFwiKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlO1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAxJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAyJyk7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9W107XHJcbiAgICBjb25zdCBmcmllbmRzMj1bXVxyXG4gICAgZm9yICh2YXIgaT0wO2k8Y3VyckZyaWVuZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5lIDI1MScsY3VyckZyaWVuZHNbaV0pXHJcbiAgICAgIGZyaWVuZHMxLnB1c2goY3VyckZyaWVuZHNbaV1bMF0pO1xyXG4gICAgICBmcmllbmRzMi5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygndG9mJyxmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEsIGZyaWVuZHMxLmxlbmd0aCE9PTApXHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuLy8gY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5lIDI4MScsdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIpO1xyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJywgKHJlc3BvbnNlLCBlcnJvcik9PiB7XHJcbiAgICAgIGNvbnN0IHBGUj1bXTtcclxuICAgICAgY29uc3QgclI9W107XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgdG8gbHBmcicsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGk9MDtpPHJlc3BvbnNlWzBdLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3Rvcj1yZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ107XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VUVT0gcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ107XHJcbiAgICAgICAgaWYgKHJlcXVlc3RvciE9PXJlc3BvbnNlWzFdICYmIHJlc3BvbnNlVFU9PT1udWxsICl7XHJcbiAgICAgICAgICBwRlIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0b3I9PT1yZXNwb25zZVsxXSAmJnJlc3BvbnNlVFUhPT1udWxsICYmIHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0ZWUnXSE9PSd0ZXN0Jyl7XHJcbiAgICAgICAgICByUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy9cclxuY29uc29sZS5sb2coXCJub3RpZnMhXCIscEZSLCByUik7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpwRlIsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpyUlxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcclxuICAgIFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycse2ZyaWVuZE5hbWU6IGZyaWVuZH0sIHJlc3BvbnNlPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgbGlzdFBvdGVudGlhbHMoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBwb3RlbnRpYWwgZnJpZW5kcycpXHJcbiAgfVxyXG5cclxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcmVtIHJlcScpO1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xyXG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG5hdj08TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gXHJcbiAgICAgICAgICAgIC8+XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcclxuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfSAvPik7XHJcbiAgICB9IFxyXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XHJcbiAgICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxkaXY+IFxyXG4gICAgICAgICAgPGRpdj57bmF2fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWV9XHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHN9IFxyXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxyXG4gICAgICAgICAgICAgICAgYT0+KCBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXSkpfSBcclxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZH0gXHJcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHN9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHN9IFxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEhvbWUgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XHJcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kc31cclxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmR9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxyXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXHJcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcclxuXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3R9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxudmFyIFVybCA9ICdodHRwczovL2Zsb2F0aW5nLXJhdmluZS0yMzcyNS5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsOyJdfQ==