import React from "react";
// Styles
import { Btn, Wrapper, Label } from "./FormInput.styles";

export const Textbox = ({ label, setValue, value }) => (
  <Wrapper>
    <Label>
      {setValue && (
        <input
          type="text"
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      )}
      {!setValue && <input type="text" required />}
      <div className="label-text">{label}</div>
    </Label>
  </Wrapper>
);

export const Button = ({ text, action=() => {} }) => (
  <Wrapper>
    <Btn onClick={() => action()} type="submit">
      {text}
    </Btn>
  </Wrapper>
);
