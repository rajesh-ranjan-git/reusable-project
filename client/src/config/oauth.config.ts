import {
  FACEBOOK_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_ID,
  HOST_API_URL,
  LINKEDIN_OAUTH_CLIENT_ID,
} from "@/constants/env.constants";

export const oAuthConfig = {
  google: {
    clientId: GOOGLE_OAUTH_CLIENT_ID,
    redirectUri: `${HOST_API_URL}/oauth/provider/google`,
  },
  github: {
    clientId: GITHUB_OAUTH_CLIENT_ID,
    redirectUri: `${HOST_API_URL}/oauth/provider/github`,
  },
  facebook: {
    clientId: FACEBOOK_OAUTH_CLIENT_ID,
    redirectUri: `${HOST_API_URL}/oauth/provider/facebook`,
  },
  linkedin: {
    clientId: LINKEDIN_OAUTH_CLIENT_ID,
    redirectUri: `${HOST_API_URL}/oauth/provider/linkedin`,
  },
};
