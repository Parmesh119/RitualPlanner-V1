import { NavLink } from "react-router-dom"
export default function Update_Delete() {
  return (
    <div className="flex justify-center items-center h-screen">
      <NavLink to="/notes/create"><button className="bg-blue-800 text-white rounded-md py-2 px-4">Add Note</button></NavLink>

      <NavLink to="/notes/modify/update/:id"><button className="bg-blue-800 text-white rounded-md py-2 px-4">Update</button></NavLink>
      
      <NavLink to="/notes/modify/delete/:id"><button className="bg-blue-800 text-white rounded-md py-2 px-4">Delete</button></NavLink>

      <NavLink to="/notes/detail/:id"><button className="bg-blue-800 text-white rounded-md py-2 px-4" >Show Details</button></NavLink>
    </div>
  )
}
