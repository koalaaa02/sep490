import slider1 from "../images/banner_1.jpg";
import slider2 from "../images/banner_2.jpg";
import adbanner1 from "../images/adbanner1.jpg";
import adbanner2 from "../images/adbanner2.jpg";
import adbanner3 from "../images/adbanner3.jpg";
import dfCate from "../images/defaultCategory.png";
import clock from "../images/clock.svg";
import gift from "../images/gift.svg";
import package1 from "../images/package.svg";
import refresh from "../images/refresh-cw.svg";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import ProductItem from "../ProductList/ProductItem";
import { Slide, Zoom } from "react-awesome-reveal";
import { useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { BASE_URL } from "../Utils/config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import { Grid } from "swiper/modules";
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [materials, setMaterial] = useState([]);
  // const [parentCateID, setparentCateID] = useState(1);
  // const [selectSubCate, setSelectSubCate] = useState(
  //   materials[0]?.subCategories || []
  // );

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: "1",
          size: "200",
          sortBy: "id",
          direction: "ASC",
        });
        const response = await fetch(
          `${BASE_URL}/api/public/categories?${params.toString()}`,
          {
            method: "GET",
            headers: {
              // Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();

        setMaterial(
          result.map((c) => ({
            name: c.name,
            id: c.id,
            src: c.images,
            alt: c?.name,
            subCategories: c.subCategories,
          }))
        );
        // setparentCateID(result[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
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
              <div className="scroll-to-top">
                <button
                  onClick={scrollToTop}
                  className={`scroll-to-top-button ${
                    isVisible ? "show" : ""
                  } bg-warning text-dark`}
                >
                  ↑
                </button>
              </div>
              <section className="hero-section">
                <div className="container mt-8">
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <div
                          style={{
                            background: `url(${slider1}) no-repeat`,
                            backgroundSize: "cover",
                            borderRadius: ".5rem",
                            backgroundPosition: "center",
                            height: "550px",
                          }}
                        >
                          <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                            <h2 className="text-dark display-6 fw-bold mt-4">
                              Vật liệu xây dựng <br /> chất lượng cao
                            </h2>
                            <p className="lead">
                              Cung cấp một loạt các vật liệu xây dựng với giá
                              cạnh tranh
                            </p>
                            <Link
                              to="#!"
                              className="btn mt-3 text-bg-warning border-0"
                            >
                              Mua ngay
                              <i className="feather-icon icon-arrow-right ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <div
                          style={{
                            background: `url(${slider2}) no-repeat`,
                            backgroundSize: "cover",
                            borderRadius: ".5rem",
                            backgroundPosition: "center",
                            height: "550px",
                          }}
                        >
                          <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                            <h2 className="text-dark display-6 fw-bold mt-4">
                              Giảm giá số lượng lớn
                              <br />
                            </h2>
                            <p className="lead text-white">
                              Giảm giá đặc biệt cho các đơn đặt hàng lớn. Lấy
                              Vật liệu xây dựng chất lượng cao ở mức giá tốt
                              nhất
                            </p>
                            <Link
                              to="#!"
                              className="btn mt-3 text-bg-warning border-0"
                            >
                              Mua ngay
                              <i className="feather-icon icon-arrow-right ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      className="carousel-control-prev"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Previous</span>
                    </Link>
                    <Link
                      className="carousel-control-next"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>
            <>
              {/* section */}
              <section className="mt-8">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 fade-in-left">
                      <Slide direction="left">
                        <div className="banner mb-3">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={adbanner1}
                              alt="ad-banner"
                              className="img-fluid rounded-3 w-100"
                              style={{ height: "250px", objectFit: "cover" }}
                            />
                            <div className="banner-text">
                              <h3 className="mb-0 fw-bold text-white">
                                Giảm giá 10%
                                <br />
                                Đặt hàng số lượng lớn
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Mua ngay
                                <i className="feather-icon icon-arrow-right ms-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 slide-in-top">
                      <Zoom>
                        <div className="banner mb-3">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={adbanner2}
                              alt="ad-banner-2"
                              className="img-fluid rounded-3 w-100"
                              style={{ height: "250px", objectFit: "cover" }}
                            />
                            <div className="banner-text">
                              {/* Banner Content */}
                              <h3 className="fw-bold mb-2 text-white">
                                Chất lượng cao cấp <br />
                                Thép & sắt
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Mua ngay
                                <i className="feather-icon icon-arrow-right ms-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>

                    <div className="col-lg-4 col-12 fade-in-left">
                      <Slide direction="right">
                        <div className="banner mb-3">
                          <div className="banner-img">
                            {/* Banner Image */}
                            <img
                              src={adbanner3}
                              alt="ad-banner-3"
                              className="img-fluid rounded-3 w-100"
                              style={{ height: "250px", objectFit: "cover" }}
                            />
                            {/* Banner Content */}
                            <div className="banner-text">
                              <h3 className="fs-2 fw-bold lh-1 mb-2 text-white">
                                Dịch vụ giao hàng
                                <br />
                                Đáng tin cậy
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Mua ngay
                                <i className="feather-icon icon-arrow-right ms-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>
            <>
              {/* section category parent */}
              <section className="my-lg-14 my-8">
                <div className="container ">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-6">
                        {/* heading    */}
                        <div className="section-head text-center">
                          <h3
                            className="h3style"
                            data-title="Shop Popular Categories"
                          >
                            Danh mục phổ biến
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row ">
                      <Swiper
                        slidesPerView={6} // Number of items visible at once
                        grid={{
                          rows: 2, // Display items in 2 rows
                          fill: "row",
                        }}
                        spaceBetween={20}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Grid]}
                        className="mySwiper"
                      >
                        {materials.map((material, index) => (
                          <SwiperSlide key={index}>
                            <div className="fade-zoom p-2">
                              <Zoom>
                                <div
                                  // onClick={() => {
                                  //   setparentCateID(material.id);
                                  //   setSelectSubCate(material.subCategories);
                                  // }}
                                  className="text-center mb-10"
                                >
                                  <Link to={`/Shop/${material.id}`}>
                                    <img
                                      src={material.src ? material.src : dfCate}
                                      alt={material.alt}
                                      className="card-image rounded-circle"
                                      style={{
                                        height: "150px",
                                        width: "150px",
                                      }}
                                    />
                                  </Link>
                                  <div className="mt-4">
                                    <h5 className="fs-6 mb-0">
                                      <Link to="#" className="text-inherit">
                                        {material.name}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </Zoom>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>

            <>
              <ProductItem />
            </>
            <>
              <section className="my-lg-14 my-8">
                <div className="container" style={{ marginTop: 50 }}>
                  <div
                    className="row justify-content-center  g-4"
                    style={{ textAlign: "center" }}
                  >
                    <div className="col-md-3 col-sm-12 fade-zoom ">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={refresh} alt="refresh" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Đổi trả dễ dàng</h3>
                              <p>
                                Không hài lòng với sản phẩm? Bạn có thể trả hàng
                                ngay tại nhà và nhận lại tiền trong vòng vài
                                giờ. Chính sách hoàn tiền không cần hỏi lý do.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={package1} alt="package" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Sản phẩm đa dạng</h3>
                              <p>
                                Lựa chọn từ hơn 5000 sản phẩm vật liệu xây dựng,
                                bao gồm xi măng, gạch, cát, thép, gỗ, kính và
                                nhiều loại vật liệu khác.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={gift} alt="gift" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">
                                Giá cả tốt nhất & Ưu đãi hấp dẫn
                              </h3>
                              <p>
                                Giá rẻ hơn so với siêu thị địa phương, cùng với
                                nhiều ưu đãi hoàn tiền hấp dẫn. Hãy tận hưởng
                                giá tốt nhất và các ưu đãi đặc biệt từ chúng
                                tôi!
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={clock} alt="clock" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Giao hàng nhanh chóng</h3>
                              <p>
                                Nhận đơn hàng vật liệu xây dựng của bạn được
                                giao tận nơi nhanh chóng. Mang đến cho bạn sự
                                tiện lợi và nhanh chóng trong mỗi lần mua sắm!
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                  </div>
                </div>
              </section>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
