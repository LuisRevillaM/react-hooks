import React from "react";

export const ColorInfo= (props)=>{
  return (
    <div>
      <div>{props.hsl}</div>
      <div>{props.hsv}</div>
      <img alt="color image" src={props.image} />
    </div>
  );
}
