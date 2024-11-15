import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./aboutus.css"; // Import the CSS file for styling

// Import PNG images
import member1Image from "../AboutUs/matayascs.png";
import member2Image from "../AboutUs/libancs.png";

const AboutUs = () => {
  return (
    <div className="container-fluid">
      {/* Page Banner */}
      <div className="page-banner rounded shadow">
        <div className="banner-heading">
          <h2>About Team 130</h2>
        </div>
        <div className="banner-content">
          <h3 className="mission-heading">Our Mission</h3>
          <p className="mission-text">
            Our mission at Student Marketplace is to establish a vibrant and
            centralized hub tailored specifically for Iowa State Students. With
            a focus on creativity and entrepreneurship, we aim to empower
            students by providing a dedicated platform for buying and selling
            their creations. By bridging the gap between supply and demand, our
            goal is to foster a dynamic community where students can showcase
            their talents, connect with like-minded individuals, and thrive in
            an environment conducive to innovation and collaboration. Through
            our initiative, we seek to address the current lack of a centralized
            marketplace, streamline the buying and selling process, and amplify
            the visibility of student products. Together, we envision a future
            where the Student Marketplace serves as the go-to destination for
            Iowa State Students, unlocking endless opportunities for growth,
            discovery, and success.
          </p>
        </div>
      </div>

      {/* First Team Member */}
      <div className="row team-member-container">
        <div className="col-lg-6">
          <div className="member-container">
            <div className="member-photo-card rounded shadow">
              <img
                src={member1Image}
                alt="Team Member 1"
                className="member-photo"
              />
            </div>
            <div className="member-details-container">
              <div className="team-member-details border rounded shadow p-3">
                <h3 className="member-name">Matayas Durr</h3>
                <p>
                  Full Name: Matayas Durr <br />
                  Email: md02@iastate.edu
                </p>
                <p>
                  Course Number: CS319 <br />
                  Course Name: Construction of User Interfaces <br />
                  Date: April 27th, 2024 <br />
                  Professor: Abraham Aldaco & Dr. Ali Jannesari
                </p>
                <p>
                  I developed the frontend of our website, ensuring seamless
                  integration with our backend CRUD operations. This involved
                  creating all the necessary pages, including Catalog, Add
                  Product, Update Product, Delete Product, and About Us. Each
                  page was meticulously designed and implemented to provide a
                  user-friendly experience while seamlessly interacting with the
                  backend for data management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Team Member */}
        <div className="col-lg-6">
          <div className="member-container">
            <div className="member-photo-card rounded shadow">
              <img
                src={member2Image}
                alt="Team Member 2"
                className="member-photo"
              />
            </div>
            <div className="member-details-container">
              <div className="team-member-details border rounded shadow p-3">
                <h3 className="member-name">Liban Ahmed</h3>
                <p>
                  Full Name: Liban Ahmed <br />
                  Email: lahmed@iastate.edu
                </p>
                <p>
                  Course Number: CS319 <br />
                  Course Name: Construction of User Interfaces <br />
                  Date: April 27th, 2024 <br />
                  Professor: Abraham Aldaco & Dr. Ali Jannesari
                </p>
                <p>
                  I implemented CRUD operations (GET, POST, PUT, DELETE) to
                  ensure seamless data management and functionality within our
                  application. This involved setting up endpoints to handle
                  various requests and ensure smooth interaction with the
                  backend server. Additionally, I ensured that each operation
                  was properly tested and integrated to guarantee robust
                  functionality throughout the development process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
