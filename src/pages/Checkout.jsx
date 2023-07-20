import { Navbar, AddCoupon, CouponCard, EmptyCart } from "../components";
import { useSelector } from "react-redux";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [appliedPrice, setAppliedPrice] = useState(null);

  let subtotal = 0;
  let shipping = 30.0;
  let totalItems = 0;
  state.map((item) => {
    return (subtotal += item.price * item.qty);
  });

  state.map((item) => {
    return (totalItems += item.qty);
  });

  const ShowCheckout = () => {
    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})
                      <span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    {appliedPrice !== null ? (
                      <>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          Old Price:
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "red",
                            }}
                          >
                            ${Math.round(subtotal + shipping)}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <strong>New Price</strong>
                          <span> ${Math.round(appliedPrice)}</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <strong>Total amount</strong>
                          <span>${Math.round(subtotal + shipping)}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState(null);

    useEffect(() => {
      // Send a GET request to fetch coupon data from Django API
      axios
        .get("http://localhost:8000/api/coupons/")
        .then((response) => {
          // Handle the response, update the state with the fetched data
          setCoupons(response.data);
        })
        .catch((error) => {
          // Handle errors, e.g., show error message
          console.error("Failed to fetch coupons:", error);
        });
    }, []);

    const handleDeleteCoupon = (couponId) => {
      // Send a DELETE request to delete the coupon
      axios
        .delete(`http://localhost:8000/api/coupons/${couponId}/`)
        .then((response) => {
          console.log("Coupon deleted successfully:", response.data);
          // Remove the deleted coupon from the state
          setCoupons((prevCoupons) =>
            prevCoupons.filter((coupon) => coupon.id !== couponId)
          );
        })
        .catch((error) => {
          console.error("Failed to delete coupon:", error);
        });
    };

    return (
      <>
        <h2>All Coupons</h2>
        <div className="coupon-list container py-5">
          {editingCoupon ? (
            <AddCoupon
              couponData={editingCoupon}
              onCancel={() => setEditingCoupon(null)}
              onAddOrUpdate={(updatedCoupon) => {
                // Update the edited coupon in the state
                setCoupons((prevCoupons) =>
                  prevCoupons.map((coupon) =>
                    coupon.id === updatedCoupon.id ? updatedCoupon : coupon
                  )
                );
                setEditingCoupon(null);
              }}
            />
          ) : (
            <>
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  price={subtotal + shipping}
                  applyCoupon={(newPrice) => {
                    setAppliedPrice(newPrice);
                  }}
                  onEdit={() => setEditingCoupon(coupon)}
                  onDelete={() => handleDeleteCoupon(coupon.id)}
                />
              ))}
              <AddCoupon
                onAddOrUpdate={(newCoupon) => {
                  // Add the new coupon to the state
                  setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
                }}
              />
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <CouponList />
    </>
  );
};

export default Checkout;
