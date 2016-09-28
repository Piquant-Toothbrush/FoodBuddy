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
      var _this3 = this;

      console.log(this.state.search, this.state.movies);
      if (event.charCode == 13 || event === 'clicked') {
        (function () {
          var that = _this3;
          var found = false;

          _this3.state.movies.forEach(function (el, idx) {
            console.log(el);
            if (el.title === _this3.state.search) {
              console.log(_this3.state.search);
              that.setState({
                movies: [el],
                allRatedMovies: false
              });
              found = true;
            }
          });
          if (!found) {
            $("#movNotInColl").fadeIn(1000);
            $("#movNotInColl").fadeOut(1000);
            console.log('should now show them message that there is no such movie');
          }
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

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
                return _this4.handleSearch.bind(_this4)('clicked');
              } },
            'search'
          ),
          React.createElement(
            'h5',
            { id: 'movNotInColl', style: { display: 'none' } },
            this.state.search,
            ' isn\'t in your collection'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJmb3VuZCIsImZvckVhY2giLCJlbCIsImlkeCIsInRpdGxlIiwiZmFkZUluIiwiZmFkZU91dCIsImxhYmxlIiwicmVzdWx0cyIsImxlbmd0aCIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJkaXNwbGF5IiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsUzs7O0FBQ0oscUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSEFDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyxzQkFBZ0IsSUFGTDtBQUdYQyxjQUFRO0FBSEcsS0FBYjtBQUhpQjtBQVFsQjs7QUFFRDs7Ozs7d0NBQ29CO0FBQ2xCLFdBQUtDLGlCQUFMO0FBQ0Q7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFdBQUtDLFFBQUwsQ0FBYztBQUNaSCxnQkFBUUUsTUFBTUUsTUFBTixDQUFhQztBQURULE9BQWQ7QUFHRDs7O3dDQUdtQjtBQUFBOztBQUNsQkMsY0FBUUMsR0FBUixDQUFZLEtBQUtWLEtBQUwsQ0FBV0MsTUFBdkI7QUFDQVUsUUFBRUMsR0FBRixDQUFNQyxNQUFNLGlCQUFaLEVBQ0NDLElBREQsQ0FDTSwyQkFBbUI7QUFDdEJMLGdCQUFRQyxHQUFSLENBQVksc0JBQVosRUFBb0NLLGVB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QUsvQixLQUFMLENBQVdHLE1BQTVEO0FBQUE7QUFBQTtBQVJGLFNBRkY7QUFZR3VCLGVBWkg7QUFhRSw0QkFBQyxTQUFELElBQVcsUUFBUSxLQUFLMUIsS0FBTCxDQUFXQyxNQUE5QjtBQUNBLGtCQUFRLEtBQUtGLEtBQUwsQ0FBV2lDLE1BQVgsQ0FBa0JKLElBQWxCLENBQXVCLElBQXZCO0FBRFI7QUFiRixPQURGO0FBbUJEOzs7O0VBcEdxQkssTUFBTUMsUzs7QUF1RzlCQyxPQUFPckMsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiTXlSYXRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTXlSYXRpbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG1vdmllczogW10sXHJcbiAgICAgIGFsbFJhdGVkTW92aWVzOiB0cnVlLFxyXG4gICAgICBzZWFyY2g6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMoKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBnZXRBbGxSYXRlZE1vdmllcygpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubW92aWVzKTtcclxuICAgICQuZ2V0KFVybCArICcvZ2V0VXNlclJhdGluZ3MnKVxyXG4gICAgLnRoZW4odXNlclJhdGVkTW92aWVzID0+IHtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIHVzZXJSYXRlZE1vdmllcyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogdXNlclJhdGVkTW92aWVzLFxyXG4gICAgICAgIGFsbFJhdGVkTW92aWVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcclxuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxyXG4gIGhhbmRsZVNlYXJjaChldmVudCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gsdGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpIHtcclxuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGxldCBmb3VuZD1mYWxzZTtcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUubW92aWVzLmZvckVhY2goKGVsLGlkeCk9PntcclxuICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgaWYgKGVsLnRpdGxlPT09dGhpcy5zdGF0ZS5zZWFyY2gpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gpO1xyXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vdmllczogW2VsXSxcclxuICAgICAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGZvdW5kPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgICBpZiAoIWZvdW5kKXtcclxuICAgICAgICAgICQoXCIjbW92Tm90SW5Db2xsXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICQoXCIjbW92Tm90SW5Db2xsXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgbm93IHNob3cgdGhlbSBtZXNzYWdlIHRoYXQgdGhlcmUgaXMgbm8gc3VjaCBtb3ZpZScpO1xyXG4gICAgICAgfSAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIGxhYmxlO1xyXG4gICAgdmFyIHJlc3VsdHM7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnQmFjayBUbyBBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5SZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5BbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxhYmxlID0gJ1lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxhYmxlID0gJ0FsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MgY29sbGVjdGlvbic+IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgICA8aDUgaWQ9XCJtb3ZOb3RJbkNvbGxcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319Pnt0aGlzLnN0YXRlLnNlYXJjaH0gaXNuJ3QgaW4geW91ciBjb2xsZWN0aW9uPC9oNT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7cmVzdWx0c31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxud2luZG93Lk15UmF0aW5ncyA9IE15UmF0aW5nczsiXX0=