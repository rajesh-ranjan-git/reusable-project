from types import SimpleNamespace


def to_namespace(obj):
    if isinstance(obj, dict):
        return SimpleNamespace(**{k: to_namespace(v) for k, v in obj.items()})
    elif isinstance(obj, list):
        return [to_namespace(i) for i in obj]
    else:
        return obj


app_config = to_namespace(
    {
        "name": "App Name",
        "description": "App's description",
    }
)

banner_fonts_config = to_namespace(
    {
        "big": {"name": "Big", "url": ""},
        "doom": {"name": "Doom", "url": ""},
        "standard": {"name": "Standard", "url": ""},
        "slant": {"name": "Slant", "url": ""},
        "ghost": {"name": "Ghost", "url": ""},
        "ansi_shadow": {"name": "ANSI Shadow", "url": ""},
        "epic": {"name": "Epic", "url": ""},
        "bloody": {"name": "Bloody", "url": ""},
        "cuber_large": {"name": "Cyberlarge", "url": ""},
    }
)

ansi_config = to_namespace(
    {
        "blue": "\x1b[34m",
        "green": "\x1b[32m",
        "yellow": "\x1b[33m",
        "red": "\x1b[31m",
        "magenta": "\x1b[35m",
    }
)


banner_themes_config = to_namespace(
    [
        {
            "name": "Cyber Blue",
            "gradient": ["#00eaff", "#0077ff"],
            "tagline_color": "#00eaff",
        },
        {
            "name": "Neon Purple",
            "gradient": ["#9d4edd", "#7b2cbf", "#5a189a"],
            "tagline_color": "#9d4edd",
        },
        {
            "name": "Sunset Pink-Blue",
            "gradient": ["#ff5f8f", "#ff99c8", "#00bbf9", "#00f5d4"],
            "tagline_color": "#ff5f8f",
        },
        {
            "name": "Retro 80s Neon",
            "gradient": ["#ff00ff", "#ff0099", "#00e5ff"],
            "tagline_color": "#ff00ff",
        },
        {
            "name": "Vercel Monochrome",
            "gradient": ["#ffffff", "#8d8d8d", "#333333"],
            "tagline_color": "#ffffff",
        },
        {
            "name": "Matrix Green",
            "gradient": ["#00ff41", "#00b300"],
            "tagline_color": "#00ff41",
        },
        {
            "name": "Gold Luxury",
            "gradient": ["#fff3b0", "#ffd60a", "#fca311", "#e85d04"],
            "tagline_color": "#fca311",
        },
        {
            "name": "Fire Lava",
            "gradient": ["#ff0000", "#ff7b00", "#ffb100"],
            "tagline_color": "#ff7b00",
        },
        {
            "name": "Ice Blue",
            "gradient": ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6"],
            "tagline_color": "#00b4d8",
        },
        {
            "name": "Teal Purple",
            "gradient": ["#00f5d4", "#7b2cbf"],
            "tagline_color": "#00f5d4",
        },
    ]
)


http_status_config = to_namespace(
    {
        "success": {
            "status_code": 200,
            "message": "SUCCESS",
        },
        "created": {
            "status_code": 201,
            "message": "CREATED",
        },
        "bad_request": {
            "status_code": 400,
            "message": "BAD REQUEST",
        },
        "unauthorized": {
            "status_code": 401,
            "message": "UNAUTHORIZED",
        },
        "forbidden": {
            "status_code": 403,
            "message": "FORBIDDEN",
        },
        "not_found": {
            "status_code": 404,
            "message": "NOT FOUND",
        },
        "timeout": {
            "status_code": 408,
            "message": "TIMEOUT",
        },
        "conflict": {
            "status_code": 409,
            "message": "CONFLICT",
        },
        "rate_limit": {
            "status_code": 429,
            "message": "RATE LIMIT ERROR",
        },
        "internal_server_error": {
            "status_code": 500,
            "message": "INTERNAL SERVER ERROR",
        },
    }
)

