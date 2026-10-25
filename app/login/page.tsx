"use client";

import { Form } from "@base-ui/react";
import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { loginMutation } from "@/features/auth/mutations";
import Field from "@/features/general/components/ui/Field";
import { LoginInputSchema } from "@/features/auth/lib/definitions";
import { Button } from "@/features/general/components/ui/Button/Button";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";

function LoginPage() {
  const { t } = useLocale();
  const [state, formAction, pending] = useActionState(loginMutation, undefined);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-dvh px-3 py-6">
      <div className="h-full w-full max-w-160 gap-6 items-center justify-center flex-col flex">
        <div className="w-full flex flex-col gap-6 rounded-container bg-card p-6">
          <p className="w-full sub-text">{t("login.quote")}</p>
          <div className="space-y-1">
            <h1 className="title">{t("login.title")}</h1>
            <p className="sub-text">{t("login.subtitle")}</p>
          </div>

          <Form
            action={formAction}
            errors={state?.errors}
            className="w-full space-y-3"
            aria-label={t("login.formLabel")}>
            <Field
              required
              minLength={3}
              name="username"
              disabled={pending}
              schema={LoginInputSchema}
              label={t("login.username")}
              placeholder={t("login.usernamePlaceholder")}
              defaultValue={state?.inputs?.username ?? ""}
            />

            <Field
              required
              minLength={6}
              name="password"
              disabled={pending}
              schema={LoginInputSchema}
              label={t("login.password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              endAdornment={
                <Button
                  square
                  type="button"
                  tabIndex={-1}
                  variant="ghost"
                  className="h-full w-auto aspect-square"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              }
            />

            <Field.FormError
              message={state?.message}
              errors={state?.errors}
              knownFields={["username", "password"]}
            />

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? t("login.pending") : t("login.submit")}
            </Button>
          </Form>
        </div>

        <div className="flex w-full gap-3 *:w-1/2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
