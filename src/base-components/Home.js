import { useEffect, useState } from "react";
import categoryFacade from "../facades/categoryFacade"
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import Thread from "../components/Thread";

export default function Home({url, path}) {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("");

  useEffect(() => {
    categoryFacade.getAllCategories()
    .then(res => setCategories([...res]))
    .catch((promise) => {
      if (promise.fullError) {
        printError(promise, setError);
      } else {
        setError("No response from API. Make sure it is running.");
      }
    });
  }, []) 

  return (
    <div>
      <h1 style={{marginTop: "70px"}}> Welcome to Forum™  </h1>
      <div className="container">
      <p style={{ color: "red" }}>{error}</p>
      <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
        <thead>
        </thead>
        <tbody>
      {categories.map((cat) => {
        return (
        <tr key={cat.id} style={{border: "solid black 1px"}}>
          <td style={{fontSize: "24px"}}><Link to={`${url}/${cat.name}`}>{cat.name}</Link></td>
        </tr>
        )
      })}
      </tbody>
      </table>
      </div>
      <Switch>
        <Route exact path={path}>
          <h3>????</h3>
        </Route>
        <Route path={`${path}/:catId`}>
          <Thread />
        </Route>
      </Switch>
    </div>
  );
}
