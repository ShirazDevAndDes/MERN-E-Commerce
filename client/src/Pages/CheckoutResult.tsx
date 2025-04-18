import axios from "axios";
import { useEffect } from "react";
import Loading from "../Components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../Components/SEO";

export default function CheckoutResult() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const checkoutLink = "/user/checkout/";

  let operation = null;
  let message = "";

  async function checkoutSuccess() {
    await axios
      .post("/checkout/success/", { id })
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res) {
          operation = "success";
          message = res.msg;
        } else {
          operation = "error";
          message = "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
        const { data = null } = error.response;

        if (data) {
          operation = "error";
          message = data.msg;
        } else {
          operation = "error";
          message = "Something went wrong";
        }
      });
    navigate(checkoutLink, {
      state: {
        operation,
        message,
      },
    });
  }
  async function checkoutCancel() {
    await axios
      .post("/checkout/cancel/", { id })
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res) {
          operation = "cancel";
          message = res.msg;
        } else {
          operation = "error";
          message = "Something went wrong";
        }
      })
      .catch((error) => {
        const { msg = "Something went wrong" } = error.response.data;

        operation = "error";
        message = msg;
      });
    navigate(checkoutLink, {
      state: {
        operation,
        message,
      },
    });
  }

  useEffect(() => {
    if (!id) {
      navigate(checkoutLink, {
        state: {
          operation: "error",
          message: "Something went wrong",
        },
      });
    } else {
      if (type.toString() === "success") {
        checkoutSuccess();
      } else if (type.toString() === "cancel") {
        checkoutCancel();
      } else {
        navigate(checkoutLink, {
          state: {
            operation: "error",
            message: "Something went wrong",
          },
        });
      }
    }

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <SEO title="Checkout" noIndex={true} />
      <Loading type="screen" />
    </>
  );
}
