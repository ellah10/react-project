import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("✅ Account created successfully! Redirecting to login...");
      navigate("/login");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage("❌ Error: " + error.message);
      } else {
        setMessage("❌ An unknown error occurred.");
      }
    }
  };

  return (
    <div className="registration">
      <h2>user registration</h2>
      <div className="form-control">
        <label htmlFor="email">email</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div className="form-control">
        <label htmlFor="password">password</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <button onClick={handleSignUp}>Register</button>
       {message && <p style={{ marginTop: "10px", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default SignUp;
