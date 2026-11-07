'use client';

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/conversations");
      router.refresh();
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            callbackUrl: "/conversations",
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error("Registration succeeded, please sign in.");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Welcome aboard!");
            router.push("/conversations");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not register. Email may already exist."))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        callbackUrl: "/conversations",
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Welcome back!");
            router.push("/conversations");
            router.refresh();
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { callbackUrl: "/conversations" })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Social authentication failed");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
          backdrop-blur-2xl
          bg-slate-900/85
          border
          border-slate-800/80
          px-6
          py-8
          shadow-2xl
          shadow-black/60
          rounded-2xl
          sm:px-10
        "
      >
        {/* Variant Tabs Header */}
        <div className="flex rounded-xl bg-slate-950/70 p-1 mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setVariant("LOGIN")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              variant === "LOGIN"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setVariant("REGISTER")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              variant === "REGISTER"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Full Name"
              register={register}
              errors={errors}
              disabled={isLoading}
              placeholder="e.g. John Doe"
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            placeholder="passenger@example.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            placeholder="••••••••"
          />

          <div className="pt-2">
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Continue to Messenger" : "Register Account"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <AuthSocialButton
              icon={BsGithub}
              label="GitHub"
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              label="Google"
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div className="flex gap-1.5 justify-center text-xs mt-6 text-slate-400">
          <span>
            {variant === "LOGIN"
              ? "First time boarding?"
              : "Already have a ticket?"}
          </span>
          <button
            type="button"
            onClick={toggleVariant}
            className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition cursor-pointer"
          >
            {variant === "LOGIN" ? "Create an account" : "Sign in here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
