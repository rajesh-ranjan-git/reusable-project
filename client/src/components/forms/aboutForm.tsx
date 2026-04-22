"use client";

import { useState, useEffect } from "react";
import { LuUser } from "react-icons/lu";
import { toTitleCase } from "@/utils/common.utils";
import ModalPortal from "@/components/forms/modalPortal";
import {
  FormField,
  FormTextarea,
  FormButton,
} from "@/components/forms/formPrimitives";

type AboutFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: string;
  onSave: (bio: string) => Promise<void>;
};

const MAX_BIO = 300;

const AboutForm = ({
  isOpen,
  onClose,
  initialData = "",
  onSave,
}: AboutFormProps) => {
  const [bio, setBio] = useState(initialData);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBio(initialData);
      setError("");
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_BIO) return;
    setBio(value);
    if (error) setError("");
  };

  const handleSave = async () => {
    const trimmed = bio.trim();
    if (!trimmed) {
      setError("Bio cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await onSave(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const remaining = MAX_BIO - bio.length;
  const isNearLimit = remaining <= 40;

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="About Me"
      subtitle="Write a short bio that appears on your profile"
      maxWidth="max-w-lg"
      footer={
        <>
          <FormButton variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </FormButton>
          <FormButton variant="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </FormButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex gap-3 bg-glass-bg-subtle p-4 border border-glass-border rounded-md">
          <LuUser size={16} className="mt-0.5 text-accent-purple shrink-0" />
          <p className="text-text-muted text-xs leading-relaxed">
            Tip: Mention your current role, key expertise, and something that
            makes you stand out. Keep it concise and professional.
          </p>
        </div>

        <FormField label="Bio" htmlFor="about-bio" required error={error}>
          <FormTextarea
            id="about-bio"
            rows={6}
            placeholder="e.g. Full Stack Developer @ India Today Group | Passionate about building beautiful, scalable web apps with Next.js and TypeScript 🚀"
            value={bio}
            onChange={handleChange}
            error={error}
          />
        </FormField>

        <div className="flex justify-end">
          <span
            className={`text-xs font-medium tabular-nums transition-colors ${
              isNearLimit
                ? remaining <= 10
                  ? "text-status-error-text"
                  : "text-status-warning-text"
                : "text-text-muted"
            }`}
          >
            {remaining} / {MAX_BIO}
          </span>
        </div>

        {bio.trim() && (
          <div className="mt-2">
            <p className="mb-2 font-semibold text-[10px] text-text-muted uppercase tracking-widest">
              Preview
            </p>
            <div className="p-4 text-text-secondary text-sm leading-relaxed glass">
              {toTitleCase(bio)}
            </div>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};

export default AboutForm;
