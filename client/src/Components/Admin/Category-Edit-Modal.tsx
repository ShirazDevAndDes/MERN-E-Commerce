import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import ColorSelect from "./ColorSelect";
import IconSelect from "./IconSelect";

function getBgContrast(
  bgColor = "#ffffff",
  lightColor = "#ffffff",
  darkColor = "#000000"
) {
  var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}

export function CategoryEditModalButtons({ category, setEditFormInput }) {
  const { name, iconName, bgColor } = category;

  const bgContrast = getBgContrast(bgColor);

  return (
    <button
      className="btn me-2 mb-2 shadow-sm text-capitalize"
      style={{ backgroundColor: bgColor, color: bgContrast }}
      data-bs-target="#editCategory"
      data-bs-toggle="modal"
      onClick={() => {
        console.log(category);
        setEditFormInput(category);
      }}
    >
      <FontAwesomeIcon icon={["fas", iconName]} className={"me-2"} />
      {name}
    </button>
  );
}

export function CategoryEditModal({
  editFormInput,
  setEditFormInput,
  refetch,
}) {
  function handleInput(e) {
    const { name, value } = e.target;

    setEditFormInput({
      ...editFormInput,
      [name]: value,
    });
  }

  async function deleteCategory() {
    // await axios
    //   .delete("/category", { data: { id: editFormInput._id } })
    //   .then((response) => response.data.result)
    //   .catch((error) => console.log(error.response.data.msg));
  }

  async function handleSubmit() {
    await axios
      .put("/categories", editFormInput)
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
      id="editCategory"
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
              <h3 className="display-6 text-center mb-3">Edit Category</h3>
              <hr />
              <div className="col-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control rounded-pill text-bg-light shadow-sm border-0"
                    name="name"
                    placeholder="Category Name"
                    value={editFormInput.name}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <ColorSelect
                    name={"bgColor"}
                    value={editFormInput.bgColor}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <IconSelect
                    name={"iconName"}
                    value={editFormInput.iconName}
                    onChange={handleInput}
                  />
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-2 g-2">
                <div className="col">
                  <button
                    className="btn btn-outline-success rounded-pill w-100"
                    onClick={handleSubmit}
                  >
                    Submit Category
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-outline-danger rounded-pill w-100"
                    onClick={deleteCategory}
                  >
                    Delete Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
