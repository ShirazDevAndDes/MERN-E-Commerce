import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/slices/cartSlice";
import { ProductCardType } from "../types/pages/product";

export default function ProductCard({
  image,
  data,
  link = null,
  addToCartBtn = true,
}: ProductCardType) {
  const { id, name, description, price, available_quantity, bgColor } = data;

  const dispatch = useDispatch();

  return (
    <div className="d-flex h-100">
      <div
        className="card product-card shadow mb-3 position-relative w-100"
        style={{ backgroundColor: bgColor || "black" }}
      >
        <div className="bg-layer"></div>

        <Link
          to={link}
          className="d-flex justify-content-center p-2"
          style={{ height: "180px" }}
        >
          <img className="img-fluid h-100" src={image || "#"} alt={name} />
        </Link>
        <div className="card-body bg-transparent text-center pt-0 d-flex flex-column justify-content-between">
          <Link className="h-100" to={"/product/" + id}>
            <p className="text-muted fw-light fs-4 mb-0">{name}</p>
            <p className="text-muted fs-3">${price}</p>
          </Link>
          {addToCartBtn && (
            <button
              className="btn rounded-pill text-black"
              style={{ backgroundColor: "orange" }}
              onClick={() =>
                dispatch(
                  addToCart({
                    product: {
                      id,
                      image: { secure_url: image },
                      name,
                      description,
                      bgColor,
                      price,
                      available_quantity,
                    },
                  })
                )
              }
            >
              Add To Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