error_types_config = to_namespace(
    {
        "network_error": "NETWORK ERROR",
        "db_config_error": "DATABASE CONFIGURATION ERROR",
        "db_error": "DATABASE ERROR",
        "validation_error": "VALIDATION ERROR",
        "bcrypt_error": "BCRYPT ERROR",
        "jwt_error": "JWT ERROR",
        "authentication_error": "AUTHENTICATION ERROR",
        "authorization_error": "AUTHORIZATION ERROR",
        "tokenExpired_error": "TOKEN EXPIRED ERROR",
        "forbidden_error": "FORBIDDEN ERROR",
        "conflict_error": "CONFLICT ERROR",
        "connection_error": "CONNECTION ERROR",
        "notification_error": "NOTIFICATION ERROR",
        "not_found_error": "NOT FOUND ERROR",
        "unknown_error": "UNKNOWN ERROR",
        "timeout_error": "TIMEOUT ERROR",
        "rate_limit_error": "RATE LIMIT ERROR",
        "internal_server_error": "INTERNAL SERVER ERROR",
    }
)

errors_config = to_namespace(
    {
        "networkError": {
            "type": error_types_config.networkError,
            "title": "Network Connection Failed",
            "message": "We are currently experiencing network difficulties. Please try again later.",
            "statusCode": http_status_config.internalServerError.statusCode,
        },
        "database_configuration_error": {
            "type": error_types_config.dbConfigError,
            "title": "Database Configuration Failed",
            "message": "A Database configuration error has occurred, Please check env file.",
            "status_code": http_status_config.internalServerError,
        },
        "database_connection_failed_error": {
            "type": error_types_config.db_config_error,
            "title": "Database Connection Failed",
            "message": "We are currently experiencing technical difficulties. Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "invalid_request_error": {
            "type": error_types_config.validation_error,
            "title": "Invalid Request",
            "message": "The request contains invalid or missing information.",
            "status_code": http_status_config.bad_request,
        },
        "rate_limit_exceeded_error": {
            "type": error_types_config.rate_limit_error,
            "title": "Too Many Requests",
            "message": "You have exceeded the allowed request limit. Please wait and try again.",
            "status_code": http_status_config.rate_limit,
        },
        "timeout_error": {
            "type": error_types_config.timeout_error,
            "title": "Request Timed Out",
            "message": "The request took too long to process. Please try again.",
            "status_code": http_status_config.timeout,
        },
        "internal_server_error": {
            "type": error_types_config.internal_server_error,
            "title": "Internal Server Error",
            "message": "Something went wrong on our end. Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "banner_error": {
            "type": error_types_config.internal_server_error,
            "title": "Banner Failed",
            "message": "Unable to show banner.",
            "status_code": http_status_config.internal_server_error,
        },
        "invalid_pagination_error": {
            "type": error_types_config.validation_error,
            "title": "Invalid Pagination Parameters",
            "message": "Page and limit must be valid positive numbers.",
            "status_code": http_status_config.bad_request,
        },
        "authentication_error": {
            "type": error_types_config.authentication_error,
            "title": "Authentication Failed",
            "message": "We couldn't verify your credentials. Please try again.",
            "status_code": http_status_config.unauthorized,
        },
        "unauthorized_user_error": {
            "type": error_types_config.authorization_error,
            "title": "Unauthorized Access",
            "message": "You are not authorized to access this resource.",
            "status_code": http_status_config.unauthorized,
        },
        "forbidden_action_error": {
            "type": error_types_config.forbidden_error,
            "title": "Action Not Allowed",
            "message": "You do not have permission to perform this action.",
            "status_code": http_status_config.forbidden,
        },
        "user_not_found_error": {
            "type": error_types_config.not_found_error,
            "title": "User Not Found",
            "message": "The requested user does not exist.",
            "status_code": http_status_config.not_found,
        },
        "user_already_exists_error": {
            "type": error_types_config.conflict_error,
            "title": "User Already Exists",
            "message": "An account with this email or username already exists.",
            "status_code": http_status_config.conflict,
        },
        "registration_failed_error": {
            "type": error_types_config.db_error,
            "title": "Registration Failed",
            "message": "We were unable to complete your registration.",
            "status_code": http_status_config.internal_server_error,
        },
        "profile_update_failed_error": {
            "type": error_types_config.db_error,
            "title": "Profile Update Failed",
            "message": "Unable to update profile at the moment. Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "invalid_user_id_error": {
            "type": error_types_config.validation_error,
            "title": "User ID Validation Failed",
            "message": "The provided user ID format is invalid.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_email_error": {
            "type": error_types_config.validation_error,
            "title": "Email Validation Failed",
            "message": "Please enter a valid email address.",
            "status_code": http_status_config.bad_request,
        },
        "weak_password_error": {
            "type": error_types_config.validation_error,
            "title": "Weak Password",
            "message": "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
            "status_code": http_status_config.bad_request,
        },
        "username_required_error": {
            "type": error_types_config.validation_error,
            "title": "Username Required",
            "message": "Please enter your username.",
            "status_code": http_status_config.bad_request,
        },
        "first_name_required_error": {
            "type": error_types_config.validation_error,
            "title": "First Name Required",
            "message": "Please enter your first name.",
            "status_code": http_status_config.bad_request,
        },
        "email_required_error": {
            "type": error_types_config.validation_error,
            "title": "Email Required",
            "message": "Please enter your email.",
            "status_code": http_status_config.bad_request,
        },
        "username_email_required_error": {
            "type": error_types_config.validation_error,
            "title": "Username/Email Required",
            "message": "Please enter your username or email.",
            "status_code": http_status_config.bad_request,
        },
        "password_required_error": {
            "type": error_types_config.validation_error,
            "title": "Password Required",
            "message": "Please enter your password.",
            "status_code": http_status_config.bad_request,
        },
        "old_password_required_error": {
            "type": error_types_config.validation_error,
            "title": "Old Password Required",
            "message": "Please enter your old password.",
            "status_code": http_status_config.bad_request,
        },
        "new_password_required_error": {
            "type": error_types_config.validation_error,
            "title": "New Password Required",
            "message": "Please enter your new password.",
            "status_code": http_status_config.bad_request,
        },
        "confirm_password_required_error": {
            "type": error_types_config.validation_error,
            "title": "Confirm Password Required",
            "message": "Please confirm your password.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_username_error": {
            "type": error_types_config.validation_error,
            "title": "Username Validation Failed",
            "message": "Username must only contain alphabets (a-z or A-Z) and special characters (,@,#,$,%,&,_).",
            "status_code": http_status_config.bad_request,
        },
        "invalid_first_name_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "First name must only contain alphabets (a-z or A-Z).",
            "status_code": http_status_config.bad_request,
        },
        "invalid_middle_name_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Middle name must only contain alphabets (a-z or A-Z).",
            "status_code": http_status_config.bad_request,
        },
        "invalid_last_name_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Last name must only contain alphabets (a-z or A-Z).",
            "status_code": http_status_config.bad_request,
        },
        "invalid_nickname_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Nick name must only contain alphabets (a-z or A-Z).",
            "status_code": http_status_config.bad_request,
        },
        "invalid_password_combination_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Invalid password combination.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_old_password_combination_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Invalid old password combination.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_new_password_combination_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Invalid new password combination.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_confirm_password_combination_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Invalid confirm password combination.",
            "status_code": http_status_config.bad_request,
        },
        "password_mismatch_error": {
            "type": error_types_config.validation_error,
            "title": "Password Mismatch",
            "message": "Password and confirm password must match.",
            "status_code": http_status_config.bad_request,
        },
        "new_password_confirm_password_mismatch_error": {
            "type": error_types_config.validation_error,
            "title": "Password Mismatch",
            "message": "New password and confirm password must match.",
            "status_code": http_status_config.bad_request,
        },
        "username_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Username Validation Failed",
            "message": "User name must be at least 1 character long.",
            "status_code": http_status_config.bad_request,
        },
        "username_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Username Validation Failed",
            "message": "User name must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "first_name_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "First name must be at least 1 character long.",
            "status_code": http_status_config.bad_request,
        },
        "first_name_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "First name must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "middle_name_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Middle name must be at least 1 character long.",
            "status_code": http_status_config.bad_request,
        },
        "middle_name_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Middle name must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "last_name_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Last name must be at least 1 character long.",
            "status_code": http_status_config.bad_request,
        },
        "last_name_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Last name must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "nick_name_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Nick name must be at least 1 character long.",
            "status_code": http_status_config.bad_request,
        },
        "nick_name_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Name Validation Failed",
            "message": "Nick name must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "password_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must be at least 6 characters long.",
            "status_code": http_status_config.bad_request,
        },
        "password_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must not be longer than 100 characters.",
            "status_code": http_status_config.bad_request,
        },
        "password_upper_case_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must contain at least one uppercase letter (A-Z).",
            "status_code": http_status_config.bad_request,
        },
        "password_lower_case_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must contain at least one lowercase letter (a-z).",
            "status_code": http_status_config.bad_request,
        },
        "password_number_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must contain at least one digit (0-9).",
            "status_code": http_status_config.bad_request,
        },
        "password_special_characters_error": {
            "type": error_types_config.validation_error,
            "title": "Password Validation Failed",
            "message": "Password must contain at least one special character (@, #, $, %, &).",
            "status_code": http_status_config.bad_request,
        },
        "password_update_failed_error": {
            "type": error_types_config.db_error,
            "title": "Password Update Failed",
            "message": "We were unable to update password.",
            "status_code": http_status_config.internal_server_error,
        },
        "password_already_used_error": {
            "type": error_types_config.forbidden_error,
            "title": "Password Update Failed",
            "message": "New password and previous password must be different.",
            "status_code": http_status_config.forbidden,
        },
        "password_expired_error": {
            "type": error_types_config.authorization_error,
            "title": "Password Expired",
            "message": "Your password is expired, Please reset your password.",
            "status_code": http_status_config.unauthorized,
        },
        "bcrypt_error": {
            "type": error_types_config.bcrypt_error,
            "title": "Password Encryption Failed",
            "message": "We were unable to encrypt your password.",
            "status_code": http_status_config.internal_server_error,
        },
        "jwt_error": {
            "type": error_types_config.jwt_error,
            "title": "Token Generation Failed",
            "message": "We were unable to generate token.",
            "status_code": http_status_config.internal_server_error,
        },
        "jwt_not_before_error": {
            "type": error_types_config.jwt_error,
            "title": "Token Validation Failed",
            "message": "We were unable to process token as we got 'Not before token' error.",
            "status_code": http_status_config.internal_server_error,
        },
        "token_expired_error": {
            "type": error_types_config.token_expired_error,
            "title": "Session Expired",
            "message": "Your session has expired. Please log in again.",
            "status_code": http_status_config.unauthorized,
        },
        "invalid_token_error": {
            "type": error_types_config.validation_error,
            "title": "Token Validation Failed",
            "message": "The provided token is invalid. Please authenticate again.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_age_error": {
            "type": error_types_config.validation_error,
            "title": "Age Validation Failed",
            "message": "Please enter a valid age.",
            "status_code": http_status_config.forbidden,
        },
        "decimal_age_error": {
            "type": error_types_config.validation_error,
            "title": "Age Validation Failed",
            "message": "Age must not be in decimals.",
            "status_code": http_status_config.forbidden,
        },
        "min_age_error": {
            "type": error_types_config.validation_error,
            "title": "Age Validation Failed",
            "message": "You must be older than 18 years.",
            "status_code": http_status_config.forbidden,
        },
        "max_age_error": {
            "type": error_types_config.validation_error,
            "title": "Age Validation Failed",
            "message": "You must be younger than 80 years.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_phone_error": {
            "type": error_types_config.validation_error,
            "title": "Phone Validation Failed",
            "message": "Please enter a valid phone number.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_gender_error": {
            "type": error_types_config.validation_error,
            "title": "Gender Validation Failed",
            "message": "Please choose correct gender.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_marital_status_error": {
            "type": error_types_config.validation_error,
            "title": "Marital Status Validation Failed",
            "message": "Please choose correct marital status.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_photo_url_error": {
            "type": error_types_config.validation_error,
            "title": "Photo Validation Failed",
            "message": "Please enter a valid photo url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_bio_error": {
            "type": error_types_config.validation_error,
            "title": "Bio Validation Failed",
            "message": "Please enter a valid bio.",
            "status_code": http_status_config.forbidden,
        },
        "bio_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Bio Validation Failed",
            "message": "Bio must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "bio_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Bio Validation Failed",
            "message": "Bio must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_experience_error": {
            "type": error_types_config.validation_error,
            "title": "Experience Validation Failed",
            "message": "Please enter valid experience.",
            "status_code": http_status_config.forbidden,
        },
        "decimal_experience_error": {
            "type": error_types_config.validation_error,
            "title": "Experience Validation Failed",
            "message": "Experience must not be in decimals.",
            "status_code": http_status_config.forbidden,
        },
        "min_experience_error": {
            "type": error_types_config.validation_error,
            "title": "Experience Validation Failed",
            "message": "Experience must be more than 0 years.",
            "status_code": http_status_config.forbidden,
        },
        "max_experience_error": {
            "type": error_types_config.validation_error,
            "title": "Experience Validation Failed",
            "message": "Experience must be less than 70 years.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_job_profile_error": {
            "type": error_types_config.validation_error,
            "title": "Job Profile Validation Failed",
            "message": "Please enter a valid job profile.",
            "status_code": http_status_config.forbidden,
        },
        "job_profile_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Job Profile Validation Failed",
            "message": "Job profile must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "job_profile_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Job Profile Validation Failed",
            "message": "Job profile must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_facebook_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid facebook url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_instagram_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid instagram url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_twitter_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid twitter url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_github_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid github url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_linkedin_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid linkedin url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_youtube_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid youtube url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_website_url_error": {
            "type": error_types_config.validation_error,
            "title": "Social Media Validation Failed",
            "message": "Please enter a valid website url.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_company_error": {
            "type": error_types_config.validation_error,
            "title": "Company Validation Failed",
            "message": "Please enter a valid company.",
            "status_code": http_status_config.forbidden,
        },
        "company_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Company Validation Failed",
            "message": "Company must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "company_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Company Validation Failed",
            "message": "Company must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_organization_error": {
            "type": error_types_config.validation_error,
            "title": "Organization Validation Failed",
            "message": "Please enter a valid organization.",
            "status_code": http_status_config.forbidden,
        },
        "organization_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Organization Validation Failed",
            "message": "Organization must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "organization_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Organization Validation Failed",
            "message": "Organization must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_skills_error": {
            "type": error_types_config.validation_error,
            "title": "Skills Validation Failed",
            "message": "Please add valid skills.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_interests_error": {
            "type": error_types_config.validation_error,
            "title": "Interests Validation Failed",
            "message": "Please add valid interests.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_address_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please provide a valid address.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_street_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid street.",
            "status_code": http_status_config.forbidden,
        },
        "street_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Street must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "street_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Street must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_landmark_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid landmark.",
            "status_code": http_status_config.forbidden,
        },
        "landmark_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Landmark must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "landmark_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Landmark must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_city_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid city.",
            "status_code": http_status_config.forbidden,
        },
        "city_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "City must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "city_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "City must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_state_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid state.",
            "status_code": http_status_config.forbidden,
        },
        "state_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "State must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "state_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "State must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_country_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid country.",
            "status_code": http_status_config.forbidden,
        },
        "country_min_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Country must be at least 2 characters long.",
            "status_code": http_status_config.forbidden,
        },
        "country_max_length_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Country must not be longer than 100 characters.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_country_code_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid country code.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_pin_code_error": {
            "type": error_types_config.validation_error,
            "title": "Address Validation Failed",
            "message": "Please enter a valid pin code.",
            "status_code": http_status_config.forbidden,
        },
        "connection_request_failed_error": {
            "type": error_types_config.db_error,
            "title": "Connection Request Failed",
            "message": "Unable to send connection request, Please try again.",
            "status_code": http_status_config.internal_server_error,
        },
        "self_connection_error": {
            "type": error_types_config.validation_error,
            "title": "Connection Request Failed",
            "message": "Logged in user and other user must be different.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_connection_request_error": {
            "type": error_types_config.validation_error,
            "title": "Connection Request Failed",
            "message": "Your connection request is invalid, Please try again.",
            "status_code": http_status_config.forbidden,
        },
        "view_connection_request_error": {
            "type": error_types_config.db_error,
            "title": "Connection Request Failed",
            "message": "We were unable to get connections requests, Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "invalid_notification_request_error": {
            "type": error_types_config.notification_error,
            "title": "Notification Validation Request",
            "message": "Notification ID or type or status is invalid.",
            "status_code": http_status_config.bad_request,
        },
        "notification_failed_error": {
            "type": error_types_config.notification_error,
            "title": "Notification Failed",
            "message": "We were unable to process the notification request, Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "account_deletion_failed_error": {
            "type": error_types_config.db_error,
            "title": "Account Deletion Failed",
            "message": "We were unable to process your account deletion request, Please try again later.",
            "status_code": http_status_config.internal_server_error,
        },
        "message_not_found_error": {
            "type": error_types_config.not_found_error,
            "title": "Message Not Found",
            "message": "The requested message could not be found.",
            "status_code": http_status_config.not_found,
        },
        "invalid_message_operation_error": {
            "type": error_types_config.validation_error,
            "title": "Invalid Message Operation",
            "message": "The requested message operation is invalid.",
            "status_code": http_status_config.bad_request,
        },
        "user_not_connected_error": {
            "type": error_types_config.authorization_error,
            "title": "Users Not Connected",
            "message": "You can only send messages to connected users.",
            "status_code": http_status_config.forbidden,
        },
        "invalid_conversation_id_error": {
            "type": error_types_config.validation_error,
            "title": "Conversation Validation Failed",
            "message": "The provided conversation ID format is invalid, Please try again.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_message_id_error": {
            "type": error_types_config.validation_error,
            "title": "Message Validation Failed",
            "message": "The provided message ID format is invalid, Please try again.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_message_error": {
            "type": error_types_config.validation_error,
            "title": "Message Validation Failed",
            "message": "Invalid message received, Please try again.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_group_error": {
            "type": error_types_config.validation_error,
            "title": "Group Validation Failed",
            "message": "The provided group is invalid, Please try again.",
            "status_code": http_status_config.bad_request,
        },
        "invalid_target_id_error": {
            "type": error_types_config.validation_error,
            "title": "Group Validation Failed",
            "message": "The provided set of target IDs are invalid, Please try again.",
            "status_code": http_status_config.bad_request,
        },
    }
)

success_config = to_namespace(
    {
        "db_connection_success": {
            "type": "DB CONNECTION SUCCESS",
            "title": "Database connected",
            "message": "Database connected successfully.",
            "status_code": http_status_config.success,
        },
        "authentication_success": {
            "type": "AUTHENTICATION SUCCESS",
            "title": "Authentication Successful",
            "message": "You have been successfully authenticated.",
            "status_code": http_status_config.success,
        },
        "registration_success": {
            "type": "REGISTRATION SUCCESS",
            "title": "Registration Successful",
            "message": "Your account has been created successfully.",
            "status_code": http_status_config.created,
        },
        "login_success": {
            "type": "LOGIN SUCCESS",
            "title": "Login Successful",
            "message": "Welcome back! You have logged in successfully.",
            "status_code": http_status_config.success,
        },
        "logout_success": {
            "type": "LOGOUT SUCCESS",
            "title": "Logout Successful",
            "message": "You have been logged out successfully.",
            "status_code": http_status_config.success,
        },
        "password_update_success": {
            "type": "PASSWORD UPDATE SUCCESS",
            "title": "Password Updated",
            "message": "Your password has been updated successfully.",
            "status_code": http_status_config.success,
        },
        "profile_fetch_success": {
            "type": "FETCH PROFILE SUCCESS",
            "title": "Profile Loaded",
            "message": "Your profile has been retrieved successfully.",
            "status_code": http_status_config.success,
        },
        "profile_update_success": {
            "type": "PROFILE UPDATE SUCCESS",
            "title": "Profile Updated",
            "message": "Your profile has been updated successfully.",
            "status_code": http_status_config.success,
        },
        "account_delete_success": {
            "type": "ACCOUNT DELETION SUCCESS",
            "title": "Account Deleted",
            "message": "Your account has been deleted successfully.",
            "status_code": http_status_config.success,
        },
        "explore_fetch_success": {
            "type": "EXPLORE_FETCH_SUCCESS",
            "title": "Explore Loaded",
            "message": "Explore data fetched successfully.",
            "status_code": http_status_config.success,
        },
        "connection_request_success": {
            "type": "CONNECTION REQUEST SUCCESS",
            "title": "Connection Request Sent",
            "message": "Your connection request has been sent successfully.",
            "status_code": http_status_config.created,
        },
        "notifications_fetch_success": {
            "type": "NOTIFICATION FETCH SUCCESS",
            "title": "Notifications Loaded",
            "message": "Your notifications have been retrieved successfully.",
            "status_code": http_status_config.success,
        },
        "notifications_read_success": {
            "type": "NOTIFICATION READ SUCCESS",
            "title": "Notifications Read",
            "message": "Your notifications have been marked read successfully.",
            "status_code": http_status_config.success,
        },
        "chats_fetch_success": {
            "type": "CHATS FETCH SUCCESS",
            "title": "Chats Loaded",
            "message": "All chats loaded successfully.",
            "status_code": http_status_config.created,
        },
        "group_chats_fetch_success": {
            "type": "GROUP CHATS FETCH SUCCESS",
            "title": "Group Chats Loaded",
            "message": "All group chats loaded successfully.",
            "status_code": http_status_config.created,
        },
        "chat_messages_fetch_success": {
            "type": "CHAT MESSAGES FETCH SUCCESS",
            "title": "Chat Messages Loaded",
            "message": "All chat messages loaded successfully.",
            "status_code": http_status_config.created,
        },
        "group_chat_messages_fetch_success": {
            "type": "GROUP CHAT MESSAGES FETCH SUCCESS",
            "title": "Group Chat Messages Loaded",
            "message": "All group chat messages loaded successfully.",
            "status_code": http_status_config.created,
        },
        "edit_message_success": {
            "type": "EDIT MESSAGE SUCCESS",
            "title": "Message Edited",
            "message": "Messages edited successfully.",
            "status_code": http_status_config.created,
        },
        "delete_message_success": {
            "type": "DELETE MESSAGE SUCCESS",
            "title": "Message Deleted",
            "message": "Message deleted successfully.",
            "status_code": http_status_config.created,
        },
        "send_chat_message_success": {
            "type": "SEND CHAT MESSAGE SUCCESS",
            "title": "Chat Message Sent",
            "message": "Chat message sent successfully.",
            "status_code": http_status_config.created,
        },
        "send_group_chat_message_success": {
            "type": "SEND GROUP CHAT MESSAGE SUCCESS",
            "title": "Group Chat Message Sent",
            "message": "Group chat message sent successfully.",
            "status_code": http_status_config.created,
        },
        "forward_message_success": {
            "type": "FORWARD MESSAGE SUCCESS",
            "title": "Message Forwarded",
            "message": "Message(s) forwarded successfully.",
            "status_code": http_status_config.created,
        },
        "message_delivery_success": {
            "type": "MESSAGE DELIVERY SUCCESS",
            "title": "Message Delivered",
            "message": "Message(s) delivered successfully.",
            "status_code": http_status_config.created,
        },
        "message_seen_success": {
            "type": "MESSAGE SEEN SUCCESS",
            "title": "Message Seen",
            "message": "Message seen successfully.",
            "status_code": http_status_config.created,
        },
        "message_info_fetch_success": {
            "type": "MESSAGE INFO FETCH SUCCESS",
            "title": "Message Info Loaded",
            "message": "Message info loaded successfully.",
            "status_code": http_status_config.created,
        },
    }
)

userProperties = to_namespace(
    {
        "id": "_id",
        "email": "email",
        "username": "userName",
        "password": "password",
        "previous_password": "previousPassword",
        "password_last_updated": "passwordLastUpdated",
        "first_name": "firstName",
        "middle_name": "middleName",
        "last_name": "lastName",
        "nick_name": "nickName",
        "age": "age",
        "phone": "phone",
        "gender": "gender",
        "avatar_url": "avatarUrl",
        "cover_photo_url": "coverPhotoUrl",
        "bio": "bio",
        "marital_status": "maritalStatus",
        "job_profile": "jobProfile",
        "experience": "experience",
        "social_media": "socialMedia",
        "company": "company",
        "organization": "organization",
        "skills": "skills",
        "interests": "interests",
        "address": "address",
        "created_at": "createdAt",
        "updated_at": "updatedAt",
    }
)

genderProperties = to_namespace(
    {
        "male": "male",
        "female": "female",
        "other": "other",
    }
)

maritalStatusProperties = to_namespace(
    {
        "married": "married",
        "single": "single",
        "separated": "separated",
        "complicated": "complicated",
    }
)

socialMediaProperties = to_namespace(
    {
        "facebook": "facebook",
        "instagram": "instagram",
        "twitter": "twitter",
        "github": "github",
        "linkedin": "linkedin",
        "youtube": "youtube",
        "website": "website",
    }
)

addressProperties = to_namespace(
    {
        "street": "street",
        "landmark": "landmark",
        "city": "city",
        "state": "state",
        "country_code": "countryCode",
        "country": "country",
        "pin_code": "pinCode",
    }
)

connectionProperties = to_namespace(
    {
        "sender_id": "senderId",
        "receiver_id": "receiverId",
        "connection_status": "connectionStatus",
        "rejected_by_sender_count": "rejectedBySenderCount",
        "rejected_by_receiver_count": "rejectedByReceiverCount",
        "last_actioned_by": "lastActionedBy",
        "updated_at": "updatedAt",
        "created_at": "createdAt",
    }
)

connectionStatusProperties = to_namespace(
    {
        "interested": "interested",
        "not_interested": "notInterested",
        "accepted": "accepted",
        "rejected": "rejected",
        "blocked": "blocked",
    }
)

notificationProperties = to_namespace(
    {
        "type": "type",
        "to": "to",
        "from": "from",
        "title": "title",
        "body": "body",
        "status": "status",
    }
)

notificationTypes = to_namespace(
    {
        "connection": "connection",
        "chat": "chat",
    }
)

notificationStatusProperties = to_namespace(
    {
        "read": "read",
        "unread": "unread",
        "delete": "delete",
    }
)

propertyConstraints = to_namespace(
    {
        "min_username_length": 1,
        "max_username_length": 100,
        "min_name_length": 1,
        "max_name_length": 100,
        "min_password_length": 6,
        "max_password_length": 100,
        "min_age": 18,
        "max_age": 100,
        "min_experience": 0,
        "max_experience": 70,
        "min_string_length": 2,
        "max_string_length": 100,
        "phone_length": 10,
        "pin_code_length": 6,
    }
)

timeline_config = to_namespace(
    {
        "one_hour": 1000 * 60 * 60,
        "two_hours": 1000 * 60 * 60 * 2,
        "three_hours": 1000 * 60 * 60 * 3,
        "six_hours": 1000 * 60 * 60 * 6,
        "half_day": 1000 * 60 * 60 * 12,
        "one_day": 1000 * 60 * 60 * 24,
        "two_days": 1000 * 60 * 60 * 24 * 2,
        "three_days": 1000 * 60 * 60 * 24 * 3,
        "one_week": 1000 * 60 * 60 * 24 * 7,
        "two_weeks": 1000 * 60 * 60 * 24 * 7 * 2,
        "three_weeks": 1000 * 60 * 60 * 24 * 7 * 3,
        "one_month": 1000 * 60 * 60 * 24 * 30,
        "two_months": 1000 * 60 * 60 * 24 * 30 * 2,
        "three_months": 1000 * 60 * 60 * 24 * 30 * 3,
        "six_months": 1000 * 60 * 60 * 24 * 30 * 6,
        "one_year": 1000 * 60 * 60 * 24 * 30 * 12,
        "two_years": 1000 * 60 * 60 * 24 * 30 * 12 * 2,
        "four_years": 1000 * 60 * 60 * 24 * 30 * 12 * 3,
    }
)
