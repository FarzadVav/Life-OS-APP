# Todos

- Move life-areas to an internal profile page
- Add tags for journals
- Add stack for missions>disciplines and habits repeat-intervals

Remove all manually mutations with buttons onClicks and handle them with froms and actions,
this is a example of issue on features/life-areas/components/LifeAreaCard/LifeAreaCard.tsx:
<Button
    type="button"
    variant="primary"
    onClick={handleDelete}
    disabled={isDeleting}
    className="bg-red-600 text-white hover:bg-red-700">
    {isDeleting ? (
    <span className="flex items-center gap-1.5">
        <LoaderIcon className="size-4 animate-spin" />
        <span>{t("common.loading")}</span>
    </span>
    ) : (
    <span>{t("common.delete")}</span>
    )}
</Button> .
and this is example of right way on features/auth/components/LogoutBtn/LogoutBtn.tsx:
<form action={logoutAction} className="flex-1">
    <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoggingOut}>
        {isLoggingOut ? t("common.loading") : t("profile.logout")}
    </Button>
</form> .

Do this across the app.