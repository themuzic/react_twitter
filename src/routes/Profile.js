import App from "components/App";
import { authService, firebaseDB } from "fb";
import { updateProfile } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newName, setNewName] = useState(userObj.displayName);
  const navigate = useNavigate();
  const handleRedirect = () => navigate("/");

  const onLogOutClick = () => {
    authService.signOut(authService.getAuth());
    handleRedirect();
    refreshUser();
  };

  const getMyTweets = async () => {
    const q = query(
      collection(firebaseDB, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {});
  };

  const onChange = (event) => {
    setNewName(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newName) {
      await updateProfile(userObj, { displayName: newName });
    }
    refreshUser();
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <div className="container">
      <form className="profileForm" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          className="formInput"
          onChange={onChange}
          value={newName}
          autoFocus
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
