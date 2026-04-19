import { OAuth2Client } from "google-auth-library";
import {
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_CLIENT_ID,
  HOST_URL,
  LINKEDIN_OAUTH_CLIENT_ID,
  LINKEDIN_OAUTH_CLIENT_SECRET,
} from "../../constants/env.constants.js";

class OAuthService {
  constructor() {
    this._client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);
  }

  getGithubAccessToken = async (code) => {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_OAUTH_CLIENT_ID,
          client_secret: GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenRes.json();

    return tokenData.access_token;
  };

  getLinkedinAccessToken = async (code) => {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${HOST_URL}/api/v1/oauth/provider/linkedin`,
      client_id: LINKEDIN_OAUTH_CLIENT_ID,
      client_secret: LINKEDIN_OAUTH_CLIENT_SECRET,
    });

    const tokenRes = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const tokenData = await tokenRes.json();

    return tokenData.access_token;
  };

  verifyGoogleToken = async (accessToken) => {
    const ticket = await this._client.verifyIdToken({
      idToken: accessToken,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
      id: payload.sub,
      email: payload.email,
      displayName: payload.name,
      avatar: payload.picture,
      accessToken,
    };
  };

  verifyGithubToken = async (accessToken) => {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    let email = data.email;

    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails = await emailRes.json();
      email = emails.find((e) => e.primary)?.email;
    }

    return {
      id: data.id,
      email,
      displayName: data.name || data.login,
      avatar: data.avatar_url,
      accessToken,
    };
  };

  verifyFacebookToken = async (accessToken) => {
    const res = await fetch(
      `https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`,
    );

    const data = await res.json();

    return {
      id: data.id,
      email: data.email,
      displayName: data.name,
      avatar: data.picture?.data?.url,
      accessToken,
    };
  };

  verifyLinkedinToken = async (accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers,
    });

    const profileData = await profileRes.json();

    return {
      id: profileData.sub,
      email: profileData.email,
      displayName: profileData.name,
      avatar: profileData.picture,
      accessToken,
    };
  };
}

export const oAuthService = new OAuthService();
