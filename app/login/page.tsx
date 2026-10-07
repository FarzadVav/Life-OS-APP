"use client";

import { useActionState, useState } from "react";
import { Field, Form } from "@base-ui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/features/general/components/ui/Button/Button";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { login } from "@/features/auth/actions/auth";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(login, undefined);
  const { t } = useLocale();

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center flex-col p-3 gap-6">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-component bg-card p-6">
        <p className="w-full text-sm leading-6 sub-text">{t("login.quote")}</p>
        <div className="flex flex-col gap-1">
          <h1 className="title">{t("login.title")}</h1>
          <p className="sub-text">{t("login.subtitle")}</p>
        </div>

        <Form
          className="w-full space-y-6"
          aria-label="Login form"
          action={action}
          errors={state?.errors}
        >
          <Field.Root name="username">
            <Field.Label className="block font-bold">
              {t("login.username")}
            </Field.Label>

            <Field.Control
              required
              minLength={3}
              name="username"
              className="input"
              placeholder={t("login.usernamePlaceholder")}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground" />
          </Field.Root>

          <Field.Root name="password">
            <Field.Label className="block font-bold">
              {t("login.password")}
            </Field.Label>

            <div className="relative">
              <Field.Control
                required
                minLength={6}
                name="password"
                type={showPassword ? "text" : "password"}
                className="input pr-10"
                placeholder={t("login.passwordPlaceholder")}
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? t("login.hidePassword")
                    : t("login.showPassword")
                }
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 muted-text [&_svg]:size-5"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <Field.Error className="sub-text mt-0.5 text-foreground" />
          </Field.Root>

          {state?.message && (
            <p className="sub-text text-foreground">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t("login.pending") : t("login.submit")}
          </Button>
        </Form>
      </div>

      <div className="flex w-full max-w-sm flex-row gap-3">
        <LocaleSwitcher className="flex-1" />
        <ThemeSwitcher className="flex-1" />
      </div>
    </div>
  );
}

export default LoginPage;
