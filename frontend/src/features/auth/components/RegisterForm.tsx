"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/validations/authentication";

import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import FormField from "@/components/forms/FormField";
import FormError from "@/components/forms/FormError";
import PrimaryButton from "@/components/buttons/PrimaryButton";

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}

interface FormErrors {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
}

const genderOptions = [
  {
    label: "Select gender",
    value: "",
  },
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
  {
    label: "Prefer not to say",
    value: "prefer-not-to-say",
  },
];

export default function RegisterForm({
  onSuccess,
}: RegisterFormProps) {
  const {
    register,
    loading,
    error,
    clearError,
  } = useAuth();

  const [firstName, setFirstName] =
    useState("");
  const [middleName, setMiddleName] =
    useState("");
  const [lastName, setLastName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [phone, setPhone] =
    useState("");
  const [dateOfBirth, setDateOfBirth] =
    useState("");
  const [gender, setGender] =
    useState("");

  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    clearError();

    const nextErrors: FormErrors = {};

    const firstNameResult =
      validateName(firstName, "First name");

    if (!firstNameResult.valid) {
      nextErrors.firstName =
        firstNameResult.message;
    }

    const middleNameResult =
      middleName.trim()
        ? validateName(
            middleName,
            "Middle name",
          )
        : null;

    if (
      middleNameResult &&
      !middleNameResult.valid
    ) {
      nextErrors.middleName =
        middleNameResult.message;
    }

    const lastNameResult =
      validateName(lastName, "Last name");

    if (!lastNameResult.valid) {
      nextErrors.lastName =
        lastNameResult.message;
    }

    const emailResult =
      validateEmail(email);

    if (!emailResult.valid) {
      nextErrors.email =
        emailResult.message;
    }

    const passwordResult =
      validatePassword(password);

    if (!passwordResult.valid) {
      nextErrors.password =
        passwordResult.message;
    }

    const confirmPasswordResult =
      validateConfirmPassword(
        password,
        confirmPassword,
      );

    if (!confirmPasswordResult.valid) {
      nextErrors.confirmPassword =
        confirmPasswordResult.message;
    }

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setErrors(nextErrors);
      return;
    }

    try {
      const registration = await register({
        firstName: firstName.trim(),
        middleName:
          middleName.trim() || undefined,
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        phone: phone.trim() || undefined,
        dateOfBirth:
          dateOfBirth || undefined,
        gender: gender
          ? (gender as
              | "male"
              | "female"
              | "other"
              | "prefer-not-to-say")
          : undefined,
      });

      setFirstName("");
      setMiddleName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDateOfBirth("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      onSuccess?.(registration.email);
    } catch {
      // useAuth stores the API error.
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full space-y-6"
    >
      {error && (
        <FormError message={error} />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="First name"
          htmlFor="register-first-name"
          required
          error={errors.firstName}
        >
          <Input
            id="register-first-name"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(event) => {
              setFirstName(
                event.target.value,
              );

              if (errors.firstName) {
                setErrors((previous) => ({
                  ...previous,
                  firstName: undefined,
                }));
              }
            }}
            placeholder="First name"
            autoComplete="given-name"
            leftIcon={<User size={18} />}
            aria-invalid={Boolean(
              errors.firstName,
            )}
          />
        </FormField>

        <FormField
          label="Last name"
          htmlFor="register-last-name"
          required
          error={errors.lastName}
        >
          <Input
            id="register-last-name"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(event) => {
              setLastName(
                event.target.value,
              );

              if (errors.lastName) {
                setErrors((previous) => ({
                  ...previous,
                  lastName: undefined,
                }));
              }
            }}
            placeholder="Last name"
            autoComplete="family-name"
            leftIcon={<User size={18} />}
            aria-invalid={Boolean(
              errors.lastName,
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Middle name"
        htmlFor="register-middle-name"
        error={errors.middleName}
      >
        <Input
          id="register-middle-name"
          name="middleName"
          type="text"
          value={middleName}
          onChange={(event) => {
            setMiddleName(
              event.target.value,
            );

            if (errors.middleName) {
              setErrors((previous) => ({
                ...previous,
                middleName: undefined,
              }));
            }
          }}
          placeholder="Middle name (optional)"
          autoComplete="additional-name"
          leftIcon={<User size={18} />}
          aria-invalid={Boolean(
            errors.middleName,
          )}
        />
      </FormField>

      <FormField
        label="Email address"
        htmlFor="register-email"
        required
        error={errors.email}
      >
        <Input
          id="register-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);

            if (errors.email) {
              setErrors((previous) => ({
                ...previous,
                email: undefined,
              }));
            }
          }}
          placeholder="Enter your email address"
          autoComplete="email"
          leftIcon={<Mail size={18} />}
          aria-invalid={Boolean(
            errors.email,
          )}
        />
      </FormField>

      <FormField
        label="Phone number"
        htmlFor="register-phone"
        error={errors.phone}
      >
        <Input
          id="register-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
          placeholder="Phone number (optional)"
          autoComplete="tel"
          aria-invalid={Boolean(
            errors.phone,
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Date of birth"
          htmlFor="register-date-of-birth"
          error={errors.dateOfBirth}
        >
          <Input
            id="register-date-of-birth"
            name="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(event) =>
              setDateOfBirth(
                event.target.value,
              )
            }
            autoComplete="bday"
            aria-invalid={Boolean(
              errors.dateOfBirth,
            )}
          />
        </FormField>

        <FormField
          label="Gender"
          htmlFor="register-gender"
          error={errors.gender}
        >
          <Select
            id="register-gender"
            name="gender"
            value={gender}
            onChange={(event) =>
              setGender(event.target.value)
            }
            options={genderOptions}
            aria-invalid={Boolean(
              errors.gender,
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Password"
        htmlFor="register-password"
        required
        error={errors.password}
        helperText="At least 8 characters with uppercase, lowercase, a number, and a special character."
      >
        <Input
          id="register-password"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={password}
          onChange={(event) => {
            setPassword(
              event.target.value,
            );

            if (errors.password) {
              setErrors((previous) => ({
                ...previous,
                password: undefined,
              }));
            }
          }}
          placeholder="Create a password"
          autoComplete="new-password"
          leftIcon={
            <LockKeyhole size={18} />
          }
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
          aria-invalid={Boolean(
            errors.password,
          )}
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="register-confirm-password"
        required
        error={errors.confirmPassword}
      >
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(
              event.target.value,
            );

            if (errors.confirmPassword) {
              setErrors((previous) => ({
                ...previous,
                confirmPassword:
                  undefined,
              }));
            }
          }}
          placeholder="Confirm your password"
          autoComplete="new-password"
          leftIcon={
            <LockKeyhole size={18} />
          }
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous,
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              className="pointer-events-auto rounded-md p-1 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          }
          aria-invalid={Boolean(
            errors.confirmPassword,
          )}
        />
      </FormField>

      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
      >
        Create account
      </PrimaryButton>
    </form>
  );
}