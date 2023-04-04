import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Col, message, Row } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

import "./styles.scss";

const LoginPage = () => {
  const navigate = useNavigate();

 
  const loginWithGoogle = (token: string) => {
    axios.post("/auth/login", { token }).then(({ data }) => {
      localStorage.setItem("user", JSON.stringify(data));
      message.success("Welcome back " + data.name + "!");
      navigate('/events', {replace: true})
      //  TODO: set a context!
    });
  };

  return (
    <div className="login-page">
      <Row justify={"center"} align="middle">
        <Col>
          <GoogleOAuthProvider clientId="379793684599-ha9me9uke75qe71lkgm17hak49okc7jv.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential)
                  loginWithGoogle(credentialResponse.credential);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </Col>
      </Row>

    </div>
  );
};

export default LoginPage;
