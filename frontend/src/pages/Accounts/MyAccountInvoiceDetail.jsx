import { FaArrowLeftLong } from "react-icons/fa6";

const MyAccountInvoiceDetail = ({ onBack }) => {
  return (
    <div className="p-4 mb-10 bg-white shadow-lg rounded">
      <p className="me-2 btn bg-gray-200" onClick={onBack}>
        <FaArrowLeftLong size={20} />
      </p>
      <div className="border-bottom pb-3">
        <p>
          <strong>Khách hàng:</strong> Nguyễn Văn A
        </p>
        <p>
          <strong>Email:</strong> nguyenvana@example.com
        </p>
        <p>
          <strong>Ngày:</strong> 11/03/2025
        </p>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Sản phẩm</th>
            <th className="text-center">Số lượng (bao)</th>
            <th className="text-end">Giá</th>
            <th className="text-end">Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cát</td>
            <td className="text-center">2</td>
            <td className="text-end">150,000 đ</td>
            <td className="text-end">300,000 đ</td>
          </tr>
          <tr>
            <td>Xi măng</td>
            <td className="text-center">1</td>
            <td className="text-end">250,000 đ</td>
            <td className="text-end">250,000 đ</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex justify-content-between fs-5 fw-bold">
        <span>Tổng cộng:</span>
        <span>550,000 đ</span>
      </div>

      <button className="btn btn-primary w-100 mt-3">Thanh toán hóa đơn</button>
    </div>
  );
};
export default MyAccountInvoiceDetail;
