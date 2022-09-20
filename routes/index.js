const express = require('express');
const router = express.Router();
const nftMarketplaceRoutes = require('./nftMarketplace');

router.use('/', nftMarketplaceRoutes);

module.exports = router;