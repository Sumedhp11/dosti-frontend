import { UserDataInterface } from "@/interfaces/userInterfaces";

const ProfileSection = ({ user }: { user: UserDataInterface }) => {
  return (
    <div className="w-full h-full flex justify-center items-center shadow-[-3px_0px_15px_0px_#a0aec0]">
      <div className="flex flex-col w-fit justify-center items-center space-y-4 p-4 bg-[#987070] shadow rounded-lg">
        <div className="lg:w-44 w-32 lg:h-44 h-32">
          <img
            src={`${import.meta.env.VITE_CLOUDINARY_URL}${user?.avatar}`}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <p className="text-lg font-semibold text-white">{user?.username}</p>
        <p className="text-sm font-medium text-white">{user?.email}</p>
        <p className="text-sm font-medium text-white">
          Joined At : {new Date(user?.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
