import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import BannerCard from "../BannerCard";
import ColorSelect from "./ColorSelect";
import { HTMLInputEventType, HTMLInputFileType } from "../../types/forms";
import { BannerEditFormInputType } from "../../types/pages/banner";
import { ReactQueryRefetchType } from "../../types/reactQuery";
// import { toast } from "react-toastify";
type BannerEditModalType = {
  editFormInput: BannerEditFormInputType;
  setEditFormInput: React.Dispatch<
    React.SetStateAction<BannerEditFormInputType>
  >;
  refetch: ReactQueryRefetchType;
};
export function BannerEditModalButton({ className, banner, setEditFormInput }) {
  return (
    <button
      className={className || "btn btn-success rounded-pill me-1 mb-2"}
      data-bs-target="#editBanner"
      data-bs-toggle="modal"
      onClick={() =>
        setEditFormInput({
          ...banner,
          image: "",
          image_url: banner.image.secure_url,
        })
      }
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );
}

export function BannerEditModal({
  editFormInput,
  setEditFormInput,
  refetch,
}: BannerEditModalType) {
  const [image, setImage] = useState(null);
  const bannerImage = editFormInput.image_url || "/image.png";

  function handleInput(e: HTMLInputEventType): void {
    const { name, value } = e.target;

    setEditFormInput({
      ...editFormInput,
      [name]: value,
    });
  }

  async function handleUploadImage(e: HTMLInputFileType): Promise<void> {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const { name, size, type } = file;
      const imageData = { name, size, type, base64: reader.result };
      setEditFormInput({ ...editFormInput, image: imageData });
      setImage(URL.createObjectURL(file));
      editFormInput.image_url = "";
    };
  }

  async function handleSubmit() {
    await axios
      .put("/banner", editFormInput)
      .then((response) => {
        const res = response.data;
        console.log(res);
        refetch();
      })
      .catch((error) => {
        const { msg } = error.response.data;
        console.log(msg);
      });
  }

  return (
    <div
      className="modal fade"
      id="editBanner"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 me-4 mt-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            style={{ zIndex: "1" }}
            onClick={() => setImage(null)}
          ></button>
          <div className="modal-body py-4 px-4">
            <div className="row">
              <h3 className="display-6 text-center mb-3">Edit Banner</h3>
              <hr />
              <div className="col-12 mb-4">
                <BannerCard image={image || bannerImage} data={editFormInput} />
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-4">
                    <label
                      htmlFor="edit-image"
                      className="w-100 shadow-sm rounded-5 border-0 mb-3"
                      style={{ minHeight: "150px" }}
                    >
                      <img
                        src={image || bannerImage}
                        className="img-fluid"
                        alt=""
                      />
                    </label>
                    <input
                      type="file"
                      className="form-control d-none"
                      name="image"
                      id="edit-image"
                      onChange={(e) => handleUploadImage(e)}
                    />
                  </div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control rounded-pill text-bg-light shadow-sm border-0"
                            name="name"
                            placeholder="Product Name"
                            value={editFormInput.name}
                            onChange={handleInput}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Background Color</label>
                          <ColorSelect
                            name={"bgColor"}
                            onChange={handleInput}
                            value={editFormInput.bgColor}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control rounded text-bg-light shadow-sm border-0"
                            name="description"
                            rows={4}
                            placeholder="Details about the product"
                            value={editFormInput.description}
                            onChange={handleInput}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid col-12 col-md-6 col-lg-4 mx-auto">
                    <button
                      className="btn btn-outline-success rounded-pill w-100"
                      onClick={handleSubmit}
                    >
                      Submit Banner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
