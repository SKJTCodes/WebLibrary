import React, { useState } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
// Styles
import { Btn, Wrapper, Label } from "./FormInputs/FormInput.styles";
import { SubBtn, Pill, GenreBar } from "./ModalUpdate/ModalUpdate.styles";
// Hooks
import { useUploadComic } from "../hooks/useUpload";
// Helper
import Helper from "../Helper";
// Components
import Spinner from "./Spinner";

const InputTb = ({ label, fields, setFields, addTag }) => (
  <Wrapper>
    <Label>
      {label !== "genre" && (
        <input
          type="text"
          required
          id={label}
          value={fields[label]}
          onChange={(e) =>
            setFields((state) => ({ ...state, [label]: e.target.value }))
          }
        />
      )}
      {label === "genre" && <input type="text" required id={label} />}
      <div className="label-text">{Helper.titleCase(label)}</div>
    </Label>
    {label === "genre" && (
      <SubBtn onClick={() => addTag(document.getElementById(label).value)}>
        <KeyboardArrowRightRoundedIcon
          fontSize="large"
          style={{ color: "var(--white)" }}
        />
      </SubBtn>
    )}
  </Wrapper>
);

const SubmitBtn = ({ text, action }) => (
  <Wrapper>
    <Btn onClick={action}>{text}</Btn>
  </Wrapper>
);

const UForm = ({ upload, setFields, fields, setFiles }) => {
  const addTag = (item) => {
    if (item !== "")
      setFields((state) => ({ ...state, genre: [...state.genre, item] }));
    document.getElementById("genre").value = "";
  };
  const removeTag = (index) => {
    setFields((state) => ({
      ...state,
      genre: state.genre.filter((_, i) => i !== index),
    }));
  };
  return (
    <div
      style={{
        padding: "25px",
        backgroundColor: "var(--darkGrey)",
        width: "100%",
        borderRadius: "15px",
      }}
    >
      {/* Title */}
      <InputTb label="title" fields={fields} setFields={setFields} />
      {/* Author */}
      <InputTb label="author" fields={fields} setFields={setFields} />
      {/* Chapter */}
      <InputTb label="chapter" fields={fields} setFields={setFields} />
      {/* Add Genre Textbox */}
      <InputTb
        label="genre"
        fields={fields}
        setFields={setFields}
        addTag={addTag}
      />
      {/* Genre Bar */}
      <GenreBar>
        {fields.genre.map((e, index) => (
          <Pill key={index} onClick={() => removeTag(index)}>
            {e}
          </Pill>
        ))}
      </GenreBar>
      {/* Upload Files */}
      <Wrapper style={{ color: "var(--white)" }}>
        <div>{"Files"}</div>
        <input
          type="file"
          id="file"
          onChange={(e) => {
            setFiles(e.target.files);
          }}
          multiple
        />
      </Wrapper>
      {/* Submit Button */}
      <SubmitBtn text="Upload" action={() => upload()} />
    </div>
  );
};

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [fields, setFields] = useState({
    title: "",
    author: "",
    chapter: "",
    genre: [],
  });

  const { error, loading, progress, setFd, setIsInitial } = useUploadComic();

  const upload = () => {
    const fd = new FormData();

    // add info to form data
    for (const key in fields) {
      fd.append(key, fields[key]);
    }

    // add files to form data
    for (let i = 0; i < files.length; i++)
      fd.append("image", files[i], files[i].name);

    // Upload by using use Hook
    setFd(fd);
    setIsInitial(false);
  };

  if (error) return <div>Error in Process ...</div>;

  return (
    <>
      <div className="container">
        <div
          style={{
            color: "var(--white)",
            fontSize: "var(--fontSuperBig)",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <b>Upload</b>
        </div>
        {loading && <Spinner />}
        <UForm
          upload={upload}
          setFields={setFields}
          fields={fields}
          setFiles={setFiles}
        />
        <div>{progress * 100} / 100</div>
      </div>
    </>
  );
};

export default UploadPage;
