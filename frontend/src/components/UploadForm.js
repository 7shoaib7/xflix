import React, { useState } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Box, Stack, TextField } from "@mui/material";
import { config } from "../App";
import axios from "axios";
import { useSnackbar } from "notistack";
import "./UploadForm.css";

const UploadForm = ({ genres, contentRatings, onClose, fetchVideos }) => {
  const { enqueueSnackbar } = useSnackbar();

  const initialState = {
    videoLink: "",
    title: "",
    previewImage: "",
    genre: "",
    contentRating: "",
    releaseDate: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData({ ...formData, [key]: value });
  };

  const getDate = (value) => {
    const date = new Date(value);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  };

  const handleSubmit = async () => {
    if (!validateInput(formData)) return;

    const postData = {
      ...formData,
      releaseDate: getDate(formData.releaseDate),
    };

    try {
      const req = await axios.post(`${config.endpoint}/videos`, postData);
      console.log(req.data);
      if (req.status === 201) {
        console.log("POST Request made with", postData);
        enqueueSnackbar("Video Uploaded Successfully", { variant: "success" });
        // await fetchVideos();
        setFormData(initialState);
        onClose();
      }
    } catch (e) {
      if (e && e.response && e.response.data) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };

  const validateInput = (data) => {
    let validData = { ...data };

    if (!validData.videoLink) {
      enqueueSnackbar("Video link is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.title) {
      enqueueSnackbar("Title is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.genre) {
      enqueueSnackbar("Genre is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.contentRating) {
      enqueueSnackbar("Age group is required!", {
        variant: "warning",
      });
      return false;
    }
    if (!validData.releaseDate) {
      enqueueSnackbar("Upload and Publish date is required!", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          required
          className="form-element"
          variant="outlined"
          label="Video Link"
          helperText="This link will be used to derive the video"
          fullWidth
          name="videoLink"
          value={formData.videoLink}
          onChange={handleInputChange}
        />
        <TextField
          required
          className="form-element"
          variant="outlined"
          label="Thumbnail Image"
          helperText="This link will be used to derive the video"
          fullWidth
          name="previewImage"
          value={formData.previewImage}
          onChange={handleInputChange}
        />
        <TextField
          required
          className="form-element"
          variant="outlined"
          label="Title"
          helperText="This link will be used to derive the video"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextField
          select
          required
          className="select-input form-element"
          label="Genre"
          helperText="Genre will help in categorizing your videos"
          name="genre"
          value={formData.genre}
          onChange={handleInputChange}
        >
          {genres
            .filter((option) => option.value !== "All")
            .map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          select
          required
          className="select-input form-element"
          label="Suitable age group for the clip"
          helperText="This will be used to filter videos on age group suitability"
          name="contentRating"
          value={formData.contentRating}
          onChange={handleInputChange}
        >
          {contentRatings.map((option) => (
            <MenuItem key={option.value} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          className="form-element"
          label="Release Date"
          name="releaseDate"
          helperText="This will be used to sort videos"
          onChange={handleInputChange}
          value={formData.releaseDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
      <Stack direction="row" py="1rem" spacing={2}>
        <Button
          id="upload-btn-submit"
          variant="contained"
          onClick={handleSubmit}
          color="primary"
        >
          Upload Video
        </Button>
        <Button
          id="upload-btn-cancel"
          variant="text"
          color="error"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default UploadForm;
