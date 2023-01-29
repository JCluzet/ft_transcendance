import { useState } from "react";
import { ReactComponent as Warning } from "../assets/images/warning.svg";

export default function Alert() {
  // state
  const [error, setError] = useState(localStorage.getItem("Alert"));
  const [popup, setPopup] = useState(localStorage.getItem("Popup"));
  // comportements

  const HandleError = () => {
    if (localStorage.getItem("Popup") != null) {
      setPopup(localStorage.getItem("Popup"));
      localStorage.removeItem("Popup");
      //   console.log("Popup");
      setTimeout(() => {
        setPopup(null);
        // console.log("Popup removed");
      }, 1000);
    }

    if (localStorage.getItem("Alert") != null) {
      setError(localStorage.getItem("Alert"));
      localStorage.removeItem("Alert");
      // console.log("alert");
      //   console.log(error);
      setTimeout(() => {
        setError(null);
        // console.log("alert removed");
      }, 2000);
    }

    setTimeout(HandleError, 100);
  };

  // affichage

  return (
    <div>
      {HandleError()}
      <br />
      <div className="center">
        <div className="alert-container">
          {error != null && (
            <div className="alert">
              <Warning className="warning-icon" />
              {error}
            </div>
          )}
          {popup && <div className="popup">{popup}</div>}
        </div>
      </div>
    </div>
  );
}
