import React from "react";
import { Container, Typography } from "@mui/material";
import AuctionList from "./components/AuctionList"; // Importing the Auction List

function App() {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Auction Game 🎉
      </Typography>
      <AuctionList />
    </Container>
  );
}

export default App;
