export const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;
export const HOST_VERSION = process.env.NEXT_PUBLIC_HOST_VERSION;
export const API_URL = `${HOST_URL}/api/${HOST_VERSION}`;

export const apiUrls = {
  register: `${API_URL}/register`,
  login: `${API_URL}/login`,
  logout: `${API_URL}/logout`,
};
