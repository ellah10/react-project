import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const handleLogout = async () => {
  await signOut(auth);
};