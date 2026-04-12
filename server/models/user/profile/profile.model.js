import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },

    userName: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },

    firstName: String,
    lastName: String,
    nickName: String,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    },

    phone: Number,

    dob: {
      type: Date,
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: "DOB must be in the past!",
      },
    },

    maritalStatus: {
      type: String,
      enum: ["married", "single", "separated", "divorced", "complicated"],
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    },

    bio: String,

    avatarUrl: String,
    coverPhotoUrl: String,

    company: String,
    jobProfile: String,
    experience: Number,

    skills: {
      type: [String],
      set: (val) => {
        if (Array.isArray(val)) return val.map((s) => s.trim().toLowerCase());
        if (typeof val === "string") return [val.trim().toLowerCase()];
        return [];
      },
    },

    interests: {
      type: [String],
      set: (val) => {
        if (Array.isArray(val)) return val.map((s) => s.trim().toLowerCase());
        if (typeof val === "string") return [val.trim().toLowerCase()];
        return [];
      },
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

profileSchema.virtual("fullName").get(function () {
  if (!this.firstName || !this.lastName) return null;

  return `${this.firstName} ${this.lastName}`;
});

profileSchema.virtual("age").get(function () {
  if (!this.dob) return null;

  const today = new Date();
  const birthDate = new Date(this.dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
