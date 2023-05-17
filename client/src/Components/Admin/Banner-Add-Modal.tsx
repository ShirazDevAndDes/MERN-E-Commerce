import axios from "axios";
import { useState } from "react";
import { AxiosResponseType } from "../../types/axios";
import { HTMLInputEventType, HTMLInputFileType } from "../../types/forms";
import { BannerFormInputType } from "../../types/pages/banner";
import { ReactQueryRefetchType } from "../../types/reactQuery";
import BannerCard from "../BannerCard";
import ColorSelect from "./ColorSelect";
// import { toast } from "react-toastify";

export function BannerAddModalButton() {
  return (
    <button
      className="btn btn-success w-100"
      data-bs-target="#addBanner"
      data-bs-toggle="modal"
    >
      Add Banner
    </button>
  );
}

type BannerAddModalType = {
  refetch: ReactQueryRefetchType;
};

export function BannerAddModal({ refetch }: BannerAddModalType) {
  const [image, setImage] = useState(null);
  const [formInput, setFormInput] = useState<BannerFormInputType>({
    image: { name: "", size: 0, type: "", base64: "" },
    name: "",
    description: "",
    bgColor: "",
  });

  function handleInput(e: HTMLInputEventType): void {
    const { name, value } = e.target;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  async function handleUploadImage(e: HTMLInputFileType) {
    const target = e.target;
    const file = target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const { name, size, type } = file;
      const imageData = { name, size, type, base64: reader.result };
      setFormInput({ ...formInput, image: imageData });
      setImage(URL.createObjectURL(file));
    };
  }

  async function handleSubmit() {
    // console.log(formInput);
    await axios
      .post("/banner", formInput)
      .then((response) => {
        const res: AxiosResponseType = response.data;
        refetch();
        console.log(res);
      })
      .catch((error) => {
        const { msg }: { msg: string } = error.response.data;
        console.log(msg);
      });
  }

  return (
    <div
      className="modal fade"
      id="addBanner"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
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
              <h3 className="display-6 text-center mb-3">Add Banner</h3>
              <hr />
              <div className="col-12">
                <div className="mb-4" style={{ minHeight: "350px" }}>
                  <BannerCard image={image} data={formInput} />
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-4">
                    <label
                      htmlFor="add-image"
                      className="w-100 shadow-sm rounded-5 border-0 mb-3"
                      style={{ minHeight: "150px" }}
                    >
                      <img
                        src={image || "/image.png"}
                        className="img-fluid shadow-sm rounded-5 border-0 mb-3"
                        alt=""
                      />
                    </label>
                    <input
                      type="file"
                      className="form-control d-none"
                      name="image"
                      id="add-image"
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
                            value={formInput.name}
                            onChange={(e) => handleInput(e)}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label">Background Color</label>
                          <ColorSelect
                            name={"bgColor"}
                            onChange={handleInput}
                            value=""
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
                            maxLength={150}
                            placeholder="Details about the product"
                            value={formInput.description}
                            onChange={(e) => handleInput(e)}
                          ></textarea>
                        </div>
                      </div>
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
  );
}
