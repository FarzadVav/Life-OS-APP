"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

import { Skill } from "../../types";
import { skills as initialSkills } from "../../constants";
import { useSkillCategories } from "../../categories";
import SkillCard from "../SkillCard/SkillCard";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function SkillsTabs() {
  const [skillsList] = useState<Skill[]>(initialSkills);
  const { categories } = useSkillCategories();
  const { t } = useLocale();
  const sp = useSearchParams();

  const tab = sp.get("tab");
  const activeTab = tab || "all";

  const hasCategories = categories.length > 0;

  const currentSkills =
    !hasCategories || activeTab === "all"
      ? skillsList
      : skillsList.filter(
          (item) => item.type?.toLowerCase() === activeTab.toLowerCase(),
        );

  return (
    <>
      {!hasCategories ? (
        <Button
          nativeButton={false}
          variant="card"
          className="w-full justify-center gap-1.5"
          render={<Link href="/skills/categories" />}
        >
          <PlusIcon className="size-4" />
          <span>{t("skills.createFirstCategory")}</span>
        </Button>
      ) : (
        <div className="w-full flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
          <Button
            nativeButton={false}
            render={<Link href="?tab=all" scroll={false} />}
            variant={activeTab === "all" ? "primary" : "card"}
            className="shrink-0"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              nativeButton={false}
              render={
                <Link
                  href={`?tab=${encodeURIComponent(category.name)}`}
                  scroll={false}
                />
              }
              variant={activeTab === category.name ? "primary" : "card"}
              className="shrink-0"
            >
              {category.name}
            </Button>
          ))}

          <Button
            nativeButton={false}
            render={<Link href="/skills/categories" />}
            variant="card"
            className="shrink-0 gap-1.5"
          >
            <PlusIcon className="size-4" />
            <span>{t("common.categories")}</span>
          </Button>
        </div>
      )}

      <div className="w-full overflow-hidden rounded-component">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={hasCategories ? activeTab : "all"}
            className="w-full space-y-3"
            transition={{ ease: "linear", duration: 0.15 }}
            initial={{
              translateX: "-10%",
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={{ translateX: 0, opacity: 1, filter: "none" }}
            exit={{
              translateX: "10%",
              opacity: 0,
              filter: "blur(4px)",
            }}
          >
            {currentSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}

            {currentSkills.length === 0 && (
              <div
                className="
                  flex w-full flex-1
                  items-center justify-center
                  rounded-component
                  border-2 border-dashed
                  p-6
                "
              >
                <p className="sub-text">
                  {hasCategories && activeTab !== "all"
                    ? t("skills.noSkillsInCategory")
                    : t("skills.noSkills")}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default SkillsTabs;
