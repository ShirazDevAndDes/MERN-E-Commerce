import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  BannerAddModal,
  BannerAddModalButton,
} from "../../Components/Admin/Banner-Add-Modal";
import {
  BannerEditModal,
  BannerEditModalButton,
} from "../../Components/Admin/Banner-Edit-Modal";
import BannerCard from "../../Components/BannerCard";
import SEO from "../../Components/SEO";
import { AxiosResponseType } from "../../types/axios";
import {
  BannerEditFormInputType,
  BannerDataType,
} from "../../types/pages/banner";

export default function AdminBanners() {
  const [editFormInput, setEditFormInput] = useState<BannerEditFormInputType>({
    id: "",
    image: { name: "", size: 0, type: "", base64: "" },
    name: "",
    description: "",
    bgColor: "",
  });

  const searchValue = useRef<HTMLInputElement>();

  const queryClient = useQueryClient();

  async function getBanners() {
    // console.log(search);
    const bannersData: object[] = await axios
      .get("/banners", {
        params: {
          searchValue,
        },
      })
      .then((response) => response.data.result);
    // console.log(bannersData);
    return bannersData;
  }

  async function deleteBanner(id: string) {
    await axios
      .delete("/banner", { data: { id } })
      .then((response) => {
        const res: AxiosResponseType = response.data;
        const { msg } = res;
        toast.success(msg);
        refetch();
      })
      .catch((error) => {
        const { msg }: { msg: string } = error.response.data;

        toast.error(msg);
      });
  }

  const { data: banners, status, refetch } = useQuery("banners", getBanners);

  const { mutate: searchBanners } = useMutation(getBanners, {
    onSuccess: (data) => {
      console.log("data: ", data);
      queryClient.setQueryData("banners", data);
    },
  });

  return (
    <>
      <SEO title="Admin | Banners" noIndex={true} />
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-12 col-sm-6 col-md-7">
                    <input
                      type="text"
                      className="form-control border-0 text-bg-light shadow-none"
                      id="search"
                      placeholder="Search Products"
                      ref={searchValue}
                    />
                  </div>
                  <div className="col-12 col-sm-3 col-md-2">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => searchBanners()}
                    >
                      Search
                    </button>
                  </div>
                  <div className="col-12 col-sm-3 col-md-3">
                    <BannerAddModalButton />
                  </div>
                  <BannerAddModal refetch={refetch} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {status === "error" && (
              <div className="card shadow-sm text-bg-danger">
                <div className="card-body text-center">
                  <p className="display-6">Something Went Wrong.</p>
                </div>
              </div>
            )}
            {status === "success" && banners?.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <p className="display-6">No Banners Added Yet.</p>
                </div>
              </div>
            ) : (
              ""
            )}
            {status === "success" && banners?.length > 0 ? (
              <div className="row">
                {banners.map((banner: BannerDataType, index) => {
                  const { image, ...bannerData } = banner;
                  return (
                    <div key={index} className="col-12 col-md-6 mb-3">
                      <div className="position-relative shadow-sm">
                        <div className="position-absolute top-0 end-0 mt-3 me-3">
                          <BannerEditModalButton
                            banner={banner}
                            setEditFormInput={setEditFormInput}
                            className={"btn btn-primary me-2"}
                          />
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteBanner(banner.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        <BannerCard
                          image={image.secure_url}
                          data={bannerData}
                        />
                      </div>
                    </div>
                  );
                })}
                <BannerEditModal
                  editFormInput={editFormInput}
                  setEditFormInput={setEditFormInput}
                  refetch={refetch}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
