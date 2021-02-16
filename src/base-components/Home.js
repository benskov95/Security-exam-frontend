import { useEffect, useState } from "react";
import { LOCAL_URL, REMOTE_URL } from "../utils/settings";

export let URL = "";

export default function Home() {
  const [currentURL, setCurrentURL] = useState(
    URL === LOCAL_URL ? "Local API" : URL === REMOTE_URL ? "Remote API" : "none"
  );

  useEffect(() => {}, [currentURL]);

  const changeURL = (e) => {
    URL = e.target.value;
    if (URL === LOCAL_URL) {
      setCurrentURL("Local API");
    } else {
      setCurrentURL("Remote API");
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <p>This is BornIT's SPA startcode</p>
      <br />
      <p style={{ fontWeight: "bold" }}>
        Select which API to use <br />
        Currently using: {currentURL}
      </p>
      <select onChange={changeURL}>
        <option value="">Choose...</option>
        <option value={LOCAL_URL}>Local API</option>
        <option value={REMOTE_URL}>Remote API</option>
      </select>
      <br /><br />
      <h2>Getting started</h2>
      <br />
      <p>
        If you have followed the README from the repo for this startcode<br />
        you should have your URLs set up properly and be ready to go. <br />
        From here, you should do the following:<br /> <br />

        - Select API to use <br />
        - Register new user (if first time) <br />
        - Log in <br />
        - Check out the provided example <br />
        - If you have a user with the admin role, check out the admin exclusive section

      </p>
    </div>
  );
}
