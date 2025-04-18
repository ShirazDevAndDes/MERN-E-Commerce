import {
  faCartShopping,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAll,
  decreaseQuantity,
  increaseQuantity,
  itemsShipping,
  itemsSubTotal,
  removeItem,
  selectAllItems,
  itemsCount,
} from "../redux/slices/cartSlice";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";

export function CartButton({
  className,
  style,
}: {
  className?: string;
  style?: {};
}) {
  const items = useSelector(itemsCount);

  return (
    <button
      className={className + " position-relative"}
      style={{ ...style }}
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#cartList"
    >
      <FontAwesomeIcon icon={faCartShopping} />
      <span className="position-absolute top-100 start-100 translate-middle badge rounded-pill bg-danger">
        {items}
      </span>
    </button>
  );
}

export function CartOffCanvas() {
  const { user, isLoggedIn } = useAuth();

  const items = useSelector(selectAllItems);
  const subTotal = useSelector(itemsSubTotal);
  const shipping = useSelector(itemsShipping);

  const dispatch = useDispatch();

  return (
    <div
      className="offcanvas offcanvas-end"
      data-bs-backdrop="false"
      data-bs-scroll="true"
      id="cartList"
    >
      <div className="offcanvas-header">
        <h5 className="fs-4">Cart</h5>
        <div
          className="btn btn-danger rounded-0 ms-auto"
          onClick={() => dispatch(clearAll())}
        >
          Clear All
        </div>
        <div className="vr ms-2"></div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body bg-light mh-75">
        {items.length > 0 ? (
          <ul className="list-group list-group-flush">
            {items.map((item, index) => (
              <li key={index} className="list-group-item d-flex flex-row">
                <div
                  className="bg-light rounded d-flex w-25"
                  style={{ height: "50px" }}
                >
                  <img
                    className="img-fluid h-100 m-auto p-1"
                    src={item.product.image.secure_url}
                    alt={item.product.name}
                  />
                </div>
                <div className="d-flex flex-column w-100 px-3">
                  {item.product.name}
                  <div className="d-flex flex-row justify-content-between">
                    <small className="text-muted">Qty: {item.quantity}</small>
                    <small className="text-muted">Price: ${item.price}</small>
                  </div>
                </div>
                <div className="d-flex align-self-center ms-auto">
                  {item.quantity > 1 ? (
                    <button
                      className="btn btn-dark"
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
                      className="btn btn-danger"
                      onClick={() =>
                        dispatch(removeItem({ id: item.product.id }))
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}

                  <div className="form-control mx-2 border-0 shadow-sm">
                    {item.quantity}
                  </div>
                  <button
                    className="btn btn-dark"
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
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted d-flex flex-column justify-content-center align-items-center h-100">
            <FontAwesomeIcon icon={faCartShopping} className="fs-1" />
            <p className="h4">Empty</p>
          </div>
        )}
      </div>
      <div className="shadow p-3 mh-25">
        <div className="d-flex">
          <span className="me-auto">Sub Total:</span> <span>${subTotal}</span>
        </div>
        <div className="d-flex">
          <span className="me-auto">Shipping:</span> <span>${shipping}</span>
        </div>
        <hr />
        <p className="h3 mb-3">Total: ${subTotal + shipping}</p>
        {isLoggedIn && user.role === "user" ? (
          <Link className="btn btn-dark w-100" to={"/user/checkout"}>
            <FontAwesomeIcon icon={faCartShopping} className="me-2" />
            Checkout
          </Link>
        ) : (
          <div
            className="btn btn-dark w-100"
            onClick={() => toast.error("Login To Checkout")}
          >
            <FontAwesomeIcon icon={faCartShopping} className="me-2" />
            Checkout
          </div>
        )}
      </div>
    </div>
  );
}
