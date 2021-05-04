import { useEffect, useState } from "react";
import categoryFacade from "../facades/categoryFacade"
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error";
import {
  Link,
  useRouteMatch
} from "react-router-dom";

export default function Home({isLoggedIn, categories, setCategories}) {
  const [error, setError] = useState("");
  let {url} = useRouteMatch();

  useEffect(() => {
    categoryFacade.getAllCategories()
    .then(res => {
      setCategories([...res])
    })
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
      <h4 style={{marginTop: "20px", marginBottom: "20px"}}>Choose a topic to read and write threads about to get started.</h4>
      {isLoggedIn && (
        <p style={{fontSize: "12px"}}>Note: if you want to edit your profile, you can do so by clicking your profile picture in the top right corner.</p>
      )}
      <div className="container">
      <p style={{ color: "red" }}>{error}</p>
      <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
        <thead>
        </thead>
        <tbody>
      {categories.map((cat) => {
        return (
        <tr key={cat.id} style={{border: "solid black 1px"}}>
          <td style={{fontSize: "24px"}}><Link to={`${url}/${cat.id}`}>{cat.name}</Link></td>
        </tr>
        )
      })}
      </tbody>
      </table>
      </div>
    </div>
  );
}
