import React, { useEffect, useState } from "react";
import graphics from "../../images/store-graphics.svg";
import { BASE_URL } from "../../Utils/config";
import { Slide, Zoom } from "react-awesome-reveal";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { Link } from "react-router-dom";

const StoreList = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [stores, setStores] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams({
          page: 1,
          size: 10,
          sortBy: "id",
          direction: "ASC",
        });
        const shop = await fetch(
          `${BASE_URL}/api/public/shops?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!shop.ok) {
          throw new Error("Network response was not ok");
        }
        const data1 = await shop.json();
        setStores(data1.content);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchCategories();
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperclassName="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
            <>
              <ScrollToTop />
            </>
            <>
              {/* section*/}
              <div className="mt-4">
                <div className="container">
                  {/* row */}
                  <div className="row ">
                    {/* col */}
                    <div className="col-12">{/* breadcrumb */}</div>
                  </div>
                </div>
              </div>
            </>
            <>
              {/* section */}
              <section>
                {/* container */}
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-12">
                      {/* heading */}
                      <div className="bg-light rounded-3 d-flex justify-content-between">
                        <div className="d-flex align-items-center p-10">
                          <Slide direction="down">
                            <h2 className="mb-0 fw-bold">
                              Danh sách nhà cung cấp
                            </h2>
                          </Slide>
                        </div>
                        <div className="p-6">
                          {/* img */}
                          {/* img */}
                          <Zoom>
                            <img
                              src={graphics}
                              alt="graphics"
                              className="img-fluid"
                            />
                          </Zoom>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <section className="mt-6 mb-lg-14 mb-8">
                {/* container */}
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4">
                        {/* title */}
                        <h6>
                          Có{" "}
                          <span className="text-primary">{stores.length}</span>{" "}
                          nhà cung cấp
                        </h6>
                      </div>
                    </div>
                  </div>
                  {stores.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 g-lg-4">
                      {stores.map((store, index) => (
                        <div key={index} className="col">
                          <Zoom>
                            {/* card */}
                            <div className="card flex-row p-8 card-product">
                              <div>
                                <img
                                  src={store?.logoImage}
                                  alt="stores"
                                  className="rounded-circle icon-shape icon-xl"
                                />
                              </div>
                              <div className="ms-6">
                                <h5 className="mb-1">
                                  <Link
                                    to={`/SingleShop/${store.id}`}
                                    className="text-inherit"
                                  >
                                    {store.name}
                                  </Link>
                                </h5>
                                <div className="small text-muted">
                                  <span>
                                    {store.shopType === "ENTERPRISE"
                                      ? "Doanh nghiệp lớn"
                                      : "Doanh nghiệp nhỏ"}
                                  </span>
                                  <span className="mx-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={4}
                                      height={4}
                                      fill="#C1C7C6"
                                      className="bi bi-circle-fill align-middle"
                                      viewBox="0 0 16 16"
                                    >
                                      <circle cx={8} cy={8} r={8} />
                                    </svg>
                                  </span>
                                </div>
                                <div className="py-3">
                                  <ul className="list-unstyled mb-0 small">
                                    <li>
                                      <span className="text-muted">
                                        {store.address.address},{" "}
                                        {store.address.ward},{" "}
                                        {store.address.district},{" "}
                                        {store.address.province}
                                      </span>
                                    </li>
                                    <li>{store.address.postalCode}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </Zoom>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="dropdown-item">Đang tải...</p>
                  )}
                </div>
              </section>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreList;
