import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavigatorSwitch from "./AppNavigatorSwitch";

console.log('react-router-dom')

export default () => {
  return (
    <Router>
      <AppNavigatorSwitch />
    </Router>
  );
};
