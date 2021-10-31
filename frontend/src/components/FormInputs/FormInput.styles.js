import styled from "styled-components";

const transSmall = "-30px";
const transBig = "-50px";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const Label = styled.label`
  display: block;
  letter-spacing: 4px;
  padding-top: 15px;
  text-align: center;

  .label-text {
    color: var(--lightGrey);
    cursor: text;
    font-size: var(--fontMed);
    line-height: 20px;
    text-transform: uppercase;
    transition: all 0.3s;

    -moz-transform: translateY(${transSmall});
    -ms-transform: translateY(${transSmall});
    -webkit-transform: translateY(${transSmall});
    transform: translateY(${transSmall});
  }

  input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid var(--medGrey);
    color: var(--white);
    font-size: var(--fontSmall);
    letter-spacing: -1px;
    outline: 0px;
    padding: 5px 20px;
    text-align: center;
    transition: all 0.3s;
    width: 200px;
  }

  input:focus + .label-text {
    color: var(--white);
    font-size: var(--fontTiny);

    -moz-transform: translateY(${transBig});
    -ms-transform: translateY(${transBig});
    -webkit-transform: translateY(${transBig});
    transform: translateY(${transBig});
  }

  input:focus {
    width: 300px;
  }

  input:valid + .label-text {
    font-size: 13px;

    -moz-transform: translateY(${transBig});
    -ms-transform: translateY(${transBig});
    -webkit-transform: translateY(${transBig});
    transform: translateY(${transBig});
  }
`;

export const Btn = styled.button`
  background-color: var(--darkGrey);
  border: 2px solid var(--white);
  border-radius: 43px;
  color: var(--white);
  cursor: pointer;
  font-size: var(--fontSmall);
  margin-top: 10px;
  padding: 15px 30px;
  text-transform: uppercase;
  transition: all 200ms;

  :hover,
  :focus {
    background-color: var(--white);
    color: var(--darkGrey);
    outline: 0;
  }
`;
