import axios from "axios";

import { useMutation, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import Loading from "../Components/Loading";
import Pagination from "../Components/ProductsPagination";
import ProductCard from "../Components/ProductCard";
import ProductsFilter from "../Components/ProductsFilter";
import SEO from "../Components/SEO";
import { FilterProductsType, ProductsDataType } from "../types/pages/product";

export default function Products() {
  const [params, setParams] = useSearchParams();

  // const [page, setPage] = useState(params.get("page") || 1);
  // const [filters, setFilters] = useState<object>();

  function setParameter(name: string, value = "") {
    if (params.has(name)) {
      params.set(name, value);
    } else {
      params.append(name, value);
    }
    setParams(params);
  }

  async function getProducts() {
    const filters: FilterProductsType = {
      category: params.get("cat") || "",
      price: {
        min: parseInt(params.get("pMin")) || 0,
        max: parseInt(params.get("pMax")) || 0,
      },
    };

    return await axios
      .get("/products", {
        params: { ...filters, page: params.get("page") || "1", limit: 6 },
      })
      .then((response) => {
        console.log(response.data.result);
        return response.data.result as ProductsDataType;
      });
  }

  const queryClient = useQueryClient();

  // const products = useQuery("products", () => getProducts());
  // console.log(products);

  const {
    data: productsData,
    status,
    mutate: filterProducts,
  } = useMutation(() => getProducts(), {
    onSuccess: async (filteredProducts) => {
      console.log(filteredProducts);
      queryClient.setQueryData("products", filteredProducts);
      // return filteredProducts;
    },
  });

  const changePage = (currentPage, type) => {
    console.log(productsData);
    const totalPages = productsData.totalPages;

    const pageNumbers: number[] = [];

    for (var i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const lastPage = pageNumbers[pageNumbers.length - 1];
    let newPage = currentPage >= 1 || currentPage <= lastPage ? currentPage : 1;

    if (type === "prev") {
      newPage =
        parseInt(currentPage.toString()) <= 1
          ? 1
          : parseInt(currentPage.toString()) - 1;
    } else if (type === "next") {
      newPage =
        parseInt(currentPage.toString()) >= lastPage
          ? lastPage
          : parseInt(currentPage.toString()) + 1;
    }

    setParameter("page", newPage.toString());
    // setPage(newPage);
    filterProducts();
  };

  return (
    <>
      <SEO title="Products Page" />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-md-3 py-3 mb-3 shadow-sm">
            <ProductsFilter filterProducts={filterProducts} />
          </div>
          <div className="col-12 col-md-9">
            {status === "loading" && <Loading type={"card"} height="100%" />}
            {status === "success" && (
              <div className="row">
                {productsData.products.map((product, index) => {
                  const { image, ...data } = product;
                  return (
                    <div key={index} className="col-12 col-md-6 col-lg-4">
                      <ProductCard
                        image={image.secure_url}
                        data={data}
                        link={"/product/" + product.id}
                      />
                    </div>
                  );
                })}
                <div className="d-flex justify-content-end mt-4">
                  <Pagination
                    totalPages={productsData.totalPages}
                    // currentPage={page}
                    changePage={changePage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
