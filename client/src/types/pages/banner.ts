import { FormImageType } from "../forms";

export type BannerFormInputType = {
  image: FormImageType | string;
  name: string;
  description: string;
  bgColor: string;
};

export interface BannerEditFormInputType extends BannerFormInputType {
  id: string;
  image_url?: string;
}

export interface BannerDataType extends Omit<BannerFormInputType, "image"> {
  id?: string;
  image: {
    asset_id?: string;
    public_id?: string;
    format?: string;
    resource_type?: string;
    secure_url: string;
  };
}
