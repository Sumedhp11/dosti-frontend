import { LogoutAPI } from "@/APIS/authAPI";
import logo from "@/assets/01beb2511d84baf8e0ce81f89243235a.jpg";
import { clearNotificationCount } from "@/redux/slices/notificationSlice";
import { RootState } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosNotifications } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Badge } from "./badge";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
const Header = () => {
  const dispatch = useDispatch();
  const notificationCount = useSelector(
    (state: RootState) => state.notification.NotificationCount
  );

  const navigate = useNavigate();
  const { mutate: logout } = useMutation({
    mutationFn: LogoutAPI,
    onSuccess: () => {
      sessionStorage.clear();
      navigate("/login");
    },
  });
  const handleLogout = () => {
    logout();
  };
  const handleNotificationOnclick = () => {
    navigate("/notifications");
    dispatch(clearNotificationCount());
  };
  return (
    <div className="w-full flex justify-between items-center   bg-[#987070] py-2 px-3">
      <div>
        <img
          src={logo}
          alt=""
          className="w-24 h-24 object-cover rounded-full"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <IoIosNotifications
            size={30}
            color="white"
            className="relative cursor-pointer"
            onClick={handleNotificationOnclick}
          />
          {notificationCount > 0 && (
            <Badge className="absolute top-5 rounded-full text-white bg-red-600 hover:text-white hover:bg-red-700 cursor-pointer">
              {notificationCount}
            </Badge>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger>
            <MdLogout size={30} color="white" className="cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-800"
                onClick={handleLogout}
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Sheet>
          <SheetTrigger>
            <GiHamburgerMenu
              size={30}
              color="white"
              className="cursor-pointer block lg:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SideBar mobile={true} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Header;
