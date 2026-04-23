export const apiUrls = {
  auth: {
    refresh: "/auth/refresh",
    me: "/auth/me",
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
  },
  oAuth: "/oauth/provider",
  profile: {
    fetchProfile: "/user/profile",
    updateProfile: "/user/profile",
    uploadImageToDrive: "/user/profile/drive/upload",
    uploadImageToCloudinary: "/user/profile/cloudinary/upload",
  },
};
