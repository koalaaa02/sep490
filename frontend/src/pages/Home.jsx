import slider1 from "../images/banner_1.jpg";
import slider2 from "../images/banner_2.jpg";
import adbanner1 from "../images/adbanner1.jpg";
import adbanner2 from "../images/adbanner2.jpg";
import adbanner3 from "../images/adbanner3.jpg";
import cement from "../images/cement.jpg";
import bricks from "../images/bricks.jpg";
import sand from "../images/sand.jpg";
import steel from "../images/steel.jpg";
import tiles from "../images/tiles.png";
import wood from "../images/wood.jpg";
import glass from "../images/glass.jpg";
import paint from "../images/paint.jpg";
import plumbing from "../images/plumbing.jpg";
import electrical from "../images/electrical.jpg";
import roofing from "../images/roofing.jpg";
import insulation from "../images/insulation.jpg";
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
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  const materials = [
    { src: cement, alt: "cement", label: "Cement" },
    { src: bricks, alt: "bricks", label: "Bricks" },
    { src: sand, alt: "sand", label: "Sand" },
    { src: steel, alt: "steel", label: "Steel" },
    { src: tiles, alt: "tiles", label: "Tiles" },
    { src: wood, alt: "wood", label: "Wood" },
    { src: glass, alt: "glass", label: "Glass" },
    { src: paint, alt: "paint", label: "Paint" },
    { src: plumbing, alt: "plumbing", label: "Plumbing" },
    { src: electrical, alt: "electrical", label: "Electrical" },
    { src: roofing, alt: "roofing", label: "Roofing" },
    { src: insulation, alt: "insulation", label: "Insulation" },
  ];

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
                              High-Quality <br /> Construction Materials
                            </h2>
                            <p className="lead">
                              Providing a wide range of construction materials
                              at competitive prices with fast delivery.
                            </p>
                            <Link
                              to="#!"
                              className="btn mt-3 text-bg-warning border-0"
                            >
                              Shop Now
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
                              Bulk Discounts
                              <br />
                            </h2>
                            <p className="lead text-white">
                              Special discounts for large orders. Get
                              high-quality construction materials at the best
                              prices.
                            </p>
                            <Link
                              to="#!"
                              className="btn mt-3 text-bg-warning border-0"
                            >
                              Shop Now
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
                                10% Discount on <br />
                                Bulk Cement Orders
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Shop Now
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
                                Premium Quality <br />
                                Steel & Iron
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Shop Now
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
                                Fast & Reliable <br />
                                Delivery Service
                              </h3>
                              <div className="mt-4 mb-5 fs-5 text-white">
                                <br />
                              </div>
                              <Link
                                to="#!"
                                className="btn text-bg-warning border-0"
                              >
                                Shop Now
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
              {/* section category */}
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
                            Popular Categories
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                          {/* <p>Connecting with entrepreneurs online, is just a few clicks away.</p> */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {materials.map((material, index) => (
                        <div
                          key={index}
                          className="col-lg-2 col-md-4 col-6 fade-zoom"
                        >
                          <Zoom>
                            <div className="text-center mb-10">
                              <Link to="#">
                                <img
                                  src={material.src}
                                  alt={material.alt}
                                  className="card-image rounded-circle"
                                  style={{ height: "200px", width: "200px" }}
                                />
                              </Link>
                              <div className="mt-4">
                                <h5 className="fs-6 mb-0">
                                  <Link to="#" className="text-inherit">
                                    {material.label}
                                  </Link>
                                </h5>
                              </div>
                            </div>
                          </Zoom>
                        </div>
                      ))}
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
                              <h3 className="h5 mb-3">Easy Returns</h3>
                              <p>
                                Not satisfied with a product? Return it at the
                                doorstep &amp; get a refund within hours. No
                                questions asked
                                <Link to="#!">policy</Link>.
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
                              <h3 className="h5 mb-3">Wide Assortment</h3>
                              <p>
                                Choose from 5000+ products across food, personal
                                care, household, bakery, veg and non-veg &amp;
                                other categories.
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
                                Best Prices &amp; Offers
                              </h3>
                              <p>
                                Cheaper prices than your local supermarket,
                                great cashback offers to top it off. Get best
                                pricess &amp; offers.
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
                              <h3 className="h5 mb-3">10 minute grocery now</h3>
                              <p>
                                Get your order delivered to your doorstep at the
                                earliest from FreshCart pickup
                                <p> stores near you.</p>
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
