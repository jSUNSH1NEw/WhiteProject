import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";


import React from "react";
import Content from "./pages/Content";
import Mint from "./pages/Mint";
import Referral from "./pages/Referral";
import Home from "./pages/appDashboard/dashboard"
import Quatre100 from "./pages/404"

import "./styles/css/style.css";

import firebase from "./components/Firebase";


const ref = firebase.firestore().collection("users");

const App = () => {

  return (
      <Routes>
        <Route index element={<Content />} />
        <Route path="mint" element={<Mint />} />
        <Route path="referral" element={<Referral />} />
        <Route path="/dashboard" exact={true} element={<Navigate to="/dashboard/home" replace />} /> 
        <Route path="/dashboard/*" element={<Home />} /> 
        <Route path="/*" element={<Quatre100 />} />
        <Route path="/dashboard/$*" element={<Quatre100 />} />

        {/* <Route path="/dashboard/mint/*" exact={true} element={<Navigate to="/*" replace />} />  */}
      </Routes>
  );
};

export { ref };
export default App;
