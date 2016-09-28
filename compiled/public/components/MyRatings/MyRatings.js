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

      if (event.charCode == 13 || event === 'clicked') {
        var that = this;
        for (var i = 0; i < this.state.movies.length; i++) {
          if (this.state.search === this.state.movies[i].title) {
            console.log(this.state.search.title);
            that.setState({
              movies: searchResults,
              allRatedMovies: false
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJpIiwibGVuZ3RoIiwidGl0bGUiLCJzZWFyY2hSZXN1bHRzIiwibGFibGUiLCJyZXN1bHRzIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsc0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsc0JBQWdCLElBRkw7QUFHWEMsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLQyxpQkFBTDtBQUNEOzs7aUNBRVlDLEssRUFBTztBQUNsQixXQUFLQyxRQUFMLENBQWM7QUFDWkgsZ0JBQVFFLE1BQU1FLE1BQU4sQ0FBYUM7QUFEVCxPQUFkO0FBR0Q7Ozt3Q0FHbUI7QUFBQTs7QUFDbEJDLGNBQVFDLEdBQVIsQ0FBWSxLQUFLVixLQUFMLENBQVdDLE1BQXZCO0FBQ0FVLFFBQUVDLEdBQUYsQ0FBTUMsTUFBTSxpQkFBWixFQUNDQyxJQURELENBQ00sMkJBQW1CO0FBQ3RCTCxnQkFBUUMsR0FBUixDQUFZLHNCQUFaLEVBQW9DSyxlQUFwQztBQUNELGVBQUtULFFBQUwsQ0FBYztBQUNaTCxrQkFBUWMsZUFESTtBQUVaYiwwQkFBZ0I7QUFGSixTQUFkO0FBSUQsT0FQRDtBQVNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7O2lDQUNhRyxLLEVBQU87O0FBRWxCLFVBQUlBLE1BQU1XLFFBQU4sSUFBa0IsRUFBbEIsSUFBd0JYLFVBQVUsU0FBdEMsRUFBaUQ7QUFDL0MsWUFBSVksT0FBTyxJQUFYO0FBQ0EsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS2xCLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQmtCLE1BQXRDLEVBQThDRCxHQUE5QyxFQUFtRDtBQUNqRCxjQUFJLEtBQUtsQixLQUFMLENBQVdHLE1BQVgsS0FBc0IsS0FBS0gsS0FBTCxDQUFXQyxNQUFYLENBQWtCaUIsQ0FBbEIsRUFBcUJFLEtBQS9DLEVBQXNEO0FBQ3BEWCxvQkFBUUMsR0FBUixDQUFZLEtBQUtWLEtBQUwsQ0FBV0csTUFBWCxDQUFrQmlCLEtBQTlCO0FBQ0FILGlCQUFLWCxRQUFMLENBQWM7QUFDWkwsc0JBQVFvQixhQURJO0FBRVpuQiw4QkFBZ0I7QUFGSixhQUFkO0FBSUQ7QUFDRjtBQUNGO0FBQ0Y7Ozs2QkFHUTtBQUFBOztBQUNQLFVBQUlvQixLQUFKO0FBQ0EsVUFBSUMsT0FBSjtBQUNBLFVBQUksS0FBS3ZCLEtBQUwsQ0FBV0UsY0FBWCxLQUE4QixLQUFsQyxFQUF5QztBQUN2Q29CLGdCQUFRLDBCQUFSO0FBQ0FDLGtCQUFXLEtBQUt2QixLQUFMLENBQVdDLE1BQVgsQ0FBa0JrQixNQUFsQixLQUE2QixDQUE5QixHQUFvQztBQUFBO0FBQUEsWUFBSyxXQUFVLFVBQWY7QUFBQTtBQUFBLFNBQXBDLEdBQWdHO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUFBO0FBQUEsU0FBMUc7QUFDRCxPQUhELE1BR08sSUFBSSxLQUFLbkIsS0FBTCxDQUFXRSxjQUFYLElBQTZCLEtBQUtGLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQmtCLE1BQWxCLEtBQTZCLENBQTlELEVBQWlFO0FBQ3RFRyxnQkFBUSwrQkFBUjtBQUNELE9BRk0sTUFFQTtBQUNMQSxnQkFBUSxrQkFBUjtBQUNEOztBQUVELGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxzQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUtsQixpQkFBTCxDQUF1Qm9CLElBQXZCLENBQTRCLElBQTVCLENBQWpDO0FBQXFFRjtBQUFyRSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQ0UseUNBQU8sTUFBTSxNQUFiLEVBQW9CLElBQUcsWUFBdkI7QUFDRSx1QkFBVSxZQURaO0FBRUUsbUJBQU8sS0FBS3RCLEtBQUwsQ0FBV0csTUFGcEI7QUFHRSx5QkFBWSxvQkFIZDtBQUlFLHNCQUFVLEtBQUtzQixZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUpaO0FBS0Usd0JBQVksS0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FMZCxHQURGO0FBT0U7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQU0sT0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBRkY7QUFXR0QsZUFYSDtBQVlFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUt2QixLQUFMLENBQVdDLE1BQTlCO0FBQ0Esa0JBQVEsS0FBS0YsS0FBTCxDQUFXNEIsTUFBWCxDQUFrQkgsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVpGLE9BREY7QUFrQkQ7Ozs7RUF6RnFCSSxNQUFNQyxTOztBQTRGOUJDLE9BQU9oQyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcblxyXG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VhcmNoID09PSB0aGlzLnN0YXRlLm1vdmllc1tpXS50aXRsZSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gudGl0bGUpO1xyXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vdmllczogc2VhcmNoUmVzdWx0cyxcclxuICAgICAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB2YXIgbGFibGU7XHJcbiAgICB2YXIgcmVzdWx0cztcclxuICAgIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdCYWNrIFRvIEFsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPlJlc3VsdHMgY2Fubm90IGJlIGZvdW5kPC9kaXY+KSA6ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPkFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyAmJiB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgbGFibGUgPSAnWW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFibGUgPSAnQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyBjb2xsZWN0aW9uJz4gXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRBbGxSYXRlZE1vdmllcy5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXHJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7cmVzdWx0c31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxud2luZG93Lk15UmF0aW5ncyA9IE15UmF0aW5nczsiXX0=