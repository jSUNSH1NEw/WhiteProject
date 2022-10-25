import React from "react";


import "../styles/css/404.css";

function Quatre100() {
    return (
        <div id="app">
            <div id="wrapper">
                <h1 class="glitch" data-text="404"> 404 </h1>
                <h2 class="sub">It seems you got</h2>
                <h2 class="sub">a problem with your url</h2>
            </div>
            <div id="buttonWrapper">
                <button class="button">
                    <a href="/dashboard" class="buttonA" >Go back</a>
                </button>
            </div>
        </div>
    );
}

export default Quatre100;