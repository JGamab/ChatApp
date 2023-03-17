import React, {useState, useEffect} from "react";
import Camera from "../components/svg/Camera";
import Img from "../Picture.jpg";
import {storage} from "../firebase";
import {ref, uploadBytes} from "firebase/storage";

const Profile = () => {
    const [img, setImg] = useState('')
    useEffect(() => {
        if(img) {
          const uploadImg = async () => {
            const imgRef = ref(
              storage,
              `avatar/${new Date().getTime()} - ${img.name}`
            );
            const snap = await uploadBytes(imgRef, img);
            console.log(snap.ref.fullPath)
            }
            uploadImg()
        }
    }, [img])
  return (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={Img} alt="avatar" />
          <div className="overlay">
            <div>
                <label htmlFor="photo">
                    <Camera />
                </label>
                <input type="file" accept="image/*" style={{display: "none"}} id='photo' onChange={e=> setImg(e.target.files[0])} />
            </div>
          </div>
        <div className="text_container">
          <h3>Username </h3>
          <p>Email</p>
          <hr />
          <small>Date Joined: ...</small>
        </div>
      </div>
      </div>
    </section>
  )
};

export default Profile;