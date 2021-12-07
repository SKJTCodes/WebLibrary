import React from "react";
// Styles
import { Button, Span } from "./Badges.styles";

const Badge = ({ text, num, cb }) => (
  <Button type="button" className="btn" onClick={cb}>
    {text} <Span className="badge">{num}</Span>
  </Button>
);

export default Badge;
