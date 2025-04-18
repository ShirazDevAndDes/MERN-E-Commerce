import axios from "axios";
import { useEffect, useState } from "react";
import currencies from "../../assets/currencies.json";
import ProductCard from "../ProductCard";
import { toast } from "react-toastify";
import ColorSelect from "./ColorSelect";
import LoadingIcons from "react-loading-icons";
import { HTMLInputEventType, HTMLInputFileType } from "../../types/forms";
import { ProductFormInputType } from "../../types/pages/product";
import { ReactQueryRefetchType } from "../../types/reactQuery";
import { CategoryData } from "../../types/pages/category";
import { AxiosResponseType } from "../../types/axios";

export function ProductAddModalButton() {
  return (
    <button
      className="btn btn-success w-100"
      data-bs-target="#addProduct"
      data-bs-toggle="modal"
    >
      Add Product
    </button>
  );
}

export function ProductAddModal({
  refetch,
}: {
  refetch: ReactQueryRefetchType;
}) {
  const initialFormState: ProductFormInputType = {
    image: { name: "", size: 0, type: "", base64: "" },
    name: "",
    description: "",
    bgColor: "",
    price: "",
    category: "",
    available_quantity: "",
    currency: "",
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<null | string>(null);
  const [categories, setCategories] = useState<null | CategoryData[]>(null);
  const [formInput, setFormInput] =
    useState<ProductFormInputType>(initialFormState);

  async function getCategories() {
    await axios
      .get("/categories")
      .then((response) => setCategories(response.data.result));
  }

  function handleInput(e: HTMLInputEventType) {
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
    console.log(formInput);
    setLoading(true);
    await axios
      .post("/product", formInput)
      .then((response) => {
        const res: AxiosResponseType = response.data;
        const { msg } = res;
        toast.success(msg);
        refetch();
      })
      .catch((error) => {
        // console.log(error);
        const { msg }: { msg: string } = error.response.data;
        toast.error(msg);
      });
    setLoading(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      className="modal fade"
      id="addProduct"
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
          {loading && (
            <div
              className="position-absolute d-flex flex-column justify-content-center align-items-center text-center text-dark w-100 h-100 z-index-5"
              style={{ backgroundColor: "#ffffff80" }}
            >
              <LoadingIcons.Audio fill="#212529" height={"10%"} />
              <p className="d-inline mt-2">Uploading</p>
            </div>
          )}
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 me-4 mt-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            style={{ zIndex: "1" }}
            onClick={() => {
              setImage(null);
              setFormInput(initialFormState);
            }}
          ></button>
          <div className="modal-body py-4 px-4">
            <div className="row">
              <h3 className="display-6 text-center mb-3">Add Product</h3>
              <hr />
              <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                <div className="col-12 col-sm-6 col-lg-12 mx-auto">
                  <ProductCard
                    image={image}
                    data={formInput}
                    addToCartBtn={false}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-9">
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
                            value={formInput.bgColor}
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
                            value={formInput.description}
                            onChange={(e) => handleInput(e)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control rounded-pill text-bg-light shadow-sm border-0"
                        name="price"
                        min={0}
                        placeholder="Product Price"
                        value={formInput.price}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select rounded-pill text-bg-light shadow-sm border-0"
                        name="category"
                        value={formInput.category}
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
                        value={formInput.available_quantity}
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
                        value={formInput.currency}
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
  );
}
