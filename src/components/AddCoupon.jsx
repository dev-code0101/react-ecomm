import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCoupon = ({ couponData, onCancel, onAddOrUpdate }) => {
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "",
    discount_value: "",
    expiration_date: "",
  });

  useEffect(() => {
    // If couponData is provided (for edit mode), fill the form with the coupon data
    if (couponData) {
      setFormData(couponData);
    }
  }, [couponData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (couponData) {
      // If couponData is provided, it means we're updating an existing coupon
      // Send a PUT request to update the coupon
      axios
        .put(`http://localhost:8000/api/coupons/${couponData.id}/`, formData)
        .then((response) => {
          console.log("Coupon updated successfully:", response.data);
          onAddOrUpdate(response.data); // Notify CouponList component about the update
        })
        .catch((error) => {
          console.error("Failed to update coupon:", error);
        });
    } else {
      // If couponData is not provided, it means we're creating a new coupon
      // Send a POST request to create a new coupon
      axios
        .post("http://localhost:8000/api/coupons/", formData)
        .then((response) => {
          console.log("Coupon added successfully:", response.data);
          onAddOrUpdate(response.data); // Notify CouponList component about the new coupon
          setFormData({
            code: "",
            discount_type: "",
            discount_value: "",
            expiration_date: "",
          }); // Reset the form after successful creation
        })
        .catch((error) => {
          console.error("Failed to add coupon:", error);
        });
    }
  };

  return (
    <div>
      <h2>{couponData ? "Edit Coupon" : "Add Coupon"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Coupon Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Discount Type:</label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
          >
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div>
          <label>Discount Value:</label>
          <input
            type="text"
            name="discount_value"
            value={formData.discount_value}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Expiration Date:</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {couponData ? "Update Coupon" : "Add Coupon"}
        </button>
        {couponData && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default AddCoupon;
