import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  ProductAddModal,
  ProductAddModalButton,
} from "../../Components/Admin/Product-Add-Modal";
import {
  ProductEditModal,
  ProductEditModalButton,
} from "../../Components/Admin/Product-Edit-Modal";
import SEO from "../../Components/SEO";
import { CategoryData } from "../../types/pages/category";
import { ProductEditFormInputType } from "../../types/pages/product";

export default function AdminProducts() {
  const [categories, setCategories] = useState<CategoryData[] | null>(null);
  const [editFormInput, setEditFormInput] = useState<ProductEditFormInputType>({
    id: "",
    image: { name: "", size: 0, type: "", base64: "" },
    name: "",
    description: "",
    bgColor: "",
    price: "",
    category: "",
    available_quantity: "",
    currency: "",
  });

  const searchValue = useRef<HTMLInputElement>();
  const categoryValue = useRef<HTMLSelectElement>();

  const queryClient = useQueryClient();

  async function getProducts() {
    const name = searchValue.current.value;
    const category = categoryValue.current.value;

    return await axios
      .get("/products", { params: { name, category } })
      .then((response) => {
        // console.log(response.data);
        return response.data.result;
      });
  }

  const { data, isSuccess, isLoading, refetch } = useQuery(
    "products",
    getProducts,
    {
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: searchProducts } = useMutation(getProducts, {
    onSuccess: (newData) => {
      // console.log("data: ", data);
      queryClient.setQueryData("products", newData);
    },
  });

  async function deleteProduct(id) {
    await axios
      .delete("/product", { data: { id } })
      .then((response) => {
        const res = response.data;
        const { msg } = res;
        toast.success(msg);
        refetch();
      })
      .catch((error) => {
        const { msg } = error.response.data;

        toast.error(msg);
      });
  }

  useEffect(() => {
    axios
      .get("/categories")
      .then((response) => setCategories(response.data.result));
  }, []);

  return (
    <>
      <SEO title="Admin | Products" noIndex={true} />
      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            <div className="row gx-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control border-0 text-bg-light"
                  placeholder="Search Products"
                  ref={searchValue}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-2">
                <select
                  className="form-select border-0 text-bg-light"
                  name="category"
                  defaultValue={""}
                  ref={categoryValue}
                >
                  <option value="">All</option>
                  {categories &&
                    categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => searchProducts()}
                >
                  Search
                </button>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <ProductAddModalButton />
              </div>
              <ProductAddModal refetch={refetch} />
            </div>
          </div>
        </div>
        <div className="row">
          {isLoading && (
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <LoadingIcons.Bars
                    fill="#212529"
                    height={"4%"}
                    width={"4%"}
                  />
                </div>
              </div>
            </div>
          )}
          {isSuccess && (
            <>
              {data.products.length > 0 ? (
                data.products.map((product, index) => (
                  <div key={index} className="col-12 col-md-3 mb-3">
                    <div
                      className="card shadow-sm rounded-0 position-relative"
                      style={{ backgroundColor: product.bgColor }}
                    >
                      <div className="flex flex-column position-absolute top-0 end-0 p-3">
                        <ProductEditModalButton
                          product={product}
                          setEditFormInput={setEditFormInput}
                        />
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <div
                        className="d-flex justify-content-center p-2"
                        style={{ height: "160px" }}
                      >
                        <img
                          src={product.image.secure_url}
                          className="img-fluid h-100"
                          alt=""
                        />
                      </div>
                      <div className="card-body rounded-0 shadow-top bg-white">
                        <h4 className="text-capitalize">{product.name}</h4>
                        <span className="h5 text-success fw-light">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <span className="display-5">No Products Available.</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <ProductEditModal
            editFormInput={editFormInput}
            setEditFormInput={setEditFormInput}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
}
