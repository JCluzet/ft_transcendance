import React, { useEffect } from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
// import axios from "axios";
import { accountService } from "../hooks/account_service";
import axios from "axios";
import ProfilSettings from "./ProfilSettings";
// import Login from "../pages/Login";

const Header = () => {
async function catchUserInfo() {
    var config = {
        method: "get",
        url: "/users/profile/" + accountService.userLogin(),
        headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
    .then(function (response) {
        // console.log("user info response: " + JSON.stringify(response.data));
        setAvatarUrl(response.data.avatarUrl);
        setUsername(response.data.name);
    })
    .catch(function (error) {
        // if the error is unauthorized, we redirect to login
        // if (error.response.status === 401) {
            // accountService.logout();
            // localStorage.setItem("Alert", "You have been disconnected for inactivity");
        // }
    });
    setTimeout(() => {
        catchUserInfo();
    }, 1000);
}

    // state
    
    const [avatarUrl, setAvatarUrl] = React.useState(null);
    const [username, setUsername] = React.useState(null);
  useEffect(() => {
    catchUserInfo();
  }, []);

  const HomeClick = () => {
    window.location.href = "/";
  };

  const [settings, setSettings] = React.useState(false);

  const SettingsOpen = () => {
    if (settings === false) {
      setSettings(true);
    } else {
      setSettings(false);
    }
  };

  return (
    <nav>
      <div className="container">
        <div className="div-header">
          <Logo className="logo-header" onClick={HomeClick} />
          {/* display image (getProfileImage()) */}
          <div className="div-profile-header-container-with-settings">
            <div className="div-profile-header">
              <img
                onClick={SettingsOpen}
                className="settings-image"
                src={SettingsImg}
                alt="settings"
              />
              <div className="div-profile-name">
                <div className="text-profile-name">{username}</div>
              </div>
              <div className="div-profile-picture">
                <img
                  className="profile-image"
                  src={avatarUrl}
                  alt="profilepicture"
                />
              </div>
            </div>
            {settings && <ProfilSettings />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
