import { Link } from "react-router-dom";

const Product = ({ product }) => {
  console.log(product);

  return (
    <div key={product.id} className="col fade-zoom">
      <div className="card card-product">
        <div className="card-body">
          <div className="text-center position-relative">
            <div className="position-absolute top-0 start-0">
              <span className="badge bg-danger">Hot</span>
            </div>
            <Link to="#">
              <img
                src={product.image}
                alt={product.name}
                className="mb-3 img-fluid"
                style={{ height: "200px", width: "200px" }}
              />
            </Link>
            <div className="card-product-action">
              <Link
                to="#"
                className="btn-action"
                data-bs-toggle="modal"
                data-bs-target="#quickViewModal"
              >
                <i className="bi bi-eye" title="Quick View" />
              </Link>
              <Link to="#" className="btn-action" title="Wishlist">
                <i className="bi bi-heart" />
              </Link>
              <Link to="#" className="btn-action" title="Compare">
                <i className="bi bi-arrow-left-right" />
              </Link>
            </div>
          </div>
          <div className="text-small mb-1">
            <Link to="#" className="text-decoration-none text-muted">
              <small>{product.category}</small>
            </Link>
          </div>
          <h2 className="fs-6">
            <Link to="#" className="text-inherit text-decoration-none">
              {product.name}
            </Link>
          </h2>
          <div>
            <small className="text-warning">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={
                    index < Math.floor(product.rating)
                      ? "bi bi-star-fill"
                      : "bi bi-star-half"
                  }
                />
              ))}
            </small>
            <span className="text-muted small">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="text-dark">{product.price} VNĐ</span>
              <span className="text-decoration-line-through text-muted ml-1">
                {product.originalPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
