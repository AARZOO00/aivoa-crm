import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  
  const user = result.user;
  
  localStorage.setItem("user", JSON.stringify({
    name: user.displayName,
    email: user.email,
    role: "Rep",
    territory: "Northeast",
  }));

  return user;
};