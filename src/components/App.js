import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fb";
import { updateCurrentUser } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const checkUserState = () => {
    authService.getAuth().onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        if (user.displayName === null) {
          user.displayName = user.email.split("@")[0];
        }
        setUserObj(user);
      }
      setInit(true);
    });
  };

  useEffect(() => {
    checkUserState();
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(
      authService.getAuth(),
      authService.getAuth().currentUser
    );
    setUserObj(authService.getAuth().currentUser);
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}

      {/* <footer style={{ marginTop: "10px" }}>
        &copy; {new Date().getFullYear()} React-Twitter
      </footer> */}
    </>
  );
}
export default App;
