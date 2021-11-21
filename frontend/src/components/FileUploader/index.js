import React from "react";
import { useDropzone } from "react-dropzone";
// Styles
import { Wrapper, Label, ImgContent } from "./FileUploader.styles";
// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// Components
import Grid from "../Grid";

const FileUploader = ({files, setFiles}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  console.log(files);
  return (
    <Wrapper {...getRootProps()} onClick={open}>
      <input {...getInputProps()} />
      {files.length === 0 && (
        <Label>
          <div className="label-text">
            Drag and drop an image file here or click
          </div>
          <CloudUploadIcon style={{ color: "var(--white)" }} fontSize="large" />
        </Label>
      )}
      {files.length > 0 && (
        <ImgContent>
          <Grid noPadding>
            {files.map((file) => (
              <div key={file.preview} style={{ padding: "0px" }} className="image">
                {file.name}
                {/* <img src={file.preview} alt="preview" style={{width: "100%"}}/> */}
              </div>
            ))}
          </Grid>
        </ImgContent>
      )}
    </Wrapper>
  );
};

export default FileUploader;
