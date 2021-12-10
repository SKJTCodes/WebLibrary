import React from "react";
import { useNavigate } from "react-router-dom";
// Styles
import { Image, Wrapper } from "./Thumb.styles";

const Link = ({ children, to, cb }) => (
  <span
    onClick={() => cb(to)}
    style={{ color: "var(--white)", cursor: "pointer" }}
  >
    {children}
  </span>
);

const Thumb = ({
  image,
  itemId,
  clickable,
  title,
  type,
  disable,
  pageHist = null,
  sortHist = null,
  cb = null,
}) => {
  const nav = useNavigate();

  if ((cb === null) | !cb) {
    cb = (to) => {
      nav(to);
    };
  }

  return (
    <Wrapper className={disable ? "disable" : ""}>
      {clickable ? (
        <Link
          to={
            pageHist !== null & sortHist !== null
              ? `/${type}/${itemId}?pageHist=${pageHist}&sortHist=${sortHist}`
              : `/${type}/${itemId}`
          }
          cb={cb}
        >
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
};

export default Thumb;
