const express = require('express');
const router = express.Router();
const NftMarketplaceController = require('../controllers/NftMarketplaceController');

router.get('/getActiveItems', NftMarketplaceController.getActiveItems);
router.get('/getListedItems', NftMarketplaceController.getListedItems);
router.post('/insertItemListed', NftMarketplaceController.insertItemListed);
router.put('/updateItemPrice', NftMarketplaceController.updateItemPrice);
router.put('/updateItemSeller', NftMarketplaceController.updateItemSeller);
router.delete('/deleteActiveItem', NftMarketplaceController.deleteActiveItem);

module.exports = router;
