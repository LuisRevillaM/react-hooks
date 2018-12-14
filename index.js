import React, {useState} from "react";
import ReactDOM from "react-dom";



function Name(){

const [name, setName] = useState("Robert");



const handleChange = function(e){
  setName(e.target.value);
};

return (<div><input value={name} onChange={handleChange}/></div>);

}

ReactDOM.render(<Name />, document.getElementById('root'));
