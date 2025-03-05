// const express = require("express");
// const router = express.Router();
// const Auction = require("../models/auction"); // Ensure correct filename
// const authMiddleware = require("../middleware/authMiddleware"); // Ensure correct filename

// // Create a new auction
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { itemName, description, startingPrice, endTime } = req.body;

//         if (!itemName || !description || !startingPrice || !endTime) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Ensure endTime is in the future
//         if (new Date(endTime) <= new Date()) {
//             return res.status(400).json({ message: "Auction end time must be in the future" });
//         }

//         const newAuction = new Auction({
//             itemName,
//             description,
//             startingPrice,
//             highestBid: startingPrice,
//             endTime,
//             bids: [],
//         });

//         await newAuction.save();

//         res.status(201).json({
//             message: "Auction created successfully",
//             auction: newAuction,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // Get all auctions
// router.get("/", async (req, res) => {
//     try {
//         const auctions = await Auction.find();
//         res.status(200).json(auctions);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // Get a single auction by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const auction = await Auction.findById(req.params.id);
//         if (!auction) {
//             return res.status(404).json({ message: "Auction not found" });
//         }
//         res.status(200).json(auction);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // Place a bid on an auction
// // Place a bid on an auction
// router.post("/:id/bid", authMiddleware, async (req, res) => {
//     try {
//         const auctionId = req.params.id;
//         const { bidAmount } = req.body;
//         const userId = req.user.id;

//         if (!bidAmount || bidAmount <= 0) {
//             return res.status(400).json({ message: "Bid amount must be greater than zero" });
//         }

//         const auction = await Auction.findById(auctionId);
//         if (!auction) {
//             return res.status(404).json({ message: "Auction not found" });
//         }

//         // Get the current time and auction end time
//         const currentTime = new Date();
//         const auctionEndTime = new Date(auction.endTime);

//         // 🔴 Debugging: Log timestamps
//         console.log("🚀 DEBUGGING TIMESTAMPS:");
//         console.log("🔹 Current Time:", currentTime.toISOString());
//         console.log("🔹 Auction End Time:", auctionEndTime.toISOString());

//         // Compare timestamps properly
//         if (currentTime >= auctionEndTime) {
//             console.log("❌ Auction has ended (based on timestamp comparison).");
//             return res.status(400).json({ message: "Auction has ended" });
//         }

//         // Check if bid is higher than the current highest bid
//         if (bidAmount <= auction.highestBid) {
//             return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
//         }

//         // Update the highest bid
//         auction.highestBid = bidAmount;
//         auction.highestBidder = userId;
//         auction.bids.push({ user: userId, amount: bidAmount, timestamp: currentTime });

//         await auction.save();

//         console.log("✅ Bid placed successfully!");
//         res.status(200).json({ message: "Bid placed successfully", auction });
//     } catch (error) {
//         console.error("❌ Error placing bid:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const Auction = require("../models/auction"); // Ensure correct filename
const authMiddleware = require("../middleware/authMiddleware"); // Ensure correct filename

// Create a new auction
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { itemName, description, startingPrice, endTime } = req.body;

        if (!itemName || !description || !startingPrice || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure endTime is in the future
        if (new Date(endTime) <= new Date()) {
            return res.status(400).json({ message: "Auction end time must be in the future" });
        }

        const newAuction = new Auction({
            itemName,
            description,
            startingPrice,
            highestBid: startingPrice,
            endTime: new Date(endTime), // Ensure correct Date format
            bids: [],
        });

        await newAuction.save();

        res.status(201).json({
            message: "Auction created successfully",
            auction: newAuction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all auctions
router.get("/", async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get a single auction by ID
router.get("/:id", async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        res.status(200).json(auction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 🚀 Place a bid on an auction
router.post("/:id/bid", authMiddleware, async (req, res) => {
    try {
        const auctionId = req.params.id;
        const { bidAmount } = req.body;
        const userId = req.user.userId; // Ensure correct user ID extraction

        if (!bidAmount || bidAmount <= 0) {
            return res.status(400).json({ message: "Bid amount must be greater than zero" });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // 🌍 Convert both times to UTC for accurate comparison
        const currentTime = new Date().toISOString(); // Current time in UTC
        const auctionEndTime = new Date(auction.endTime).toISOString(); // Auction end time in UTC

        // 🔴 Debugging logs
        console.log("🚀 DEBUGGING TIMESTAMPS:");
        console.log("🔹 Current Time (UTC):", currentTime);
        console.log("🔹 Auction End Time (UTC):", auctionEndTime);

        // If auction has ended, prevent bidding
        if (currentTime >= auctionEndTime) {
            console.log("❌ Auction has ended.");
            return res.status(400).json({ message: "Auction has ended" });
        }

        // Check if bid is higher than the current highest bid
        if (bidAmount <= auction.highestBid) {
            return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
        }

        // Update the highest bid
        auction.highestBid = bidAmount;
        auction.highestBidder = userId;
        auction.bids.push({ user: userId, amount: bidAmount, bidTime: new Date() });

        await auction.save();

        console.log("✅ Bid placed successfully!");
        res.status(200).json({ message: "Bid placed successfully", auction });
    } catch (error) {
        console.error("❌ Error placing bid:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
