const NftMarketplace = require('../models/NftMarketplace');

class NftMarketplaceController {
  static async getActiveItems(req, res, next) {
    try {
      const data = await NftMarketplace.getActiveItems();
      res.status(200).json(data.rows);
    } catch (e) {
      console.log(e);
    }
  }

  static async getListedItems(req, res, next) {
    try {
      const data = await NftMarketplace.getListedItems();
      res.status(200).json(data.rows);
    } catch (e) {
      console.log(e);
    }
  }

  static async checkNftAddressAndTokenIdExist(req, res, next) {
    try {
      const data = await NftMarketplace.getNftAddressAndTokenId(req.body);
      res.status(200).json(data.rows);
    } catch (e) {
      console.log(e);
    }
  }

  static async insertItemListed(req, res, next) {
    try {
      const data = await NftMarketplace.insertItemListed(req.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemPrice(req, res, next) {
    try {
      const data = await NftMarketplace.updateItemPrice(req.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemSeller(req, res, next) {
    try {
      const data = await NftMarketplace.updateItemSeller(req.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }

  static async deleteActiveItem(req, res, next) {
    try {
      const data = await NftMarketplace.deleteActiveItem(req.body);
      res.status(200).json(data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = NftMarketplaceController;
