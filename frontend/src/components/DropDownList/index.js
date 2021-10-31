import React, { useState, useEffect } from "react";
// Styles
import { Wrapper, Header, Content } from "./DropDownList.styles";
//Hooks
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const ShowList = ({ list, selectItem }) => (
  <Content>
    {list.map((item) => (
      <div
        type="button"
        key={item.id}
        onClick={() => selectItem(item)}
        className={item.selected ? "item active" : "item"}
      >
        {item.title}
      </div>
    ))}
  </Content>
);

const DropDownList = ({ header = "", list = [], setSort }) => {
  const getItems = list.map((item, index) => ({
    id: index,
    selected: false,
    title: item,
  }));

  const [items, setItems] = useState(getItems);
  const [selItem, setSelItem] = useState(getItems[0].title);
  const [isOpen, setIsOpen] = useState(false);
  // const [title, setTitle] = useState(header === "" ? getItems[0] : header);
  const [title, setTitle] = useState(header === "" ? getItems[0].title : header);

  useEffect(() => {
    setSort(selItem);
  }, [setSort, selItem]);

  const toggleList = () => {
    setIsOpen((state) => !state);
  };

  const selectItem = (item) => {
    const { title, id } = item;

    setTitle(title);
    setIsOpen(!isOpen);
    setSelItem(title);

    setItems((state) => {
      state.forEach((ele) => (ele.selected = false));
      state[id].selected = true;
      return state;
    });
  };

  return (
    <Wrapper>
      <Header type="button" onClick={() => toggleList()}>
        <div className="title">{title}</div>
        <div className="arrow">
          {isOpen ? (
            <FontAwesomeIcon icon={faAngleUp} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} size="2x" />
          )}
        </div>
      </Header>
      {isOpen && <ShowList list={items} selectItem={selectItem} />}
    </Wrapper>
  );
};

export default DropDownList;
