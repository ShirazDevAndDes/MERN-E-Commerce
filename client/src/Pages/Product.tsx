import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../Components/Loading";
import ProductCard from "../Components/ProductCard";
import SEO from "../Components/SEO";
import { addItem } from "../redux/slices/cartSlice";
import { ProductDataType, ProductsDataType } from "../types/pages/product";

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

async function getProduct(id: string) {
  return await axios
    .get("/product", {
      params: {
        id,
      },
    })
    .then((response) => response.data.result as ProductDataType);
}

// getBgContrast(bgColor, setBgContrast);
async function getRelatedProducts(id: string, category: string) {
  return await axios
    .get("/products", {
      params: {
        category: category || "",
        limit: 9,
      },
    })
    .then((response) => {
      const res = response.data.result as ProductsDataType;
      const products = res.products.filter((product) => product.id !== id);

      return products;
    });
}

export default function Product() {
  const params = useParams();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState<number>(1);

  const product = useQuery(
    "product",
    // getProduct
    () => getProduct(params.id)
  );

  const relatedProducts = useQuery(
    "relatedProducts",
    () => getRelatedProducts(product.data.id, product.data.category),
    { enabled: product.isSuccess }
  );
  console.log(relatedProducts);
  const {
    id,
    image,
    name,
    description,
    bgColor,
    price,
    // category,
    available_quantity,
  } = product?.data || {};
  if (product.isLoading) {
    return;
  }

  const bgContrast = getBgContrast(bgColor);

  return (
    <>
      <SEO
        title={`${product.data.name}`}
        description={`${product.data.description}`}
      />
      <div className="position-relative" style={{ backgroundColor: bgColor }}>
        <div className="container py-4">
          <div className="row p-5">
            <div
              className="col-4 position-relative d-flex justify-content-center"
              style={{ maxHeight: "300px" }}
            >
              <img
                className="img-fluid h-100"
                src={image?.secure_url || "#"}
                alt={name}
              />
            </div>
            <div className="col-8 text-bg-light rounded shadow">
              <div className="d-flex flex-column p-4 h-100">
                <div className="d-flex mb-3">
                  <h1 className="h3 m-0">{name}</h1>
                  <span className="vr ms-auto mx-2"></span>
                  <p className="h3 m-0">${price}</p>
                </div>
                <p className="">{description}</p>
                <div className="d-flex mt-auto">
                  <div className="d-flex">
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <div className="form-control mx-2 border-0 shadow-sm">
                      {quantity}
                    </div>
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        if (quantity < parseInt(available_quantity)) {
                          setQuantity(quantity + 1);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <button
                    className="btn ms-auto"
                    style={{ backgroundColor: bgColor, color: bgContrast }}
                    onClick={() => {
                      dispatch(
                        addItem({
                          product: {
                            id,
                            image,
                            name,
                            description,
                            bgColor,
                            price,
                            available_quantity,
                          },
                          quantity,
                        })
                      );
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <div className="row">
          {relatedProducts.isLoading && <Loading />}
          {relatedProducts.isSuccess && relatedProducts.data.length === 0 && (
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <p className="display-6">No Related Products</p>
              </div>
            </div>
          )}
          {relatedProducts.isSuccess &&
            relatedProducts.data.map((relatedProduct, index) => {
              const { id, image, ...data } = relatedProduct;

              return (
                <div key={index} className="col-12 col-md-4 col-lg-3">
                  <ProductCard
                    image={image.secure_url}
                    data={data}
                    link={"/product/" + id}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
