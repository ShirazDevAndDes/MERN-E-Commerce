import axios from "axios";
import { useQuery } from "react-query";
import BannerCard from "../Components/BannerCard";
import CategoryCard from "../Components/CategoryCard";
import ProductCard from "../Components/ProductCard";
import SEO from "../Components/SEO";
import { BannerDataType } from "../types/pages/banner";
import { CategoryData } from "../types/pages/category";
// import Categories from "../Components/Categories";
// import Products from "../Components/Products";

const getBanners = async () => {
  const { data } = await axios.get("/banners");
  return data.result;
};

const getCategories = async () => {
  const { data } = await axios.get("/categories");
  return data.result as CategoryData[];
};

const getProducts = async () => {
  const { data } = await axios.get("/products");
  return data.result;
};

export default function Home() {
  const bannersQuery = useQuery("banners", getBanners);
  const categoriesQuery = useQuery("categories", getCategories);
  const productsQuery = useQuery("products", getProducts);

  // console.log(categoriesQuery.data);
  // console.log(productsQuery.data);

  return (
    <>
      <SEO title="Home" description={"Website Description"} />
      <div className="min-vh-100">
        <div id="carouselId" className="carousel slide" data-bs-ride="carousel">
          <ol className="carousel-indicators">
            {bannersQuery.status === "success" &&
              bannersQuery.data.map((banner: BannerDataType, index: number) => {
                if (index === 0) {
                  return (
                    <li
                      key={index}
                      data-bs-target="#carouselId"
                      data-bs-slide-to={index}
                      className="active"
                    ></li>
                  );
                }
                return (
                  <li
                    key={index}
                    data-bs-target="#carouselId"
                    data-bs-slide-to={index}
                  ></li>
                );
              })}
          </ol>
          <div className="carousel-inner">
            {bannersQuery.status === "success" &&
              bannersQuery.data.map((banner: BannerDataType, index: number) => {
                const { image, ...bannerData } = banner;

                if (index === 0) {
                  return (
                    <div key={index} className="carousel-item active">
                      <BannerCard
                        className={"min-vh-50-md min-vh-75-lg"}
                        image={image.secure_url}
                        data={bannerData}
                      />
                    </div>
                  );
                }
                return (
                  <div key={index} className="carousel-item">
                    <BannerCard
                      className={"min-vh-50-sm"}
                      image={image.secure_url}
                      data={bannerData}
                    />
                  </div>
                );
              })}
          </div>
          <button
            className="carousel-control-prev h-25 my-auto"
            style={{ width: "10%" }}
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next  h-25 my-auto"
            style={{ width: "10%" }}
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className="container">
          <div className="row py-4 g-2 row-cols-1 row-cols-md-2 row-cols-lg-4">
            {categoriesQuery.status === "success" &&
              categoriesQuery.data.map((category, index) => (
                // <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-2">
                <div key={index} className="col">
                  <CategoryCard category={category} />
                </div>
              ))}
          </div>
          <div className="row">
            {productsQuery.status === "success" &&
              productsQuery.data.products.map((product, index) => {
                const { image, ...data } = product;

                return (
                  <div
                    key={index}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <ProductCard
                      image={image.secure_url}
                      data={data}
                      link={"/product/" + product.id}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
