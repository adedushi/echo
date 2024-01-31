import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
import SignupForm from './components/SessionForms/SignupForm';
import Echos from './components/Echos/Echos';
import Profile from './components/Profile/Profile';
import EchoCompose from './components/Echos/EchoCompose';
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
            path: "new",
            element: <ProtectedRoute component={EchoCompose} />
          }
        ]
      },
       {
        path: "/profile/:userId",
        element: <Profile />,
        children: [
          {
            path: "echos",
            element: <Echos />,
          }
          // {
          //   path: "likes",
          //   element: <Likes />,
          // },
          // {
          //   path: "reverbs",
          //   element: <Reverbs />,
          // }
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