import React, { useEffect } from "react";
import Chip from "../../components/Chip/Chip";
import "./DisplayInfo.css";

const DisplayInfo = ({ user, setuser }) => {
  useEffect(() => {
    console.log("info - Received user prop:", user);
  }, [user]);

  //makes the rendering process wait until the user is loaded
  if (!user) {
    return (
      <div className="info-display">
        <p className="text-gray-500 text-sm">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="info-display">
      <h3 className="home-page-titles">ALLERGIES</h3>
      {user.allergies && user.allergies.length > 0 ? (
        user.allergies.map((allergy, index) => (
          <Chip key={index} label={allergy} type="info" />
        ))
      ) : (
        <Chip label={"none"} type="default" />
      )}
      <h3 className="home-page-titles">DIETARY PREFERENCES</h3>
      {user.dietary_pref && user.dietary_pref.length > 0 ? (
        user.dietary_pref.map((pref) => (
          <Chip key={pref.id || pref.name} label={pref.name} type="info" />
        ))
      ) : (
        <Chip label={"none"} type="default" />
      )}
    </div>
  );
};

export default DisplayInfo;
