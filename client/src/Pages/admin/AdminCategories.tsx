import axios from "axios";
import { useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import {
  CategoryAddModal,
  CategoryAddModalButton,
} from "../../Components/Admin/Category-Add-Modal";
import {
  CategoryEditModal,
  CategoryEditModalButtons,
} from "../../Components/Admin/Category-Edit-Modal";
import SEO from "../../Components/SEO";
import {
  CategoryData,
  CategoryEditFormInput,
} from "../../types/pages/category";

export default function AdminCategories() {
  const [editFormInput, setEditFormInput] = useState<CategoryEditFormInput>({
    id: "",
    name: "",
    iconName: "",
    bgColor: "",
  });

  const searchInput = useRef<HTMLInputElement>();
  const queryClient = useQueryClient();

  async function getCategories() {
    // console.log(search);
    const categoryData = await axios
      .get("/categories", { params: { search: searchInput.current.value } })
      .then((response) => response.data.result);
    console.log(categoryData);
    return categoryData as CategoryData[];
  }

  const {
    data: categories,
    status,
    refetch,
  } = useQuery("categories", getCategories);

  const { mutate: searchCategories } = useMutation(getCategories, {
    onSuccess: async (newCategories) => {
      console.log("newCategories: ", newCategories);
      // queryClient.removeQueries("categories");
      queryClient.setQueryData("categories", newCategories);
    },
  });

  return (
    <>
      <SEO title="Admin | Categories" noIndex={true} />
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
                      ref={searchInput}
                      placeholder="Search Products"
                    />
                  </div>
                  <div className="col-12 col-sm-3 col-md-2">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => searchCategories()}
                    >
                      Search
                    </button>
                  </div>
                  <div className="col-12 col-sm-3 col-md-3">
                    <CategoryAddModalButton />
                  </div>
                  <CategoryAddModal refetch={refetch} />
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
            {status === "success" && categories?.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <p className="display-6">No category added yet.</p>
                </div>
              </div>
            ) : (
              ""
            )}
            {status === "success" && categories?.length > 0 ? (
              <div className="card shadow-sm">
                <div className="card-body d-flex flex-wrap justify-content-center">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <CategoryEditModalButtons
                        category={category}
                        setEditFormInput={setEditFormInput}
                      />
                    </div>
                  ))}

                  <CategoryEditModal
                    editFormInput={editFormInput}
                    setEditFormInput={setEditFormInput}
                    refetch={refetch}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}
