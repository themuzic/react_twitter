import { fbStorage, firebaseDB } from "fb";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [newFileUrl, setNewFileUrl] = useState(tweetObj.attachmentUrl);
  const docRef = doc(firebaseDB, `tweets/${tweetObj.id}`);

  const onDeleteClick = async (event) => {
    event.preventDefault();
    const storage = fbStorage.getStorage();
    const fireStorageRef = fbStorage.ref(storage, tweetObj.attachmentUrl);
    if (window.confirm("Are you sure you wanna delete this tweet?")) {
      await deleteDoc(docRef);
      await deleteObject(fireStorageRef);
    }
  };

  const onUpdateClick = (event) => {
    event.preventDefault();
    updateDoc(docRef, {
      text: newTweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    setNewTweet(event.target.value);
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div key={tweetObj.id} className="tweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form className="container tweetEdit">
                <input
                  type="text"
                  value={newTweet}
                  onChange={onChange}
                  placeholder="Edit your tweet"
                  className="tweetInput"
                  required
                  autoFocus
                />
                <div>
                  <img src={newFileUrl} alt=""></img>
                </div>
                <button onClick={onUpdateClick} className="formBtn">
                  Edit
                </button>
                <button onClick={toggleEditing} className="formBtn cancelBtn">
                  Cancel
                </button>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <h4 className="text">{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} alt="" />
          )}
          <h4 className="date">
            {new Date(tweetObj.createdAt).toLocaleString()}
          </h4>
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={onDeleteClick} title="Delete">
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing} title="Edit">
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
