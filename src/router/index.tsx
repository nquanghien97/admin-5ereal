import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "../layout";
import Home from "../pages/Home";
import News from "../pages/news";
import UsersManagement from "../pages/users-management";
import ProjectsWithAuth from "../pages/projects-managment";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/quan-ly-nguoi-dung" element={<UsersManagement />} />
        <Route path="/quan-ly-du-an" element={<ProjectsWithAuth />} />
      </Route>
    </>
  )
);

export default router;