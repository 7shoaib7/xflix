import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useSnackbar } from "notistack";
import Thumb from "./Thumb";
import { errorMessage, uploadVideo } from "../api";
import { AGE_GROUPS, GENRES, embedLink, thumbnailFor, youtubeId } from "../utils";
import "./UploadDialog.css";

const EMPTY = { link: "", previewImage: "", title: "", genre: "", contentRating: "", releaseDate: "" };
const today = () => new Date().toISOString().slice(0, 10);

const ChoiceGroup = ({ legend, name, options, value, onChange, error, showError }) => (
  <fieldset className="upload-field" aria-describedby={showError && error ? `${name}-error` : undefined}>
    <legend className="upload-label">{legend}</legend>
    <div className="choice-row">
      {options.map((option) => (
        <label key={option} className={`choice ${value === option ? "is-active" : ""}`}>
          <input
            type="radio"
            className="sr-only"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
    {showError && error && (
      <span id={`${name}-error`} className="upload-error">
        {error}
      </span>
    )}
  </fieldset>
);

const UploadDialog = ({ open, onClose, onUploaded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const fullScreen = useMediaQuery("(max-width:700px)");
  const [form, setForm] = useState(EMPTY);
  const [thumbEdited, setThumbEdited] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const videoId = youtubeId(form.link);
  const previewImage = thumbEdited ? form.previewImage.trim() : videoId ? thumbnailFor(videoId) : "";

  const errors = {
    link: !form.link.trim()
      ? "Paste a YouTube link."
      : !videoId
      ? "That doesn't look like a YouTube video link."
      : "",
    previewImage: !previewImage ? "Add a thumbnail image URL." : "",
    title: !form.title.trim() ? "Add a title." : "",
    genre: !form.genre ? "Pick a genre." : "",
    contentRating: !form.contentRating ? "Pick an age group." : "",
    releaseDate: !form.releaseDate ? "Pick the release date." : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const update = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const fromInput = (key) => (event) => update(key)(event.target.value);

  const reset = () => {
    setForm(EMPTY);
    setThumbEdited(false);
    setShowErrors(false);
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);
    if (hasErrors) return;
    setSubmitting(true);
    try {
      await uploadVideo({
        videoLink: embedLink(videoId),
        previewImage,
        title: form.title.trim(),
        genre: form.genre,
        contentRating: form.contentRating,
        releaseDate: form.releaseDate,
      });
      enqueueSnackbar("Video uploaded", { variant: "success" });
      reset();
      onClose();
      if (onUploaded) onUploaded();
    } catch (e) {
      enqueueSnackbar(errorMessage(e), { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (key) =>
    showErrors && errors[key] ? (
      <span id={`${key}-error`} className="upload-error">
        {errors[key]}
      </span>
    ) : null;
  const describedBy = (key) => (showErrors && errors[key] ? `${key}-error` : `${key}-help`);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      aria-labelledby="upload-title"
      PaperProps={{ className: "upload-paper" }}
    >
      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <div className="upload-head">
          <div>
            <h2 id="upload-title" className="upload-title">
              Upload a video
            </h2>
            <p className="upload-sub">Paste any YouTube link and fill in the details.</p>
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={handleClose}>
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        <div className="upload-body">
          <div className="upload-fields">
            <div className="upload-field">
              <label htmlFor="up-link" className="upload-label">
                YouTube link
              </label>
              <input
                id="up-link"
                className={`upload-input ${showErrors && errors.link ? "is-invalid" : ""}`}
                placeholder="https://www.youtube.com/watch?v=…"
                value={form.link}
                onChange={fromInput("link")}
                aria-invalid={Boolean(showErrors && errors.link)}
                aria-describedby={describedBy("link")}
                inputMode="url"
              />
              {fieldError("link") || (
                <span id="link-help" className={videoId ? "upload-ok" : "upload-help"}>
                  {videoId ? "YouTube video found" : "Watch, share, embed and Shorts links all work."}
                </span>
              )}
            </div>

            <div className="upload-field">
              <label htmlFor="up-thumb" className="upload-label">
                Thumbnail image URL
              </label>
              <input
                id="up-thumb"
                className={`upload-input ${showErrors && errors.previewImage ? "is-invalid" : ""}`}
                placeholder="Filled in from the YouTube link"
                value={thumbEdited ? form.previewImage : previewImage}
                onChange={(event) => {
                  setThumbEdited(true);
                  update("previewImage")(event.target.value);
                }}
                aria-invalid={Boolean(showErrors && errors.previewImage)}
                aria-describedby={describedBy("previewImage")}
                inputMode="url"
              />
              {fieldError("previewImage") || (
                <span id="previewImage-help" className="upload-help">
                  Shown on cards across XFlix. Change it to use your own image.
                </span>
              )}
            </div>

            <div className="upload-field">
              <label htmlFor="up-title" className="upload-label">
                Title
              </label>
              <input
                id="up-title"
                className={`upload-input ${showErrors && errors.title ? "is-invalid" : ""}`}
                value={form.title}
                onChange={fromInput("title")}
                maxLength={120}
                aria-invalid={Boolean(showErrors && errors.title)}
                aria-describedby={describedBy("title")}
              />
              {fieldError("title") || <span id="title-help" className="sr-only">Required</span>}
            </div>

            <ChoiceGroup
              legend="Genre"
              name="genre"
              options={GENRES}
              value={form.genre}
              onChange={update("genre")}
              error={errors.genre}
              showError={showErrors}
            />

            <div className="upload-split">
              <ChoiceGroup
                legend="Age group"
                name="contentRating"
                options={AGE_GROUPS}
                value={form.contentRating}
                onChange={update("contentRating")}
                error={errors.contentRating}
                showError={showErrors}
              />
              <div className="upload-field">
                <label htmlFor="up-date" className="upload-label">
                  Release date
                </label>
                <input
                  id="up-date"
                  type="date"
                  max={today()}
                  className={`upload-input ${showErrors && errors.releaseDate ? "is-invalid" : ""}`}
                  value={form.releaseDate}
                  onChange={fromInput("releaseDate")}
                  aria-invalid={Boolean(showErrors && errors.releaseDate)}
                  aria-describedby={describedBy("releaseDate")}
                />
                {fieldError("releaseDate") || (
                  <span id="releaseDate-help" className="sr-only">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="upload-preview" aria-live="polite">
            <span className="upload-preview-label">Preview</span>
            <div className="upload-preview-card">
              <span className="video-card-media">
                <Thumb title={form.title || "Your video"} sources={[previewImage].filter(Boolean)} />
                {form.contentRating && <span className="video-card-badge">{form.contentRating}</span>}
              </span>
              <span className="video-card-title">{form.title.trim() || "Your video title"}</span>
              <span className="video-card-meta">
                {form.genre || "Genre"} · 0 views · just now
              </span>
            </div>
            <p className="upload-preview-note">This is how your video will appear in the grid.</p>
          </div>
        </div>

        <div className="upload-foot">
          <button id="upload-btn-cancel" type="button" className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>
          <button id="upload-btn-submit" type="submit" className="btn btn-accent" disabled={submitting}>
            <FileUploadOutlinedIcon fontSize="small" aria-hidden="true" />
            {submitting ? "Uploading…" : "Upload video"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UploadDialog;
