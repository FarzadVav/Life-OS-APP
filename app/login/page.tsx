"use client";

import { useActionState, useState } from "react";
import { Field, Form } from "@base-ui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/features/general/components/ui/Button/Button";
import { login } from "@/features/auth/actions/auth";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-3">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-component bg-card p-6">
        <div className="flex flex-col gap-1">
          <h1 className="title">Welcome back</h1>
          <p className="sub-text">Log in to continue your journey.</p>
        </div>

        <Form
          className="w-full space-y-6"
          aria-label="Login form"
          action={action}
          errors={state?.errors}
        >
          <Field.Root name="username">
            <Field.Label className="block font-bold">Username</Field.Label>

            <Field.Control
              required
              minLength={3}
              name="username"
              className="input"
              placeholder="Your username..."
            />

            <Field.Error className="sub-text mt-0.5 text-red-400" />
          </Field.Root>

          <Field.Root name="password">
            <Field.Label className="block font-bold">Password</Field.Label>

            <div className="relative">
              <Field.Control
                required
                minLength={6}
                name="password"
                type={showPassword ? "text" : "password"}
                className="input pr-10"
                placeholder="Your password..."
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 muted-text [&_svg]:size-5"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <Field.Error className="sub-text mt-0.5 text-red-400" />
          </Field.Root>

          {state?.message && (
            <p className="sub-text text-red-400">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
