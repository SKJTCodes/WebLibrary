// Styles
import { Wrapper } from "./FloatingButton.styles";
// Hooks
import { Fab } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FloatingButton = ({ callback, type = "edit" }) => {
  return (
    <Wrapper>
      <Fab
        color={type === "delete" ? "primary" : ""}
        size="medium"
        onClick={callback}
      >
        {type === "delete" && <DeleteIcon />}
        {type === "edit" && <EditIcon />}
      </Fab>
    </Wrapper>
  );
};

export default FloatingButton;
