const pool = require('../database/db');

class NftMarketplace {
  static async getActiveItems() {
    try {
      const data = await pool.query('SELECT * FROM active_items;');
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  static async getListedItems() {
    try {
      const data = await pool.query('SELECT * FROM items_listed;');
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  static async insertItemListed(data) {
    try {
      let { nftAddress, tokenId, price, seller } = data;
      const newDataActiveItems = await pool.query(
        'INSERT INTO active_items (nftAddress, tokenId, price, seller) VALUES ($1, $2, $3, $4) RETURNING *;',
        [nftAddress, tokenId, price, seller]
      );
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nftAddress, tokenId, price, seller, action) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'item_listed']
      );
      return { ...newDataActiveItems.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItem(data) {
    try {
      let { nftAddress, tokenId, price, seller, what } = data;
      let updatedActiveItem;
      if (what === 'price') {
        updatedActiveItem = await pool.query(
          'UPDATE active_items SET price = $3 WHERE nftAddress = $1 AND tokenId = $2 AND seller = $4 RETURNING *;',
          [nftAddress, tokenId, price, seller]
        );
      } else {
        updatedActiveItem = await pool.query(
          'UPDATE active_items SET seller = $4 WHERE nftAddress = $1 AND tokenId = $2 AND price = $3 RETURNING *;',
          [nftAddress, tokenId, price, seller]
        );
      }
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nftAddress, tokenId, price, seller, action) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [
          nftAddress,
          tokenId,
          price,
          seller,
          what === 'price' ? 'update_price' : 'update_seller',
        ]
      );

      return { ...updatedActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async deleteActiveItem(data) {
    try {
      let { nftAddress, tokenId, price, seller } = data;
      const deleteActiveItem = await pool.query(
        'DELETE FROM active_items WHERE nftAddress = $1 AND tokenId = $2 AND price = $3 AND seller = $4;',
        [nftAddress, tokenId, price, seller]
      );
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nftAddress, tokenId, price, seller, action) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'item_deleted']
      );
      return { ...deleteActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = NftMarketplace;
