import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MultiForm from "../components/MultiForm";
import SubmissionTable from "../components/SubmissionTable";

const router = createBrowserRouter([
  {path: '/', element: <LoginPage/>},
  {path: '/register', element: <RegisterPage/>},
  {path: '/form', element: <MultiForm/>},
  {path: '/table', element: <SubmissionTable/>}
  
])

export default router;