import axios from "axios";
import { useState } from "react";
import { AxiosResponseType } from "../../types/axios";
import { HTMLInputEventType } from "../../types/forms";
import { CategoryFormInput } from "../../types/pages/category";
import ColorSelect from "./ColorSelect";
import IconSelect from "./IconSelect";

export function CategoryAddModalButton() {
  return (
    <button
      className="btn btn-success w-100"
      data-bs-target="#addCategory"
      data-bs-toggle="modal"
    >
      Add Category
    </button>
  );
}

export function CategoryAddModal({ refetch }) {
  const [formInput, setFormInput] = useState<CategoryFormInput>({
    name: "",
    bgColor: "",
    iconName: "",
  });

  function handleInput(e: HTMLInputEventType) {
    const { name, value } = e.target;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  async function handleSubmit() {
    // console.log(formInput);
    await axios
      .post("/categories", formInput)
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
      id="addCategory"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-dialog-centered"
        role="document"
      >
        <div
          className="modal-content position-relative"
          style={{ overflow: "visible" }}
        >
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 me-4 mt-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            style={{ zIndex: "1" }}
          ></button>
          <div
            className="modal-body py-4 px-4"
            style={{ overflowY: "visible" }}
          >
            <div className="row">
              <h3 className="display-6 text-center mb-3">Add Category</h3>
              <hr />
              <div className="col-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control rounded-pill text-bg-light shadow-sm border-0"
                    name="name"
                    placeholder="Category Name"
                    value={formInput.name}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <ColorSelect
                    name={"bgColor"}
                    value={""}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <IconSelect
                    name={"iconName"}
                    value={""}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="d-flex col-12 col-md-6 mx-auto">
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
