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

    avatar: { type: String, default: null },
    avatarFileId: { type: String, default: null },

    cover: { type: String, default: null },
    coverFileId: { type: String, default: null },

    experiences: [
      {
        company: {
          type: String,
          required: true,
          trim: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
          validate: {
            validator: (value) => value < new Date(),
            message: "Start date must be in the past!",
          },
        },
        endDate: {
          type: Date,
          default: null,
          validate: {
            validator: (value) => !value || value < new Date(),
            message: "End date must be in the past!",
          },
        },
        isCurrent: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    skills: {
      type: [
        {
          name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
          },
          level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "expert"],
            default: "beginner",
          },
        },
      ],
      set: (val) => {
        if (!val) return [];

        if (Array.isArray(val) && typeof val[0] === "string") {
          return val.map((s) => ({
            name: s.trim().toLowerCase(),
            level: "beginner",
          }));
        }

        return val.map((s) => ({
          name: s.name?.trim().toLowerCase(),
          level: s.level || "beginner",
        }));
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
  {
    timestamps: true,
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

profileSchema.virtual("totalExperience").get(function () {
  if (!this.experiences?.length) return 0;

  let totalMonths = 0;

  this.experiences.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    totalMonths += months;
  });

  return (totalMonths / 12).toFixed(1);
});

profileSchema.virtual("currentJobRole").get(function () {
  if (!this.experiences?.length) return null;

  let latest = null;

  for (const exp of this.experiences) {
    if (exp?.isCurrent && exp?.role) return exp.role;

    if (
      exp?.role &&
      exp?.startDate &&
      (!latest || new Date(exp.startDate) > new Date(latest.startDate))
    ) {
      latest = exp;
    }
  }

  return latest?.role ?? null;
});

profileSchema.virtual("topSkills").get(function () {
  if (!this.skills?.length) return null;

  const skillLevelRank = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  return [...this.skills]
    .sort((a, b) => skillLevelRank[b.level] - skillLevelRank[a.level])
    .slice(0, 3);
});

profileSchema.virtual("address", {
  ref: "Address",
  localField: "user",
  foreignField: "user",
  justOne: true,
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
