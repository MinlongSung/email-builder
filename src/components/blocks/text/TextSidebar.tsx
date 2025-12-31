import { useTranslation } from "react-i18next";
import { BlockSidebar } from "@/components/blocks/shared/BlockSidebar";
import { TextIcon } from "@/assets/icons/TextIcon";

export const TextSidebar = () => {
  const { t } = useTranslation();
  return <BlockSidebar icon={<TextIcon />} label={t("text")} />;
};
