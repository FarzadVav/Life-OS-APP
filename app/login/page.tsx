"use client";

import { Form } from "@base-ui/react";
import Field from "@/features/general/components/ui/Field";
import { LoginInputSchema } from "@/features/auth/lib/definitions";
import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { loginMutation } from "@/features/auth/mutations";
import { Button } from "@/features/general/components/ui/Button/Button";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(loginMutation, undefined);
  const { t } = useLocale();

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center flex-col p-3 gap-6">
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-container bg-card p-6 shadow-sm border border-foreground/5">
        <p className="w-full text-sm leading-6 sub-text">{t("login.quote")}</p>
        <div className="flex flex-col gap-1">
          <h1 className="title">{t("login.title")}</h1>
          <p className="sub-text">{t("login.subtitle")}</p>
        </div>

        <Form
          className="w-full space-y-6"
          aria-label={t("login.formLabel")}
          action={formAction}
          errors={state?.errors}
        >
          <Field
            name="username"
            label={t("login.username")}
            required
            minLength={3}
            defaultValue={state?.inputs?.username ?? ""}
            placeholder={t("login.usernamePlaceholder")}
            disabled={pending}
            schema={LoginInputSchema}
          />

          <Field
            name="password"
            label={t("login.password")}
            required
            minLength={6}
            type={showPassword ? "text" : "password"}
            placeholder={t("login.passwordPlaceholder")}
            disabled={pending}
            schema={LoginInputSchema}
            endAdornment={
              <Button
                type="button"
                variant="ghost"
                aria-label={
                  showPassword
                    ? t("login.hidePassword")
                    : t("login.showPassword")
                }
                onClick={() => setShowPassword((prev) => !prev)}
                className="h-auto w-auto p-0 rounded-none hover:bg-transparent muted-text [&_svg]:size-5"
                tabIndex={-1}
              >
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

      <div className="flex w-full max-w-sm flex-row gap-3">
        <LocaleSwitcher className="flex-1" />
        <ThemeSwitcher className="flex-1" />
      </div>
    </div>
  );
}

export default LoginPage;
