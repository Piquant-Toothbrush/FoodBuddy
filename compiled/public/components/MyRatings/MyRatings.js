'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyRatings = function (_React$Component) {
  _inherits(MyRatings, _React$Component);

  function MyRatings(props) {
    _classCallCheck(this, MyRatings);

    var _this = _possibleConstructorReturn(this, (MyRatings.__proto__ || Object.getPrototypeOf(MyRatings)).call(this, props));

    _this.state = {
      movies: [],
      allRatedMovies: true,
      search: ''
    };
    return _this;
  }

  //show render a list of recent releases on initialize


  _createClass(MyRatings, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }
  }, {
    key: 'getAllRatedMovies',
    value: function getAllRatedMovies() {
      var _this2 = this;

      console.log(this.state.movies);
      $.get(Url + '/getUserRatings').then(function (userRatedMovies) {
        console.log('response from server', userRatedMovies);
        _this2.setState({
          movies: userRatedMovies,
          allRatedMovies: true
        });
      });
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(event) {
      console.log(this.state.search, this.state.movies);
      if (event.charCode == 13 || event === 'clicked') {
        var that = this;
        for (var i = 0; i < this.state.movies.length; i++) {
          console.log(this.state.movies[i]);
          if (this.state.search === this.state.movies[i].title) {
            console.log(this.state.search);
            that.setState({
              movies: [this.state.movies[i]],
              allRatedMovies: false
            });
          } else {
            console.log('should now show them message that there is no such movie');
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var lable;
      var results;
      if (this.state.allRatedMovies === false) {
        lable = 'Back To All Rated Movies';
        results = this.state.movies.length === 0 ? React.createElement(
          'div',
          { className: 'errorMsg' },
          'Results cannot be found'
        ) : React.createElement(
          'div',
          { className: 'updateMsg' },
          'All match results:'
        );
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        lable = 'You have not rated any movies';
      } else {
        lable = 'All Rated Movies';
      }

      return React.createElement(
        'div',
        { className: 'MyRatings collection' },
        React.createElement(
          'div',
          { className: 'header', onClick: this.getAllRatedMovies.bind(this) },
          lable
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            value: this.state.search,
            placeholder: 'Insert Movie Title',
            onChange: this.handleChange.bind(this),
            onKeyPress: this.handleSearch.bind(this) }),
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this3.handleSearch.bind(_this3)('clicked');
              } },
            'search'
          )
        ),
        results,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return MyRatings;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJpIiwibGVuZ3RoIiwidGl0bGUiLCJsYWJsZSIsInJlc3VsdHMiLCJiaW5kIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlU2VhcmNoIiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsUzs7O0FBQ0oscUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSEFDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyxzQkFBZ0IsSUFGTDtBQUdYQyxjQUFRO0FBSEcsS0FBYjtBQUhpQjtBQVFsQjs7QUFFRDs7Ozs7d0NBQ29CO0FBQ2xCLFdBQUtDLGlCQUFMO0FBQ0Q7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFdBQUtDLFFBQUwsQ0FBYztBQUNaSCxnQkFBUUUsTUFBTUUsTUFBTixDQUFhQztBQURULE9BQWQ7QUFHRDs7O3dDQUdtQjtBQUFBOztBQUNsQkMsY0FBUUMsR0FBUixDQUFZLEtBQUtWLEtBQUwsQ0FBV0MsTUFBdkI7QUFDQVUsUUFBRUMsR0FBRixDQUFNQyxNQUFNLGlCQUFaLEVBQ0NDLElBREQsQ0FDTSwyQkFBbUI7QUFDdEJMLGdCQUFRQyxHQUFSLENBQVksc0JBQVosRUFBb0NLLGVBQXBDO0FBQ0QsZUFBS1QsUUFBTCxDQUFjO0FBQ1pMLGtCQUFRYyxlQURJO0FBRVpiLDBCQUFn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QyxTOztBQStGOUJDLE9BQU8vQixTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCx0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1vdmllc1tpXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VhcmNoID09PSB0aGlzLnN0YXRlLm1vdmllc1tpXS50aXRsZSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gpO1xyXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vdmllczogW3RoaXMuc3RhdGUubW92aWVzW2ldXSxcclxuICAgICAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBub3cgc2hvdyB0aGVtIG1lc3NhZ2UgdGhhdCB0aGVyZSBpcyBubyBzdWNoIG1vdmllJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIGxhYmxlO1xyXG4gICAgdmFyIHJlc3VsdHM7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnQmFjayBUbyBBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5SZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5BbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxhYmxlID0gJ1lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxhYmxlID0gJ0FsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MgY29sbGVjdGlvbic+IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAge3Jlc3VsdHN9XHJcbiAgICAgICAgPE1vdmllTGlzdCBtb3ZpZXM9e3RoaXMuc3RhdGUubW92aWVzfVxyXG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5NeVJhdGluZ3MgPSBNeVJhdGluZ3M7Il19