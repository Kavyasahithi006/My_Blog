import React from "react";
import { SignIn } from "@clerk/clerk-react";

function Signin() {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/fitness-concept-with-dumbbells-frame_23-2148531434.jpg?t=st=1742046148~exp=1742049748~hmac=5fe042d5f4126777a39083155e35b965403257447b6ace73f6e69e4696495bc5&w=1380')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
        <SignIn />
    </div>
  );
}

export default Signin;
