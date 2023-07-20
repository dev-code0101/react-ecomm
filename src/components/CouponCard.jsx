import React from "react";
import axios from "axios";

const CouponCard = ({ coupon, price, applyCoupon, onEdit, onDelete }) => {
  const handleApplyCoupon = () => {
    // Make a POST request to apply the coupon
    axios
      .post("http://localhost:8000/api/coupons/apply/", {
        code: coupon.code,
        price: price,
      })
      .then((response) => {
        // Update the applied price
        applyCoupon(response.data.new_price);
      })
      .catch((error) => {
        console.error("Failed to apply coupon:", error);
      });
  };

  return (
    <div className="card">
      <h3>Coupon Code: {coupon.code}</h3>
      <p>Discount Type: {coupon.discount_type}</p>
      <p>Discount Value: {coupon.discount_value}</p>
      <p>Expiration Date: {coupon.expiration_date}</p>
      <button onClick={handleApplyCoupon}>Apply Coupon</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default CouponCard;
