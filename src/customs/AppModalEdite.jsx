import React from "react";
import AppModalAdd from "./AppModalAdd";

const AppModalEdite = (props) => {
  return <AppModalAdd {...props} submitText={props.submitText || "تحديث"} />;
};

export default AppModalEdite;
