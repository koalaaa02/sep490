import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaypal, FaCcMastercard, FaCcVisa } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { setBank } from "../Redux/purchase.js";

export default function PaymentMethods() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("Domestic ATM");
  const dispatch = useDispatch();
  const bankCode = useSelector((state) => state.purchase.bank);

  const paymentOptions = [
    { label: "Domestic ATM", icon: <FaPaypal /> },
    { label: "Credit Card", icon: [<FaCcMastercard className="me-1" />, <FaCcVisa className="me-2" />] },
    { label: "Paypal", icon: <BsBank2 /> },
  ];

  const atms = [
    { value: "NCB", image: "https://www.saokim.com.vn/wp-content/uploads/2023/01/Bieu-Tuong-Logo-Ngan-Hang-NCB.png" },
    { value: "BIDV", image: "https://image.bnews.vn/MediaUpload/Org/2022/04/26/logo-bidv-20220426071253.jpg" },
  ];

  const creditCard = [
    { value: "visa", image: "https://1000logos.net/wp-content/uploads/2021/11/VISA-logo.png" },
    { value: "mastercard", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" },
  ];

  const supportedPayment = () => {
    if (selectedPaymentMethod === "Paypal") return null;
    let paymentArray = selectedPaymentMethod === "Credit Card" ? creditCard : atms;
    return paymentArray.map((atm) => (
      <div
        key={atm.value}
        className={`card m-2 p-2 shadow-sm text-center border ${atm.value === bankCode ? "border-primary" : "border-light"}`}
        style={{
          width: "120px",
          height: "70px",
          backgroundImage: `url(${atm.image})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
        }}
        onClick={() => dispatch(setBank(atm.value))}
      ></div>
    ));
  };

  return (
    <div className="container">
      <div className="list-group">
        {paymentOptions.map((option) => (
          <label key={option.label} className="list-group-item d-flex align-items-center gap-2 p-3 border rounded shadow-sm" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="paymentMethod"
              value={option.label}
              checked={selectedPaymentMethod === option.label}
              onChange={() => setSelectedPaymentMethod(option.label)}
            />
            {option.icon}
            <span className="fw-bold">{option.label}</span>
          </label>
        ))}
      </div>
      <div className="d-flex flex-wrap">{supportedPayment()}</div>
    </div>
  );
}