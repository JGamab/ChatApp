import React from 'react'
import Img from '../default-avatar.png'
const User = ({user}) => {
  return (
    <div className='use_wrapper'>
    <div className='user_info'>
        <div className='user_detail'>
            <img src={user.avatar || Img} alt='avatar' className='avatar' />
            <h4>{user.name}</h4>
        </div>
        <div
            className= {`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
    </div>
    </div>
  )
}

export default User