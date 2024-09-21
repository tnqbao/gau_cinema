import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const SubmitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8443/api/users/login",
        {
          Username: username,
          Password: password,
          ExternalToken: null,
        }
      );

      localStorage.setItem("jwtToken", response.data.token);
      console.log("Response:", response.data);

      navigate("/home");
    } catch (error) {
      console.error(
        "There was an error logging in:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="w-full h-5/6">
      <form
        className="my-10 mx-20 flex flex-col items-center justify-center gap-2 p-5 bg-amber-300"
        onSubmit={SubmitLogin}
      >
        <input
          className="rounded-sm border-black py-2 px-1 basis-3/5"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="rounded-sm border-black py-2 px-1 basis-3/5"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-slate-600 text-white py-2 px-4 rounded" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
