import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Styles
import { Wrapper, Header, Content } from "./DropDownList.styles";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const List = ({ list, handleListClick }) => {
  return (
    <Content>
      {list.map((item) => (
        <div
          type="button"
          key={item.id}
          onClick={() => handleListClick(item)}
          className={item.selected ? "item active" : "item"}
        >
          {item.title}
        </div>
      ))}
    </Content>
  );
};

const DropDownList = ({ items = [], selected, itemType }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  // convert array to object list for classname allocation
  const list = items.map((item, i) => ({
    id: i,
    selected: item.value === selected ? true : false,
    title: item.title,
    value: item.value,
  }));

  if (!selected) list[0]["selected"] = true;

  const handleListClick = (item) => {
    const { value } = item;

    setIsOpen((state) => !state);
    navigate(`/${itemType}?sort=${value}`);
    // setSelected(value);

    // setList((state) =>
    //   state.map((item) => ({
    //     ...item,
    //     selected: item.value === value ? true : false,
    //   }))
    // );
  };

  return (
    <Wrapper>
      <Header type="button" onClick={() => setIsOpen((state) => !state)}>
        <div className="title">
          {(selected === null) | !selected
            ? list[0].title
            : list.filter((i) => i.value === selected)[0].title}
        </div>
        <div className="arrow">
          {isOpen ? (
            <FontAwesomeIcon icon={faAngleUp} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} size="2x" />
          )}
        </div>
      </Header>
      {isOpen && <List list={list} handleListClick={handleListClick} />}
    </Wrapper>
  );
};

export default DropDownList;
