import React from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import Footer from "../components/Footer";

const PageNotFound = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate("/");
  };
  return (
    <>
    <div id='content' style={{marginTop:"150px", marginBottom:"100px"}}>
        <Result
          status='404'
          title='404'
          subTitle={`Sorry the page you visited does not exist.`}
          extra={
            <Button type='primary' onClick={backHome}>
              Back Home
            </Button>
          }
        />
    </div>
    <Footer/>
    </>
  );
};

export default PageNotFound;
