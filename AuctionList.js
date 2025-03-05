import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Card, CardContent, Typography, Button } from "@mui/material";
import BidModal from "./BidModal";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuctions = async () => {
    try {
      const response = await api.get("/auctions");
      setAuctions(response.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const openBidModal = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", padding: "20px" }}>
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <Card key={auction._id} style={{ maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6">{auction.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Current Bid: ${auction.currentBid}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ends on: {new Date(auction.endTime).toLocaleString()}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                style={{ marginTop: 10 }}
                onClick={() => openBidModal(auction)}
              >
                Place Bid
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No auctions available.</Typography>
      )}

      {selectedAuction && (
        <BidModal 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          auctionId={selectedAuction._id} 
          currentBid={selectedAuction.currentBid} 
          fetchAuctions={fetchAuctions}
        />
      )}
    </div>
  );
};

export default AuctionList;
