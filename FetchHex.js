import React, { useState, useEffect, useReducer } from "react";
import { ColorInfo } from "./ColorInfo.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "input":
      return Object.assign(state, { color: action.payload });
    case "ready":
      return Object.assign(state, { status: "ready" });
    case "fetch":
      return Object.assign(state, { status: "loading" });
    case "success":
      return Object.assign(state, {
        status: "done",
        colorData: action.payload
      });
    case "failure":
      return Object.assign(state, { status: "error" });
    default:
      return state;
  }
};

export const FetchHex = () => {
  const [state, dispatch] = useReducer(reducer, {
    color: "FFFFFF",
    colorData: {},
    status: "ready"
  });

  const handleChange = function(e) {
    if (/^[a-fA-F\d]{6}$/.test(e.target.value)) {
      dispatch({ type: "ready", payload: e.target.value });
    }
    dispatch({ type: "input", payload: e.target.value });
  };

  const myController = new AbortController();
  const mySignal = myController.signal;

  const fetchColor = color => {
    fetch(`http://www.thecolorapi.com/id?hex=${color}`, { signal: mySignal })
      .then(response => {
        dispatch({ type: "fetch" });
        return response.json();
      })
      .then(res => {
        dispatch({ type: "success", payload: res });
      })
      .catch(err => {
        dispatch({ type: "failure" });
      });
  };

  useEffect(() => {
    if (state.status === "ready") {
      fetchColor(state.color);
    }
    return function cleanup() {
      myController.abort();
    };
  });

  let content = null;

  if (state.status === "loading") {
    content = <div>Loading...</div>;
  } else if (state.status === "done") {
    content = (
      <ColorInfo
        hsl={state.colorData.hsl.value}
        hsv={state.colorData.hsv.value}
        image={state.colorData.image.bare}
      />
    );
  } else if (state.status === "error") {
    content = <div>Connection failed</div>;
  }

  return (
    <div>
      <input value={state.color} onChange={handleChange} />
      {content}
    </div>
  );
};
