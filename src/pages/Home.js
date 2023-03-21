import React, {useEffect, useState} from 'react';
import {db, auth, storage} from '../firebase';
import {collection, query, where, onSnapshot, addDoc, Timestamp, orderBy, doc, setDoc, getDoc, updateDoc} from 'firebase/firestore';
import User from '../components/User';
import MessageForm from '../components/MessageForm';
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import Message from '../components/Message';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid

  useEffect(() => {
    const usersRef= collection(db, 'users')
    //qeury obj
    const q = query(usersRef, where('uid', 'not-in',[user1]))
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

  const selectUser = async (user) => {
    setChat(user);
    console.log(user);

    const user2 = user.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    
    const msgsRef = collection(db, 'messages', id, 'chat')
    const q = query(msgsRef, orderBy('createdAt', 'asc'))

    onSnapshot(q, (querySnaphot) => {
      let msgs = []
      querySnaphot.forEach(doc => {
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })
    
    // get last chat between logged in user and selected user
    const docSnap = await getDoc(doc(db, 'lastChat', id))
    // if last chat exists and chat is from selected user
    if(docSnap.data() && docSnap.data().from !== user1) {
      // update last chat doc, set unread to false
      await updateDoc(doc(db, 'lastChat', id) , {unread: false});
    }
  }

  console.log(msgs);

  const handleSubmit = async e => {
    e.preventDefault()

    const user2 = chat.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    
    let url; 
    if(img) {
      const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);
      const snap = await uploadBytes(imgRef, img)
      const downUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = downUrl; 
    }

    await addDoc(collection(db, 'messages', id,'chat'), {
      text, 
      from: user1, 
      to: user2, 
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    })

    await setDoc(doc(db, 'lastChat', id), {
      text, 
      from: user1, 
      to: user2, 
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "", 
      unread: true,
    })

    setText("");
  }
  return (
        <div className='home_container'>
        <div className='users_container'>
          {users.map(user => <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat} />)}
        </div>
        <div className='messages_container'>
          {chat ? ( 
          <>  
          <div className='messages_user'>
          <h3>{chat.name}</h3>
          </div>
          <div className='messages'>
            {msgs.length ? msgs.map((msg, i) => (
              <Message key={i} msg={msg} user1={user1}/>))
            :null}
          </div>
          <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setImg={setImg} /> 
          </>
          ) : ( <h3 className='no_conv'>Start a Conversation</h3>)
          }
        </div>
        </div>
    
  )
}

export default Home;