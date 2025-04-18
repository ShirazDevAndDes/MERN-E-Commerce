import axios from "axios";
import { useEffect, useState } from "react";
import currencies from "../../assets/currencies.json";
// import colorNames from "../../assets/colorNames.json";
import ProductCard from "../ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ColorSelect from "./ColorSelect";
import { HTMLInputEventType, HTMLInputFileType } from "../../types/forms";
import { CategoryData } from "../../types/pages/category";
import {
  ProductDataType,
  ProductEditFormInputType,
} from "../../types/pages/product";
import { ReactQueryRefetchType } from "../../types/reactQuery";

type ProductEditModalButtonType = {
  product: ProductDataType;
  setEditFormInput: React.Dispatch<
    React.SetStateAction<{ image: string } | Omit<ProductDataType, "image">>
  >;
};

export function ProductEditModalButton({
  product,
  setEditFormInput,
}: ProductEditModalButtonType) {
  return (
    <button
      className="btn btn-sm btn-primary me-1"
      data-bs-target="#editProduct"
      data-bs-toggle="modal"
      onClick={() => {
        setEditFormInput({
          ...product,
          image: "",
          image_url: product.image.secure_url,
        });
      }}
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );
}

type ProductEditModalType = {
  editFormInput: ProductEditFormInputType;
  setEditFormInput: React.Dispatch<
    React.SetStateAction<ProductEditFormInputType>
  >;
  refetch: ReactQueryRefetchType;
};

export function ProductEditModal({
  editFormInput,
  setEditFormInput,
  refetch,
}: ProductEditModalType) {
  // console.log(editFormInput.image_url);
  const [image, setImage] = useState<null | string>(null);
  const [categories, setCategories] = useState<null | CategoryData[]>(null);
  const productImage: string = editFormInput.image_url || "/image.png";

  function handleInput(e: HTMLInputEventType) {
    const { name, value } = e.target;

    setEditFormInput({
      ...editFormInput,
      [name]: value,
    });
  }

  async function getCategories() {
    await axios
      .get("/categories")
      .then((response) => setCategories(response.data.result));
  }

  async function handleUploadImage(e: HTMLInputFileType) {
    const target = e.target;
    const file = target.files[0];
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
    console.log(editFormInput);
    await axios
      .put("/product", editFormInput)
      .then((response) => {
        const res = response.data;
        const { msg } = res;
        toast.success(msg);
        refetch();
      })
      .catch((error) => {
        // console.log(error);
        const { msg } = error.response.data;
        toast.error(msg);
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      className="modal fade"
      id="editProduct"
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
              <h3 className="display-6 text-center mb-3">Edit Product</h3>
              <hr />
              <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                <div className="col-12 col-sm-6 col-lg-12 mx-auto">
                  <ProductCard
                    image={image || productImage}
                    data={editFormInput}
                    addToCartBtn={false}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-9">
                <div className="row">
                  <div className="col-4">
                    <label
                      htmlFor="edit-image"
                      className="w-100 shadow-sm rounded-5 border-0 mb-3"
                      style={{ minHeight: "150px" }}
                    >
                      <img
                        src={image || productImage}
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
                            value={editFormInput.bgColor}
                            onChange={handleInput}
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
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="text"
                        className="form-control rounded-pill text-bg-light shadow-sm border-0"
                        name="price"
                        min={0}
                        placeholder="Product Name"
                        value={editFormInput.price}
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select rounded-pill text-bg-light shadow-sm border-0"
                        name="category"
                        value={editFormInput.category}
                        onChange={handleInput}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {categories &&
                          categories.map((category, index) => (
                            <option key={index} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Available Quantity</label>
                      <input
                        type="number"
                        className="form-control rounded-pill text-bg-light shadow-sm border-0"
                        name="available_quantity"
                        min={0}
                        placeholder="Available Product Quantity"
                        value={editFormInput.available_quantity}
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Currency</label>
                      <select
                        className="form-select rounded-pill text-bg-light shadow-sm border-0"
                        name="currency"
                        value={editFormInput.currency}
                        onChange={handleInput}
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {currencies &&
                          currencies.map((currency, index) => (
                            <option
                              key={index}
                              value={currency.name.toLowerCase()}
                            >
                              {currency.name.toUpperCase()}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="d-grid col-12 col-md-6 col-lg-4 mx-auto">
                    <button
                      className="btn btn-outline-success rounded-pill w-100"
                      onClick={handleSubmit}
                    >
                      Submit Product
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
