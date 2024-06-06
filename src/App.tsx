import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { UserDataAPI } from "./APIS/authAPI";
import AuthProvider from "./components/AuthProvider";
import { SocketProvider } from "./lib/socketProvider";

const Register = lazy(() => import("@/pages/Register"));
const Verify = lazy(() => import("@/pages/Verify"));
const Login = lazy(() => import("@/pages/Login"));
const ForgetPassword = lazy(() => import("@/pages/ForgetPassword"));
const Home = lazy(() => import("@/pages/Home"));
const AddPostPage = lazy(() => import("@/pages/AddPostPage"));
const Friends = lazy(() => import("@/pages/Friends"));
const Notification = lazy(() => import("@/pages/Notification"));
const Messages = lazy(() => import("@/pages/Messages"));
const Chat = lazy(() => import("@/pages/Chat"));
const Setting = lazy(() => import("@/pages/Setting"));
const App = () => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: UserDataAPI,
  });

  return (
    <Router>
      <Suspense fallback={<p>Loading Page</p>}>
        <Routes>
          //authentication
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          //
          <Route
            path="/"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Home user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/add-post"
            element={
              <SocketProvider>
                <AuthProvider>
                  <AddPostPage user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/friends"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Friends user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/notifications"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Notification user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/messages"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Messages user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Chat user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
          <Route
            path="/settings"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Setting user={userData?.data?.data} />
                </AuthProvider>
              </SocketProvider>
            }
          />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
};

export default App;
