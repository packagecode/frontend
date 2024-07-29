import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FormGroup, FormLabel } from "react-bootstrap";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(FilePondPluginImagePreview);

interface FileUploadProps {
  label?: string;
  id?: string;
  files: File[];
  multiple?: boolean;
  accept?: string;
  feedback?: string | null;
  maxFiles?: number | null;
  onUploadedFiles: (files: File[]) => Promise<void>;
  oninit?: () => void;
}

// image/*: All image files.
// audio/*: All audio files.
// video/*: All video files.
// .doc,.docx: DOC and DOCX files.
// application/pdf: PDF files.
// application/msword: Microsoft Word files.
// application/vnd.ms-excel: Microsoft Excel files.
// application/zip: ZIP files.
// text/csv: CSV files.
// text/html: HTML files.
// text/plain: Text files.
// application/json: JSON files.
// application/javascript: JavaScript files.
// application/xml: XML files.

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  files = [],
  multiple = false,
  onUploadedFiles,
  accept = "",
  feedback,
  maxFiles = null,
  oninit
}) => {
  const [currentFiles, setCurrentFiles] = useState<File[]>(files);
  const [error, setError] = useState<string | null>(null);
  const acceptTypes = accept.split(",");

  useEffect(() => {
    setCurrentFiles(files);
    if (files.length > 0) setError(null);
  }, [files]);

  useEffect(() => {
    setError(feedback ?? null);
  }, [feedback]);

  const handleFileSubmit = (fileItems: any[]) => {
    const uploadedFiles = fileItems.map(fileItem => fileItem.file);
    const invalidFiles = uploadedFiles.filter(
      file => !acceptTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      const mimeTypes = acceptTypes
        .map(mimeType => mimeType.split("/")[1])
        .join(", ");
      setError(`Only ${mimeTypes} files are allowed!`);
      if (multiple) {
        const validFiles = uploadedFiles.filter(file =>
          acceptTypes.includes(file.type)
        );
        setCurrentFiles(validFiles);
        onUploadedFiles(validFiles);
      } else {
        setCurrentFiles([]);
        onUploadedFiles([]);
      }
    } else {
      setCurrentFiles(uploadedFiles);
      onUploadedFiles(uploadedFiles);
    }
  };

  const debouncedHandleFileSubmit = useMemo(
    () => debounce(handleFileSubmit, 300),
    []
  );

  const handleInit = () => {
    if (oninit) oninit();
  };

  return (
    <FormGroup>
      {label && <FormLabel>{label}</FormLabel>}
      <FilePond
        id={id}
        files={currentFiles}
        allowMultiple={multiple}
        allowPaste={true}
        onupdatefiles={debouncedHandleFileSubmit}
        maxFiles={maxFiles}
        acceptedFileTypes={acceptTypes}
        oninit={handleInit}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      {error && <div className="text-danger">{error}</div>}
    </FormGroup>
  );
};

export default FileUpload;
