import {
  faCartShopping,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "../redux/slices/cartSlice";
import { CartInitialState } from "../types/redux/slices/cart";

export default function CartItems({
  items,
  addToCartBtn = true,
}: {
  items: CartInitialState["items"];
  addToCartBtn?: boolean;
}) {
  const dispatch = useDispatch();

  return items.length > 0 ? (
    <ul className="list-group mb-3">
      {items.map((item, index) => (
        <li key={index} className="list-group-item py-3 py-md-2">
          <div className="row px-3">
            <Link
              to={"/product/" + item.product.id}
              className="col-12 col-md-1 d-flex justify-content-center img-fluid cartProductImage bg-light rounded shadow-sm py-1 px-2 mb-3 mb-md-0"
            >
              <img
                className="img-fluid h-100 m-auto"
                src={item.product.image.secure_url}
                alt={item.product.name}
              />
            </Link>
            {/* <div className="col-12 col-md-8"> */}
            <div className="col">
              <div className="container-fluid">
                <div className="row text-center text-md-start">
                  <div className="col-12 col-md-9 d-flex flex-column">
                    <p className="fs-4 d-none d-md-block fw-light m-0">
                      {item.product.name}
                    </p>
                    <p className="fs-1 d-block d-md-none fw-light m-0">
                      {item.product.name}
                    </p>
                    <small className="fw-light m-0">Qty: {item.quantity}</small>
                  </div>

                  <hr className="d-block d-md-none my-3" />
                  <div className="col-12 col-md-3 d-md-block d-none border-start border-end text-center">
                    <p className="fs-2 d-md-none d-block text-dark m-0">
                      ${item.price}
                    </p>
                    <p className="fs-4 d-none d-md-block text-dark m-0">
                      ${item.price}
                    </p>
                    <small className="text-muted m-0">
                      ${item.product.price} Each
                    </small>
                  </div>
                  <div className="col-12 col-md-3 d-block d-md-none text-center">
                    <p className="fs-2 d-md-none d-block text-dark m-0">
                      ${item.price}
                    </p>
                    <p className="fs-4 d-none d-md-block text-dark m-0">
                      ${item.price}
                    </p>
                    <small className="text-muted m-0">
                      <b>Each</b> ${item.product.price}
                    </small>
                  </div>
                </div>
              </div>
              {/* <div className="vr d-none d-md-inline-block"></div> */}
              {/* <div className="vr d-none d-md-inline-block"></div> */}
              <hr className="d-block d-md-none my-3" />
            </div>

            {addToCartBtn && (
              <div className="col-12 col-md-3 gx-4 gx-md-2">
                <div className="row align-items-center h-100 gx-2">
                  <div className="col-3 col-md-4">
                    {item.quantity > 1 ? (
                      <button
                        className="btn btn-dark w-100"
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(decreaseQuantity({ id: item.product.id }));
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger w-100"
                        onClick={() =>
                          dispatch(removeItem({ id: item.product.id }))
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>

                  <div className="col">
                    <div className="form-control text-center bg-light border-0 shadow-sm">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="col-3 col-md-4">
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => {
                        if (
                          item.quantity <
                          parseInt(item.product.available_quantity)
                        ) {
                          dispatch(increaseQuantity({ id: item.product.id }));
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-muted bg-light d-flex flex-column justify-content-center align-items-center h-100">
      <FontAwesomeIcon icon={faCartShopping} className="fs-1" />
      <p className="h4">Empty</p>
    </div>
  );
}
