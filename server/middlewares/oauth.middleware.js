import AppError from "../services/error/error.service.js";
import { oAuthService } from "../services/oauth/oauth.service.js";
import { asyncHandler, toTitleCase } from "../utils/common.utils.js";

export const oauthVerifyMiddleware = asyncHandler(async (req, res, next) => {
  const { provider } = req.data.params;

  if (!["google", "github", "facebook", "linkedin"].includes(provider)) {
    throw AppError.unprocessable({
      message: "Provider must be google, github, facebook or linkedin only!",
      code: "OAUTH VALIDATION FAILED",
      details: { provider },
    });
  }

  let token = null;

  if (provider === "github") {
    const code = req.data.query.code;

    token = await oAuthService.getGithubAccessToken(code);
  } else if (provider === "linkedin") {
    const code = req.data.query.code;

    token = await oAuthService.getLinkedinAccessToken(code);
  } else {
    token = req.data.body.token;
  }

  if (!token) {
    throw AppError.unprocessable({
      message: `Please provide OAuth token for ${toTitleCase(provider)}!`,
      code: "OAUTH VALIDATION FAILED",
      details: { token },
    });
  }

  let profile;

  if (provider === "google") {
    profile = await oAuthService.verifyGoogleToken(token);
  }

  if (provider === "github") {
    profile = await oAuthService.verifyGithubToken(token);
  }

  if (provider === "facebook") {
    profile = await oAuthService.verifyFacebookToken(token);
  }

  if (provider === "linkedin") {
    profile = await oAuthService.verifyLinkedinToken(token);
  }

  req.data.oauthProfile = profile;

  next();
});
