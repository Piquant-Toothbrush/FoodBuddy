var SingleFriend = ({moviesOfFriend,onClick,friendName, change}) => {

console.log(friendName,'friendName');
	// console.log('props.moviesOfFriend', moviesOfFriend)
	if (!moviesOfFriend.length){
		return (
			<div>
			<a id="backToAllFriends" className="center waves-effect waves-light btn" onClick={() => (onClick("Friends"))}>Back to all friends</a>
			
			<h5 id="noFriendMovies" class="header lable">Sorry, {friendName} hasn't rated any movies.</h5>
			</div>
			)

	} else {
		return (
	  <div className="Home collection">
			<a id="backToAllFriends" className="center waves-effect waves-light btn" onClick={() => (onClick("Friends"))}>Back to all friends</a>
			<div className="header large"> list of {friendName}'s movies</div>
			<div className='moviesOfFriend'>
				{moviesOfFriend.map(movie => <MovieListEntry friendName={friendName} movie={movie} change={change}/> )}
			</div>
		</div>
		)
	}
};

window.SingleFriend = SingleFriend;
