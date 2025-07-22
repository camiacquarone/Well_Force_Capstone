import React, { useEffect } from "react";
import Chip from "../../components/Chip/Chip";

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
    <div className="info_display">
      <h3>ALLERGIES</h3>
      {user.allergies && user.allergies.length > 0 ? (
        user.allergies.map((allergy, index) => (
          <Chip key={index} label={allergy} type="allergy" />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No allergies specified.</p>
      )}
      <h3>DIETARY PREFERENCES</h3>
      {user.dietary_pref && user.dietary_pref.length > 0 ? (
        user.dietary_pref.map((pref) => (
          <Chip key={pref.id || pref.name} label={pref.name} type="dietary" />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No dietary preferences set.</p>
      )}
    </div>
  );
};

export default DisplayInfo;
