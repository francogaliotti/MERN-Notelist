import { useTranslation } from "react-i18next"

export const NotesPageLoggedOutView = () => {
  const {t} = useTranslation("global")

  return <p>{t("others.not_logged_in")}</p>
}
