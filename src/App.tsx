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
          {/* Authentication */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <SocketProvider>
                <AuthProvider>
                  <Routes>
                    <Route
                      path="/"
                      element={<Home user={userData?.data?.data} />}
                    />
                    <Route
                      path="/add-post"
                      element={<AddPostPage user={userData?.data?.data} />}
                    />
                    <Route
                      path="/friends"
                      element={<Friends user={userData?.data?.data} />}
                    />
                    <Route
                      path="/notifications"
                      element={<Notification user={userData?.data?.data} />}
                    />
                    <Route
                      path="/messages"
                      element={<Messages user={userData?.data?.data} />}
                    />
                    <Route
                      path="/chat/:chatId"
                      element={<Chat user={userData?.data?.data} />}
                    />
                    <Route
                      path="/settings"
                      element={<Setting user={userData?.data?.data} />}
                    />
                  </Routes>
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
