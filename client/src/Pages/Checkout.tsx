import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAll,
  itemsShipping,
  itemsSubTotal,
  selectAllItems,
} from "../redux/slices/cartSlice";
import useAuth from "../Hooks/useAuth";
import axios from "axios";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import CartItems from "../Components/CartItems";
import SEO from "../Components/SEO";

export default function Checkout() {
  const { user } = useAuth();

  const items = useSelector(selectAllItems);
  const subTotal = useSelector(itemsSubTotal);
  const shipping = useSelector(itemsShipping);
  const dispatch = useDispatch();

  const location = useLocation();

  const userNameRef = useRef<HTMLInputElement>();
  const userAddressRef = useRef<HTMLInputElement>();

  async function checkout() {
    if (!userNameRef.current.value) {
      toast.error("Your must enter your name");
    }
    if (!userAddressRef.current.value) {
      toast.error("Your must enter your address");
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
    }

    if (
      userNameRef.current.value &&
      userAddressRef.current.value &&
      items.length > 0
    ) {
      await axios
        .post("/checkout", {
          userInfo: {
            id: user.id,
            name: userNameRef.current.value,
            address: userAddressRef.current.value,
          },
          items,
          subTotal,
          shipping,
        })
        .then((response) => {
          const res = response.data;
          console.log(res);
          const { url } = res.result;
          window.location.href = url;
        })
        .catch(async (err) => {
          const error = err.response.data;
          console.log(error);
          const { msg = "Something Went Wrong" } = error;
          toast.error(msg);
          if (error.orderSessionID) {
            await axios
              .post("/checkout/cancel/", { id: error.data.orderSessionID })
              .then((response) => {
                const res = response.data;
                console.log(res);
                // const { url } = res.result;
              })
              .catch((err) => {
                const error = err.response;
                console.log(error);
              });
          }
        });
    }
  }

  useEffect(() => {
    const { state } = location;
    if (state) {
      const { operation, message = "" } = state;
      if (operation === "success") {
        toast.success(message);
        dispatch(clearAll());
      }

      if (operation === "cancel") {
        toast.success(message);
      }

      if (operation === "error") {
        toast.error(message);
      }
    }

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <SEO title="Checkout" noIndex={true} />
      <div className="container py-5 mvh-100">
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-row">
              <p className="h3 mb-0">Cart Items</p>
              <button
                className="btn btn-danger btn-sm rounded-0 ms-auto"
                onClick={() => dispatch(clearAll())}
              >
                Clear All
              </button>
            </div>
            <hr />
            <CartItems items={items} />
            {/* <div className="container-fluid h-100">
            </div> */}
          </div>
          <div className="col-12 col-lg-4">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-12">
                <div className="card border shadow-sm mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <p className="h5 mb-0">Shipping Information</p>
                      <button
                        className="btn btn-primary btn-sm ms-auto"
                        onClick={() => {
                          document
                            .querySelectorAll(".input-group")
                            .forEach((input) => {
                              input.classList.toggle("shadow-sm");
                              input.classList.toggle("border");
                              input.classList.toggle("border-dark");
                              input
                                .querySelector("input")
                                .toggleAttribute("readonly");

                              console.log();
                            });
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <hr />
                    <div className="d-flex flex-column">
                      <div className="input-group mb-3 text-dark">
                        <span className="input-group-text border-0 rounded-0 bg-transparent">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-0 rounded-0 shadow-none"
                          value={user.firstName + " " + user.lastName}
                          placeholder="Name"
                          ref={userNameRef}
                          readOnly
                        />
                      </div>
                      <div className="input-group mb-3 text-dark">
                        <span
                          className="input-group-text border-0 rounded-0 bg-transparent"
                          id=""
                        >
                          <FontAwesomeIcon icon={faLocationDot} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-0 rounded-0 shadow-none"
                          value={user.address}
                          placeholder="Address"
                          ref={userAddressRef}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-12">
                <div className="card border shadow-sm">
                  <div className="card-body fs-5">
                    <div className="d-flex">
                      <span className="me-auto">Sub Total:</span>{" "}
                      <span>${subTotal}</span>
                    </div>
                    <div className="d-flex">
                      <span className="me-auto">Shipping:</span>{" "}
                      <span>${shipping}</span>
                    </div>
                    <hr />
                    <p className="h3 mb-3">Total: ${subTotal + shipping}</p>
                    <button
                      className="btn btn-dark btn-lg w-100 rounded-0"
                      onClick={checkout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
