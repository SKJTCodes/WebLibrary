import React from "react";
import { Link } from "react-router-dom";
// Styles
import { Wrapper, Content } from "./Breadcrumb.styles";

const BreadCrumb = ({ listOfCrumbs }) => (
  <Wrapper>
    <Content>
      {listOfCrumbs.map((crumb, index) => {
        if (!crumb.url) {
          return (
            <div key={index} style={{ padding: "0px 0px 0px 0px" }}>
              <div className="value">{crumb.title}</div>
              {index < listOfCrumbs.length - 1 && <div className="sep">|</div>}
            </div>
          );
        }

        return (
          <div key={index} style={{ padding: "0px 0px 0px 0px" }}>
            <Link to={crumb.url}>
              <div className="value">{crumb.title}</div>
            </Link>
            {index < listOfCrumbs.length - 1 && <div className="sep">|</div>}
          </div>
        );
      })}
    </Content>
  </Wrapper>
);

export default BreadCrumb;
