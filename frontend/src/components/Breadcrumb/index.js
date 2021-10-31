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
            <div key={index}>
              <span>{crumb.title}</span>
              {index < listOfCrumbs.length - 1 && <span>|</span>}
            </div>
          );
        }

        return (
          <div key={index}>
            <Link to={crumb.url}>
              <span>{crumb.title}</span>
            </Link>
            {index < listOfCrumbs.length - 1 && <span>|</span>}
          </div>
        );
      })}
    </Content>
  </Wrapper>
);

export default BreadCrumb;
