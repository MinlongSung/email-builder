import { useTranslation } from "react-i18next";
import { BlockSidebar } from "@/components/blocks/shared/BlockSidebar";
import { ButtonIcon } from "@/assets/icons/ButtonIcon";

export const ButtonSidebar = () => {
  const { t } = useTranslation();
  return <BlockSidebar icon={<ButtonIcon />} label={t("button")} />;
};
