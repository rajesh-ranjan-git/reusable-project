import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuX, LuChevronRight } from "react-icons/lu";
import { SocialType } from "@/types/types/profile.types";
import { EditProfileModalProps } from "@/types/props/profile.props.types";
import { getEditProfileSections } from "@/helpers/profile.helpers";
import BasicInfoForm from "@/components/forms/profile/basic.info.form";
import UsernameForm from "@/components/forms/profile/username.form";
import SocialLinksForm from "@/components/forms/profile/social.links.form";
import EmailForm from "@/components/forms/profile/email.form";
import PhoneForm from "@/components/forms/profile/phone.form";
import DobForm from "@/components/forms/profile/dob.form";
import GenderForm from "@/components/forms/profile/gender.form";
import RelationshipForm from "@/components/forms/profile/relationship.form";
import SkillsForm from "@/components/forms/profile/skills.form";
import InterestsForm from "@/components/forms/profile/interests.form";
import ExperienceForm from "@/components/forms/profile/experience.form";

const EditProfileModal = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
  currentForm,
  setCurrentForm,
}: EditProfileModalProps) => {
  const handleClose = () => {
    setCurrentForm(null);
    onClose();
  };

  const handleSectionClose = () => {
    setCurrentForm(null);
  };

  if (typeof document === "undefined") return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && currentForm === null && (
            <div
              className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-2 sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Edit Profile"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 backdrop-blur-md"
                onClick={handleClose}
              />

              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative flex flex-col sm:rounded-3xl rounded-t-3xl w-full max-w-sm max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden glass-heavy"
              >
                <div className="bg-(image:--gradient-brand-vivid) w-full h-0.75 shrink-0" />

                <div className="flex justify-between items-start gap-4 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-glass-border border-b shrink-0">
                  <div>
                    <h4 className="font-semibold text-text-primary leading-tight">
                      Edit Profile
                    </h4>
                    <p className="mt-0.5 text-text-muted text-xs">
                      Choose what you&apos;d like to update
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close modal"
                    className="flex justify-center items-center p-1 rounded-full text-text-secondary hover:text-text-primary hover:scale-105 transition-transform shrink-0 glass"
                  >
                    <LuX size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-2 px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto">
                  {getEditProfileSections(userProfile).map(
                    ({ id, icon: Icon, title, description }, i) => (
                      <motion.button
                        key={id}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 + 0.1 }}
                        onClick={() => setCurrentForm(id)}
                        className="group flex items-center gap-3 hover:shadow-glass-shadow-hover)] px-4 py-3.5 border border-glass-border)] hover:border-glass-border-accent)] rounded-2xl w-full text-left transition-all duration-200 glass"
                      >
                        <span className="flex flex-none justify-center items-center bg-linear-to-br shadow-glass border border-glass-border-accent rounded-md w-9 h-9 from-accent-blue/15 text-accent-purple to-accent-purple/20">
                          <Icon size={16} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary text-sm leading-tight">
                            {title}
                          </p>
                          <p className="mt-0.5 text-text-muted text-xs truncate">
                            {description}
                          </p>
                        </div>
                        <LuChevronRight
                          size={16}
                          className="text-text-muted group-hover:text-text-secondary transition-all group-hover:translate-x-0.5 shrink-0"
                        />
                      </motion.button>
                    ),
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <BasicInfoForm
        isOpen={isOpen && currentForm === "basic"}
        onClose={handleSectionClose}
        initialData={{
          firstName: userProfile?.firstName,
          lastName: userProfile?.lastName,
          nickName: userProfile?.nickName,
        }}
        onSave={(data) => {
          onSave(data);
          handleClose();
        }}
      />

      <UsernameForm
        isOpen={isOpen && currentForm === "username"}
        onClose={handleSectionClose}
        initialData={userProfile?.userName}
        onSave={(userName) => {
          onSave({ userName });
          handleClose();
        }}
      />

      <SocialLinksForm
        isOpen={isOpen && currentForm === "social"}
        onClose={handleSectionClose}
        initialData={userProfile?.social}
        onSave={(social: SocialType) => {
          onSave({ social });
          handleClose();
        }}
      />

      <EmailForm
        isOpen={currentForm === "email"}
        onClose={handleSectionClose}
        initialData={userProfile?.email}
        onSave={(updatedEmail) => {
          onSave({ email: updatedEmail, emailVerified: false });
          handleClose();
        }}
      />

      <PhoneForm
        isOpen={currentForm === "phone"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.phone?.toString()}
        onSave={(phone) => {
          onSave({ phone });
          handleClose();
        }}
      />

      <DobForm
        isOpen={currentForm === "dob"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.dob}
        onSave={(dob) => {
          onSave({ dob });
          handleClose();
        }}
      />

      <GenderForm
        isOpen={currentForm === "gender"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.maritalStatus}
        onSave={(gender) => {
          onSave({ gender });
          handleClose();
        }}
      />

      <RelationshipForm
        isOpen={currentForm === "maritalStatus"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.maritalStatus}
        onSave={(maritalStatus) => {
          onSave({ maritalStatus });
          handleClose();
        }}
      />

      <SkillsForm
        isOpen={currentForm === "skills"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.skills ?? []}
        onSave={(skills) => {
          onSave({ skills });
          handleClose();
        }}
      />

      <InterestsForm
        isOpen={currentForm === "interests"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.interests ?? []}
        onSave={(interests) => {
          onSave({ interests });
          handleClose();
        }}
      />

      <ExperienceForm
        isOpen={currentForm === "experience"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.experiences ?? []}
        onSave={(experiences) => {
          onSave({ experiences });
          handleClose();
        }}
      />
    </>
  );
};

export default EditProfileModal;
