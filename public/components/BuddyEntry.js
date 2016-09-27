const BuddyEntry = ({Buddy, BuddyScore,buddyfunc, idx}) => (
  <div className='collection-item row'>
    <div className="col s3">
    	<img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
    </div>
    <div id="Friend" className="buddy col s9">
   		<h3 className="buddyName">{Buddy}</h3>
      <div className="buddyCompatibility">{(BuddyScore === 'Nothing to compare') ? `Compatability: ${Buddy} has not rated any movies` : `Compatability: ${BuddyScore}`}</div>
   		<a  id={idx} className='waves-effect waves-light btn' onClick={()=>{buddyfunc(Buddy, idx); console.log('clicked the right oen')}}>Send friend request</a> 
      <div id="friendReqConf"></div>
  	</div>
  </div>
)


window.BuddyEntry = BuddyEntry;

