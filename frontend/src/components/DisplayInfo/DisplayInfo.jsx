import React from "react";
import Chip from "../../components/Chip/Chip";

const DisplayInfo = ({ user, setuser }) => {
  return (
    <div className="info_display">
      <h3>Allergies</h3>
      {user?.dietary_pref &&
      user.dietary_pref.length > 0 &&
      user.dietary_pref[0]?.Allergies &&
      user.dietary_pref[0].Allergies.length > 0 ? (
        user.dietary_pref[0].Allergies.map((allergy, index) => (
          <Chip key={index} label={allergy} type="allergy" /> // Use Chip with type="allergy"
        ))
      ) : (
        <p className="text-gray-500 text-sm">No allergies specified.</p>
      )}
      <h3>Dietary Preferences</h3>
    </div>
  );
};

export default DisplayInfo;
