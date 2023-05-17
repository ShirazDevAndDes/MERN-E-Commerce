import { IconName } from "@fortawesome/fontawesome-svg-core";

export type CategoryFormInput = {
  name: string;
  bgColor: string;
  iconName: string;
};
export interface CategoryEditFormInput extends CategoryFormInput {
  id: string;
}

export interface CategoryData extends Omit<CategoryEditFormInput, "iconName"> {
  iconName: IconName;
}
