import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "../layout";
import Home from "../pages/Home";
import News from "../pages/news";
import UsersManagement from "../pages/users-management";
import ProjectsWithAuth from "../pages/projects-managment";
import UpdateNews from "../pages/news/actions/UpdateNews";
import CreateNews from "../pages/news/actions/CreateNews";
import CreateProject from "../pages/projects-managment/actions/CreateProject";
import UpdateProject from "../pages/projects-managment/actions/UpdateProject";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/tin-tuc/tao-moi" element={<CreateNews />} />
        <Route path="/tin-tuc/:id" element={<UpdateNews />} />
        <Route path="/quan-ly-nguoi-dung" element={<UsersManagement />} />
        <Route path="/quan-ly-du-an" element={<ProjectsWithAuth />} />
        <Route path="/du-an/tao-moi" element={<CreateProject />} />
        <Route path="/du-an/:id" element={<UpdateProject />} />
      </Route>
    </>
  )
);

export default router;