import React from "react";
import { Link } from "react-router-dom";
// Styles
import { Wrapper, Text, Content, Image, Pill } from "./InfoBar.styles";
// Helper
import Helper from "../../Helper";

const Cover = ({ image_path }) => (
  <Image>
    <img
      src={`${process.env.REACT_APP_DOMAIN}${image_path}`}
      alt="comic-cover"
    />
  </Image>
);

const InfoBar = ({ item }) => {
  return (
    <Wrapper backdrop={item.cover_path}>
      <div className="transparent">
        <Content>
          <Cover image_path={item.cover_path} />
          <Text>
            <h1>{Helper.titleCase(item.title)}</h1>
            <h3>DESCRIPTION</h3>
            <p>{item.description}</p>
            <h3>AUTHOR</h3>
            <Link to={`/cs/${item.author}`}>
              <span className="author">{Helper.titleCase(item.author)}</span>
            </Link>
            <h3>GENRE</h3>
            {item.genre.map((genre) => (
              <Link key={genre} to={`/cs/${genre}`}>
                <Pill>{`${genre}`}</Pill>
              </Link>
            ))}
          </Text>
        </Content>
      </div>
    </Wrapper>
  );
};

export default InfoBar;
