class StarRatingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userRating: this.props.movie.score,
      ratingUpdated: false
    };
  }

  onStarClick(event) {
    this.setState({userRating: event.target.value});
    this.updateRating(event.target.value);
  }

  updateRating(rating) {
    let movieObj = {
      title: this.props.movie.title,
      id: this.props.movie.id,
      rating: rating
    };
    $.post(Url + '/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
      this.setState({
        ratingUpdated: true
      });
    });
  }

  render() {
    let stars;
    if (this.state.userRating === 1) {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" checked="true" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    } else if (this.state.userRating === 2) {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" checked="true" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    } else if (this.state.userRating === 3) {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" checked="true" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    } else if (this.state.userRating === 4) {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" checked="true" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    } else if (this.state.userRating === 5) {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" checked="true" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    } else {
      stars = (
        <form className="star-rating col-sm-10">
          <input id="star-rating" type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
          <input id="star-rating" type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
        </form>
        );
    }
		return (
		<div className="userRating col s4">
			{(this.state.userRating === null) ? <div className="notRatedMsg">Please rate this movie</div> : <div className="yourRating">Your Rating Is <b>{this.state.userRating}/5</b></div>}
      {stars}
			{(this.state.ratingUpdated) ? <div className="updateMsg">Rating Updated!</div> : ''}
		</div>);
  }
}


window.StarRatingComponent = StarRatingComponent;