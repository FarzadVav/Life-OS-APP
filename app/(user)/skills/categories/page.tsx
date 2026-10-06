"use client";

import { FormEvent, useState } from "react";
import { Field } from "@base-ui/react";
import { PencilIcon, PlusIcon, TagIcon, Trash2Icon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import {
  useSkillCategories,
  SkillCategory,
} from "@/features/skills/categories";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function SkillCategoriesPage() {
  const { t } = useLocale();
  const { categories, addCategory, updateCategory, deleteCategory } =
    useSkillCategories();
  const [name, setName] = useState("");

  const [categoryToEdit, setCategoryToEdit] = useState<SkillCategory | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<SkillCategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    addCategory(trimmed);
    setName("");
  };

  const openEditDialog = (category: SkillCategory) => {
    setCategoryToEdit(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!categoryToEdit || !trimmed) {
      return;
    }

    updateCategory(categoryToEdit.id, trimmed);
    setIsEditDialogOpen(false);
    setCategoryToEdit(null);
    setEditName("");
  };

  const openDeleteDialog = (category: SkillCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("common.categories")}</TopBar.Title>
        <TopBar.Btn backIcon href="/skills" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <form onSubmit={handleAddSubmit} className="w-full">
          <input
            required
            value={name}
            minLength={1}
            className="input"
            placeholder="New category name..."
            onChange={(e) => setName(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            className="mt-3 w-full"
            disabled={!name.trim()}
          >
            <span>Add</span>
            <PlusIcon className="size-4" />
          </Button>
        </form>

        {categories.length === 0 ? (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-component
              border-2 border-dashed
              p-6
            "
          >
            <p className="sub-text">You haven{"'"}t any categories</p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="w-full flex items-center justify-between rounded-component bg-card p-3"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <span className="shrink-0 rounded-full bg-card-thick p-2">
                    <TagIcon className="size-4 sub-text" />
                  </span>
                  <span className="font-bold text-sm truncate">
                    {category.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    square
                    onClick={() => openEditDialog(category)}
                    aria-label={`Edit ${category.name}`}
                    className="text-foreground/70 hover:text-foreground"
                  >
                    <PencilIcon className="size-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    square
                    onClick={() => openDeleteDialog(category)}
                    aria-label={`Delete ${category.name}`}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="sub-text w-full text-center">
          Custom categories help keep your skills organized.
        </p>

        {/* Edit Category Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setCategoryToEdit(null);
              setEditName("");
            }
          }}
          className="w-full max-w-sm p-4"
        >
          <div>
            <Dialog.Title className="font-bold">Edit category</Dialog.Title>
            <Dialog.Description className="sub-text mt-1">
              Change the category name
            </Dialog.Description>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Field.Root name="categoryName">
              <Field.Label className="mb-1 font-bold">Name</Field.Label>
              <input
                autoFocus
                required
                minLength={1}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name..."
                className="input"
              />
            </Field.Root>

            <div className="flex items-center justify-end gap-3">
              <Dialog.Close
                render={
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                disabled={!editName.trim()}
              >
                Save
              </Button>
            </div>
          </form>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setCategoryToDelete(null);
            }
          }}
          className="w-full max-w-sm p-4"
        >
          <div>
            <Dialog.Title className="font-bold">Delete category?</Dialog.Title>
            <Dialog.Description className="sub-text mt-1">
              {categoryToDelete
                ? `"${categoryToDelete.name}" will be permanently removed.`
                : "This category will be permanently removed."}
            </Dialog.Description>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              }
            />

            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </Dialog>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default SkillCategoriesPage;
