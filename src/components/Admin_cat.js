import categoryFacade from "../facades/categoryFacade"
import { useEffect, useState } from "react";
import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error"
import { Modal } from "react-bootstrap";

export default function Admin_cat () {
    
    const [categories, setCategories] = useState([]);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("")
    const [addModelErr,setAddModalErr] = useState("")
    const [editModelErr, setEditModalErr] = useState("")
    const [newCat, setNewCat] = useState({title : ""})
    const [editCat, setEditCat] = useState({id : "",title: ""})
    const [showAddModal, setShowAddModal] = useState(false)
    const handleAddModal = () => { setShowAddModal(!showAddModal)}
    const [showEditModal, setShowEditModal] = useState(false)
    const handleHideEdit = () => setShowEditModal(false)
    
    useEffect(() => {
      categoryFacade.getAllCategories().then((res  => setCategories([...res])))
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setErr)
        } else {
          setErr("No response from API. Make sure it is running.");
        }
      });
    }, [msg]);


    const handleShowEdit = (e) => {
        setMsg("")
        let input = parseInt(e.target.value)
        let toEdit = categories.find(cat => cat.id === input)
        setEditCat({...toEdit}) 
        setShowEditModal(!showEditModal)
    }
    const handleEditCat = (e) => {
      setEditCat({ ...editCat, [e.target.name]: e.target.value })
      setErr("")
      setAddModalErr("")
  }  
    const handleEditSubmit = (e) => {
      e.preventDefault()
        categoryFacade.editCategory(editCat).then(res => {setMsg("Changes saved")
        setShowEditModal(false)})
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setEditModalErr)
          } else {
            setEditModalErr("No response from API. Make sure it is running.");
          }
        });
      }
    
    const deleteCategory = (e) => {
        e.preventDefault();
        categoryFacade.deleteCategory(e.target.value).then((res) => 
        setMsg(`Category with ${res.id} has been deleted`))
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setErr)
          } else {
            setErr("No response from API. Make sure it is running.");
          }
        });
      };

    const handleNewCat = (e) => {
        setNewCat({ ...newCat, [e.target.name]: e.target.value })
        setErr("")
        setAddModalErr("")
    }   

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if(newCat.name.length <= 1){
            setAddModalErr("Category input invalid")
        }else {
            categoryFacade.addCategory(newCat).then(res => {
              handleAddModal(); 
              setMsg(`${res.name} has been added` )
              setNewCat({title : ""})
            } )
            .catch((promise) => {
              if (promise.fullError) {
                printError(promise, setAddModalErr)
              } else {
                setAddModalErr("No response from API. Make sure it is running.");
              }
            });
        }
    }
  
   

    return (    
    <div>
    <button style={{marginTop: 10}} className="btn btn-success" onClick={handleAddModal}>Add category</button>
    <p style={{color:"green"}}>{msg !== "" ? msg : ""} </p>
    <p style={{color: "red"}}>{err !== "" ? err : ""} </p>
    <div className="container">
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => {
          return (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                <button className="btn btn-danger" value = {cat.id} onClick={deleteCategory}>
                  Delete
                </button>
                <button className="btn btn-primary" value = {cat.id} onClick={handleShowEdit} >
                  Edit
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  <Modal show={showAddModal} onHide={handleAddModal}>
      <Modal.Header closeButton>
        <Modal.Title style={{ marginLeft: "28%" }}>Add new category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit= {handleAddSubmit} style={{ textAlign: "center" }}>
          <label>Category name</label>
          <br />
          <input
            name = "name"
            value={newCat.name}
            onChange={handleNewCat}
          ></input>
          <br />
          <br />
          <input
            value= "Submit"
            type="submit"
            className="btn btn-secondary"
          ></input>
          <br/>
          <br/>
          <p style={{ color: "red" }}>{addModelErr}</p>
        </form>
      </Modal.Body>
    </Modal>
    <Modal show={showEditModal} onHide={handleHideEdit}>
      <Modal.Header closeButton>
        <Modal.Title style={{ marginLeft: "35%" }}>Edit category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleEditSubmit}style={{ textAlign: "center" }}>
          <label>Category name</label>
          <br />
          <input
            onChange={handleEditCat}
            name = "name"
            minLength={2}
            value={editCat.name}
          ></input>
          <br />
          <br />
          <input 
            value= "Save changes"
            type="submit"
            className="btn btn-secondary"
          ></input>
          <br/>
          <br/>
          <p style={{ color: "red" }}>{editModelErr}</p>
        </form>
      </Modal.Body>
    </Modal>
  </div>
  )
}