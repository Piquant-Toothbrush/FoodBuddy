var Friends = ({fof, sendRequest, sendWatchRequest, myFriends}) => (
 
<div className="myFriends collection">
  <div className='header'></div>
  <div className="errorMsg" style={{display: 'none'}} id='enterRealFriend'>Please enter something!</div>
  <div className="updateMsg" style={{display: 'none'}} id='reqSent'>Request sent!</div>
  <br/>
  <div className="errorMsg" style={{display: 'none'}} id='AlreadyReq'>Youve already sent a request to this user!</div>
  <br/>
  <br/>
  <h5 className="header lable">Your Friends</h5> 
  {myFriends.map(friend=>( 
  	<FriendEntry sendARequest={sendWatchRequest} Friend={friend[0]} Comp={friend[1]} fof={fof} /> 
   ))}
</div>

);

window.Friends = Friends;
