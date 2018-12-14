import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function ColorInfo(props) {
  return (
    <div>
      <div>{props.hsl}</div>
      <div>{props.hsv}</div>
      <img alt="color image" src={props.image} />
    </div>
  );
}

function FetchHex() {
  const [name, setName] = useState("FFFFFF");
  const [state, setState] = useState("toLoad");
  const [colorData, setColorData] = useState({});

  const handleChange = function(e) {
    if (/^[a-fA-F\d]{6}$/.test(e.target.value)) {
      setState("toLoad");
    }
    setName(e.target.value);
  };

  var myController = new AbortController();
  var mySignal = myController.signal;

  const fetchColor = color => {
    fetch(`http://www.thecolorapi.com/id?hex=${name}`, { signal: mySignal })
      .then(response => {
        setState("Loading");
        return response.json();
      })
      .then(res => {
        setColorData(res);
        setState("Ready");
      })
      .catch(err => {
        setState("error");
      });
  };

  useEffect(() => {
    if (state === "toLoad") {
      fetchColor();
    }

    return function cleanup() {
      myController.abort();
    };
  });

  let content = null;

  if (state === "Loading") {
    content = <div>Loading...</div>;
  } else if (state === "Ready") {
    content = (
      <ColorInfo
        hsl={colorData.hsl.value}
        hsv={colorData.hsv.value}
        image={colorData.image.bare}
      />
    );
  } else if (state === "error") {
    content = <div>Connection failed</div>;
  }

  return (
    <div>
      <input value={name} onChange={handleChange} />
      {content}
    </div>
  );
}

ReactDOM.render(<FetchHex />, document.getElementById("root"));
