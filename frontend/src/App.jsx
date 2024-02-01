import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
import SignupForm from './components/SessionForms/SignupForm';
import Echos from './components/Echos/Echos/Echos'
import Profile, { Feed } from './components/Profile/Profile';
import ReplyCompose from './components/Echos/ReplyCompose/ReplyCompose';
import { getCurrentUser } from './store/session';
import About from './components/About/About';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthRoute component={MainPage} />
    },
    {
      path: "signup",
      element: <AuthRoute component={SignupForm} />
    },
    {
      path: "/about",
      element: <About />
    },
  {
    element: <Layout />,
    children: [
      {
        path: "echos",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ProtectedRoute component={Echos} />
          },
          {
            path: "reply",
            element: <ProtectedRoute component={ReplyCompose} />
          }
        ]
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
        children: [
          {
            index: true,
            element: <Navigate to="./echos" replace />
          },
          {
            path: "echos",
            element: <Feed feedType={"profileFeed"} />
          },
          {
            path: "likes",
            element: <Feed feedType={"likes"} />
          },
          {
            path: "reverbs",
            element: <Feed feedType={"reverbs"} />
          },
        ]
      }
    ]
  }
]);

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).finally(() => setLoaded(true));
  }, [dispatch]);

  return loaded && <RouterProvider router={router} />;
}

export default App;