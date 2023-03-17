import React, {useEffect, useState} from 'react';
import {db, auth} from '../firebase';
import {collection, query, where, onSnapshot, snapshotEqual, SnapshotMetadata, doc} from 'firebase/firestore';
import User from '../components/User';

const Home = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    const usersRef= collection(db, 'users')
    //qeury obj
    const q = query(usersRef, where('uid', 'not-in',[auth.currentUser.uid]))
    //execution
    const unsub = onSnapshot(q, (querySnaphot) => {
      let users = [];
      querySnaphot.forEach(doc => {
        users.push(doc.data());
      })
      setUsers(users);
    })
    return () => unsub();

  }, [])
  console.log(users);
  return (
        <div className='home_container'>
        <div className='users_container'>
          {users.map(user => <User key={user.uid} user={user}/>)}
        </div>
        </div>
    
  )
}

export default Home;