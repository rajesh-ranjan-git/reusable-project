import { oAuthConfig } from "@/config/oauth.config";
import { openPopup } from "@/utils/oauth.utils";
import { apiUrls } from "@/lib/api/apiUtils";
import { api, ApiErrorResponse, ApiResponse } from "@/lib/api/apiHandler";

declare global {
  interface Window {
    google: any;
    FB: any;
  }
}

export const loadGoogleScript = () => {
  try {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  } catch (error) {
    return error;
  }
};

export const handleGoogleLogin = () => {
  try {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.accounts) {
        reject("Google SDK not loaded");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: oAuthConfig.google.clientId,
        callback: (response: any) => {
          resolve(response.credential);
        },
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          reject("Google login failed");
        }
      });
    });
  } catch (error) {
    return error;
  }
};

export const handleGithubLogin = () => {
  const { clientId, redirectUri } = oAuthConfig.github;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  openPopup(url, "github-oauth");
};

export const handleFacebookLogin = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject("Facebook login failed");
        }
      },
      { scope: "email,public_profile" },
    );
  });
};

export const handleLinkedInLogin = () => {
  const { clientId, redirectUri } = oAuthConfig.linkedin;

  const scope = encodeURIComponent("openid profile email");

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  openPopup(url, "linkedin-oauth");
};

export const loginWithProvider = async (provider: string) => {
  switch (provider) {
    case "google":
      await loadGoogleScript();
      return await handleGoogleLogin();

    case "github":
      return handleGithubLogin();

    case "facebook":
      return await handleFacebookLogin();

    case "linkedin":
      return handleLinkedInLogin();

    default:
      throw new Error("Unsupported provider");
  }
};

export const providerLogin = async (
  provider: string,
  token: string,
): Promise<ApiResponse> => {
  try {
    return await api.post(`${apiUrls.oAuth}/${provider}`, { token });
  } catch (error) {
    return error as ApiErrorResponse;
  }
};
