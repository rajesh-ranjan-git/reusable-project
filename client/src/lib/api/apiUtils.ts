export const BASE_HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;
export const BASE_API_URL = `${BASE_HOST_URL}/api`;

export const apiUrls = {
  register: `${BASE_API_URL}/user/register`,
  login: `${BASE_API_URL}/user/login`,
  logout: `${BASE_API_URL}/user/logout`,
};
