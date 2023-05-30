import React, { useState, useEffect } from "react";
import SearchAdvance from './SearchData'

const Home = () => {
  const [content, setContent] = useState("");

  return (
    <div className="container">
      <header className="jumbotron">
         <SearchAdvance/>
      </header>
    </div>
  );
};

export default Home;