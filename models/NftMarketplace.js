const pool = require('../database/db');

const time = new Date(Date.now() + 25200000).toISOString();

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
        'INSERT INTO active_items (nft_address, token_id, price, seller, last_updated) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [nftAddress, tokenId, price, seller, time]
      );
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nft_address, token_id, price, seller, action, last_updated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'item_listed', time]
      );
      return { ...newDataActiveItems.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemPrice(data) {
    try {
      let { nftAddress, tokenId, price, seller } = data;

      const updatedActiveItem = await pool.query(
        'UPDATE active_items SET price = $3 WHERE nft_address = $1 AND token_id = $2 AND seller = $4 AND last_updated = $5 RETURNING *;',
        [nftAddress, tokenId, price, seller, time]
      );

      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nft_address, token_id, price, seller, action, last_updated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'price_updated', time]
      );

      return { ...updatedActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemSeller(data) {
    try {
      let { nftAddress, tokenId, price, buyer } = data;

      const updatedActiveItem = await pool.query(
        'UPDATE active_items SET seller = $4 WHERE nft_address = $1 AND token_id = $2 AND price = $3 RETURNING *;',
        [nftAddress, tokenId, price, buyer]
      );

      const insertItemBought = await pool.query(
        'INSERT INTO items_bought (nft_address, token_id, price, buyer, time) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [nftAddress, tokenId, price, buyer, time]
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
        'DELETE FROM active_items WHERE nft_address = $1 AND token_id = $2 AND price = $3 AND seller = $4;',
        [nftAddress, tokenId, price, seller]
      );
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nft_address, token_id, price, seller, action, last_updated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'item_deleted', time]
      );
      return { ...deleteActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = NftMarketplace;
