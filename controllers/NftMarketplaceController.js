const NftMarketplace = require('../models/NftMarketplace');

class NftMarketplaceController {
  static async getActiveItems(req, res, next) {
    try {
      const data = await NftMarketplace.getActiveItems();
      res.status(200).json(data.rows[0]);
    } catch (e) {
      console.log(e);
    }
  }

  static async getListedItems(req, res, next) {
    try {
      const data = await NftMarketplace.getListedItems();
      res.status(200).json(data.rows[0]);
    } catch (e) {
      console.log(e);
    }
  }

  static async insertItemListed(req, res, next) {
    try {
      const data = await NftMarketplace.insertItemListed(res.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemPrice(req, res, next) {
    try {
      const data = await NftMarketplace.updateItemPrice(res.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemSeller(req, res, next) {
    try {
      const data = await NftMarketplace.updateItemSeller(res.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async deleteActiveItem(req, res, next) {
    try {
      const data = await NftMarketplace.deleteActiveItem(res.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = NftMarketplaceController;