import { Link } from "react-router-dom"

const TableButton = () => {
  return (
    <div className="absolute  right-0 bg-blue-500 p-4 border rounded-lg hover:bg-inherit cursor-pointer mt-4 mr-4">
    <Link to="/table" className="text-white">
      Watch Your Submissions
    </Link>
  </div>
  
  )
}

export default TableButton