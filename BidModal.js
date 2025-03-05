import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import api from "../utils/api";

const BidModal = ({ open, onClose, auctionId, currentBid, fetchAuctions }) => {
  const [bidAmount, setBidAmount] = useState("");

  const handleBid = async () => {
    if (!bidAmount || bidAmount <= currentBid) {
      alert("Bid amount must be higher than the current bid.");
      return;
    }

    try {
      await api.post(`/auctions/${auctionId}/bid`, { amount: bidAmount });
      alert("Bid placed successfully!");
      fetchAuctions(); // Refresh auctions after bidding
      onClose();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Place Your Bid</DialogTitle>
      <DialogContent>
        <TextField
          label="Bid Amount"
          type="number"
          fullWidth
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleBid} color="primary" variant="contained">Submit Bid</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BidModal;
