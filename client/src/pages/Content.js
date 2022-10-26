import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "../components/Navbar";

import Screen1 from "../assets/phone1.png";
import Screen2 from "../assets/phone2.png";
import Screen3 from "../assets/phone3.png";
import Down from "../assets/chevron-down-solid.svg";
import AppleStore from "../assets/appStore.png";
import PlayStore from "../assets/googlePlay.png";
import Flex1 from "../assets/flex1.png";
import Flex2 from "../assets/flex2.png";
import Flex3 from "../assets/flex3.png";
import Jet from "../assets/jet-2.png";
import Roadmap from "../assets/roadmap.jpg"

import "../styles/css/style.css";
import { Accordion } from "../components/Accordion";

function App() {

  const BottomRef = useRef(null);
  const TopRef = useRef(null);

  const scrollBottom = () => {
    BottomRef.current.scrollIntoView({ behavior: "smooth" })
    TopRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>

    </>
  );
}

export default App;