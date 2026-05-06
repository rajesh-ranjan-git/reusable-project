import { SocialType } from "@/types/types/profile.types";
import { ProfileFormsProps } from "@/types/props/profile.props.types";
import { useAppStore } from "@/store/store";
import BasicInfoForm from "@/components/forms/profile/basic.info.form";
import UsernameForm from "@/components/forms/profile/username.form";
import SocialLinksForm from "@/components/forms/profile/social.links.form";
import EmailForm from "@/components/forms/profile/email.form";
import PhoneForm from "@/components/forms/profile/phone.form";
import DobForm from "@/components/forms/profile/dob.form";
import GenderForm from "@/components/forms/profile/gender.form";
import RelationshipForm from "@/components/forms/profile/relationship.form";
import BioForm from "@/components/forms/profile/bio.form";
import SkillsForm from "@/components/forms/profile/skills.form";
import InterestsForm from "@/components/forms/profile/interests.form";
import ExperienceForm from "@/components/forms/profile/experience.form";
import EmailVerificationModal from "@/components/profile/email.verify";

const ProfileForms = ({ userProfile, onSave }: ProfileFormsProps) => {
  const currentForm = useAppStore((state) => state.currentProfileForm);
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  const handleClose = () => setCurrentForm(null);

  if (!userProfile) return null;

  return (
    <>
      <BasicInfoForm
        isOpen={currentForm === "basic"}
        onClose={handleClose}
        initialData={{
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          nickName: userProfile.nickName,
        }}
        onSave={(data) => onSave(data)}
      />

      <UsernameForm
        isOpen={currentForm === "username"}
        onClose={handleClose}
        initialData={userProfile.userName}
        onSave={(userName) => onSave({ userName })}
      />

      <SocialLinksForm
        isOpen={currentForm === "social"}
        onClose={handleClose}
        initialData={userProfile.social}
        onSave={(social: SocialType) => onSave({ social })}
      />

      <EmailForm
        isOpen={currentForm === "email"}
        onClose={handleClose}
        initialData={userProfile.email}
        onSave={(email) => onSave({ email, emailVerified: false })}
      />

      <EmailVerificationModal
        isOpen={currentForm === "verifyEmail"}
        onClose={handleClose}
        email={userProfile.email}
      />

      <PhoneForm
        isOpen={currentForm === "phone"}
        onClose={handleClose}
        initialData={userProfile.phone?.toString()}
        onSave={(phone) => onSave({ phone, phoneVerified: false })}
      />

      <DobForm
        isOpen={currentForm === "dob"}
        onClose={handleClose}
        initialData={userProfile.dob}
        joined={userProfile.createdAt}
        onSave={(dob) => onSave({ dob })}
      />

      <GenderForm
        isOpen={currentForm === "gender"}
        onClose={handleClose}
        initialData={userProfile.gender}
        onSave={(gender) => onSave({ gender })}
      />

      <RelationshipForm
        isOpen={currentForm === "maritalStatus"}
        onClose={handleClose}
        initialData={userProfile.maritalStatus}
        onSave={(maritalStatus) => onSave({ maritalStatus })}
      />

      <BioForm
        isOpen={currentForm === "bio"}
        onClose={handleClose}
        initialData={userProfile.bio ?? ""}
        onSave={(bio) => onSave({ bio })}
      />

      <SkillsForm
        isOpen={currentForm === "skills"}
        onClose={handleClose}
        initialData={userProfile.skills ?? []}
        onSave={(skills) => onSave({ skills })}
      />

      <InterestsForm
        isOpen={currentForm === "interests"}
        onClose={handleClose}
        initialData={userProfile.interests ?? []}
        onSave={(interests) => onSave({ interests })}
      />

      <ExperienceForm
        isOpen={currentForm === "experience"}
        onClose={handleClose}
        initialData={userProfile.experiences ?? []}
        joined={userProfile.createdAt}
        onSave={(experiences) => onSave({ experiences })}
      />
    </>
  );
};

export default ProfileForms;
