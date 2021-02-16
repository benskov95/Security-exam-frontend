import { useState } from "react";
import exampleFacade from "../facades/exampleFacade";

export default function Example() {
  const [example, setExample] = useState({});
  const handleClick = (e) => {
    e.preventDefault();
    exampleFacade.exampleMethod1().then((data) => setExample(data));
  };
  return (
    <div>
      <h1>Example</h1>
      <p>Click the button to get some random data from various APIs</p>
      <button onClick={handleClick} className="btn btn-secondary">Click me</button>
      <br />
      <h3>{typeof example.quote !== "undefined" ? "Yes Or No API" : ""}</h3>
      <p>{example.answer}</p>
      <img src={example.image} alt=""></img>
      <h3>{typeof example.quote !== "undefined" ? "Cat Facts API" : ""}</h3>
      <p>{example.catFact}</p>
      <h3>{typeof example.quote !== "undefined" ? "Kanye Quote API" : ""}</h3>
      <p>{example.quote}</p>
      <h3>{typeof example.quote !== "undefined" ? "Chuck Norris API" : ""}</h3>
      <p>{example.chuckJoke}</p>
      <h3>{typeof example.quote !== "undefined" ? "Dad Jokes API" : ""}</h3>
      <p>{example.dadJoke}</p>
    </div>
  );
}
