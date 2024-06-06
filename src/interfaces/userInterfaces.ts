export interface FriendInterface {
  _id: string;
  avatar: string;
  username: string;
}

export interface UserDataInterface {
  avatar: string;
  createdAt: Date;
  email: string;
  friends: FriendInterface[];
  fullName: string;
  phone: number;
  username: string;
  _id: string;
}
