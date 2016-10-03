const FindMovieBuddy = ({buddyfunc, buddies}) => {
	let empty=buddies.length===0?"You've friended everybody!":"";
  return (
  <div className='movieBuddy collection'>
	  <div className='header'>Find Your Next Movie Buddy</div><br/>
     <div className='findFriend'>
    <input id='findFriendByName' placeholder="Enter friend you'd like to add here here"></input>
    <a  id="requestAFriend" className="waves-effect waves-light btn" onClick={buddyfunc}>send a friend request</a>
    </div>
	    <br/>
  <div className="errorMsg" style={{display: 'none'}} id='AlreadyReq2'>Youve already sent a request to this user!</div>
  <div className="errorMsg" style={{display: 'none'}} id='enterRealFriend2'>Please enter something!</div>
  <div className="errorMsg" style={{display: 'none'}} id='reqSent2'>Request sent!</div>
	{empty}
   {buddies.map((buddy, idx)=>{ if (buddy[1]===null) {buddy[1]='Nothing to compare'} return (<BuddyEntry idx={"view"+idx} buddyfunc={buddyfunc} Buddy={buddy[0]} BuddyScore={buddy[1]} /> )})}

  </div>
   
)};

window.FindMovieBuddy = FindMovieBuddy;



