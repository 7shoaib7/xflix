import { 
    // Avatar, 
    // Button, 
    // Stack, 
    // Grid,
      Button,
    InputAdornment,
    TextField,} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { Search } from "@mui/icons-material";
// import { Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React, { useState }  from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import XFlixLogo from "./XFlix.svg";
import UploadForm from "./UploadForm";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";

const Header = ({children , fetchVideos, genres, contentRatings }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleOpen = () => {
      setIsModalOpen(true);
    };
  
    const handleClose = () => {
      setIsModalOpen(false);
    };
  
 
  return (
    <>
     <Dialog
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
      >
        <Grid container className="dialog">
         
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <h3 className="form-header">Upload Video</h3>

            <IconButton
              aria-label="close"
              className={"close-button"}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid item xs={12}>
            <UploadForm
              onClose={handleClose}
              fetchVideos={fetchVideos}
              genres={genres}
              contentRatings={contentRatings}
            />
          </Grid>
        </Grid>
      </Dialog>
       

       <Box display="flex" 
           flexWrap="wrap"
           justifyContent="space-between" 
           alignItems="center" 
        sx={{paddingX:"1rem"}}
       >
          <Box className="header-title" marginTop="1rem">
          <Link to="/"><img src={XFlixLogo} alt="XFlix-icon"/></Link>   
           </Box>
          

          {/* /**Search Box */ }
           <Box className="search-box" marginTop="1rem">
              {children}
           </Box>
          
          
           <Box className="header-action" marginTop="1rem">
              <Button
                 id="upload-btn"
                startIcon={<UploadIcon />}
                variant="contained"
                onClick={handleOpen}
                >
                  Upload
              </Button>
            </Box>  
       </Box>
    </>
       );
}


export default Header;



          // <TextField
          //     className="search-desktop"
          //     size="medium"
          //     InputProps={{
          //       className:"search",
          //       endAdornment: (
          //         <InputAdornment position="end">
          //           <Search color="primary" />
          //         </InputAdornment>
          //       ),
          //     }}
          //     placeholder="Search for items/categories"
          //     name="search"
          //   //   onChange={(event)=> debounceSearch(event,500)}
          //   /> 