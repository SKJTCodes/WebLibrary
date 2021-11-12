import React from "react";
import { Link } from "react-router-dom";
// Styles
import { Image, Wrapper } from "./Thumb.styles";

const Thumb = ({ image, itemId, clickable, title, type, disable }) => (
  <Wrapper className={disable ? "disable" : ""}>
    {clickable ? (
      <Link to={`/${type}/${itemId}`}>
        <div className="top">
          {image && <Image src={image} alt="item-thumb" />}
        </div>
        <div className="bottom">{title}</div>
      </Link>
    ) : (
      <>
        <div className="top">
          {image && <Image src={image} alt="item-thumb" />}
        </div>
        <div className="bottom">{title}</div>
      </>
    )}
  </Wrapper>
);

export default Thumb;
