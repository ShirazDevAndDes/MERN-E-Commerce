import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import CartItems from "../../Components/CartItems";
import useAuth from "../../Hooks/useAuth";
import { ProductDataType } from "../../types/pages/product";
import OrdersPagination from "../../Components/OrdersPageination";
import Loading from "../../Components/Loading";
import { HTMLInputEventType } from "../../types/forms";

type OrdersDataType = {
  userInfo: {
    name: string;
    address: string;
    id: string;
  };
  items: [
    {
      product: ProductDataType;
      quantity: number;
      price: number;
    }
  ];
  subTotal: number;
  shipping: number;
  status: string;
  sessionStatus: string;
  id: string;
};

type OrdersType = {
  [key: string]: {
    orders: OrdersDataType[];
    totalPages: number;
    currentPage: number;
  };
};

export default function AdminOrders() {
  const { user } = useAuth();

  const [ordersCurrentPage, setOrdersCurrentPage] = useState({
    allOrdersCurrentPage: 1,
    pendingCurrentPage: 1,
    acceptedCurrentPage: 1,
    completeCurrentPage: 1,
    canceledCurrentPage: 1,
  });

  const OrdersTabs = [
    "all_Orders",
    "pending",
    "accepted",
    "complete",
    "canceled",
  ];

  async function getOrders() {
    const { data } = await axios.get("/orders", {
      params: { userId: user.id, ordersCurrentPage, limit: 2 },
    });
    console.log(data);
    return data.result;
  }

  async function changeStatus(id: string, e: HTMLInputEventType) {
    await axios
      .post("/orders/statusChange", { orderId: id, status: e.target.value })
      .then((response) => {
        const res = response.data;
        console.log(res);
        if (res.result) {
          changePage();
        }
      })
      .catch((error) => {
        const { data = "" } = error.response;
        console.log(data);
      });
  }

  // const { data: OrdersData, status }: { data: OrdersType; status: string } =
  //   useQuery("userOrders", getOrders);

  const queryClient = useQueryClient();

  const {
    data: OrdersData,
    status,
    mutate: changePage,
  }: { data: OrdersType; status: string; mutate: any } = useMutation(
    getOrders,
    {
      onSuccess: (newOrders) => {
        queryClient.setQueryData("userOrders", newOrders);
      },
    }
  );

  useEffect(() => {
    changePage();
    //eslint-disable-next-line
  }, [ordersCurrentPage]);

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <h1>Orders</h1>
          <hr />
          <ul className="nav nav-tabs nav-justified" role="tablist">
            {OrdersTabs.map((Tab, index) => (
              <li key={index} className="nav-item" role="presentation">
                <button
                  className={
                    index === 0
                      ? "nav-link active text-capitalize"
                      : "nav-link text-capitalize"
                  }
                  data-bs-toggle="tab"
                  data-bs-target={`#${Tab}-tab-pane`}
                  type="button"
                  role="tab"
                  aria-controls={`${Tab}-tab-pane`}
                  aria-selected="true"
                >
                  {Tab.replace("_", " ")}
                </button>
              </li>
            ))}
          </ul>
          <div className="tab-content py-3" id="myTabContent">
            {OrdersTabs.map((Tab, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "tab-pane fade show active"
                    : "tab-pane fade show"
                }
                id={`${Tab}-tab-pane`}
                role="tabpanel"
                aria-labelledby="all-tab"
                tabIndex={0}
              >
                {status === "loading" ? (
                  <Loading />
                ) : status === "success" ? (
                  <>
                    {OrdersData[Tab].orders.length > 0 ? (
                      OrdersData[Tab].orders.map((order, index) => {
                        return (
                          <div
                            key={index}
                            className="border rounded mb-2 py-2 px-3"
                          >
                            <div className="d-flex flex-row align-items-center p-0 btn text-start">
                              <div
                                className="fw-bold fs-4 w-100"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${Tab}-${index}`}
                              >
                                # {order.id}
                              </div>
                              <div className="vr"></div>
                              <div className="col-2 d-flex flex-column text-center ps-4">
                                <>
                                  <div className="fw-bold fs-6">Status</div>
                                  {/* {console.log(order.status)} */}
                                  <select
                                    defaultValue={order.status}
                                    onChange={(e) => changeStatus(order.id, e)}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="complete">Complete</option>
                                    <option value="canceled">Canceled</option>
                                  </select>
                                </>
                              </div>
                            </div>
                            <div
                              className="collapse p-3"
                              id={`collapse-${Tab}-${index}`}
                            >
                              <hr />
                              <CartItems
                                items={order.items}
                                addToCartBtn={false}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-100 mb-2">
                        <div className="card">
                          <div className="card-body text-bg-light text-center text-capitalize">
                            <div className="display-6">No Orders {Tab}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {OrdersData[Tab].orders.length > 0 && (
                      <OrdersPagination
                        totalPages={OrdersData[Tab].totalPages}
                        currentPage={OrdersData[Tab].currentPage}
                        orderPages={ordersCurrentPage}
                        pageName={Tab.replace("_", "")}
                        setPage={setOrdersCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
