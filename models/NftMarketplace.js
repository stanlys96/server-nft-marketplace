const pool = require('../database/db');

class NftMarketplace {
  static async getActiveItems() {
    try {
      const data = await pool.query(
        'SELECT * FROM active_items ORDER BY id ASC;'
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  static async getListedItems() {
    try {
      const data = await pool.query(
        'SELECT * FROM items_listed ORDER BY id ASC;'
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  static async getNftAddressAndTokenId(data) {
    try {
      let { nftAddress, tokenId } = data;
      const result = await pool.query(
        'SELECT * FROM active_items WHERE nft_address = $1 AND token_id = $2',
        [nftAddress, tokenId]
      );
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  static async insertItemListed(data) {
    const time = new Date(Date.now() + 25200000).toISOString();
    try {
      let {
        nftAddress,
        tokenId,
        price,
        seller,
        imageUrl,
        tokenName,
        tokenDescription,
      } = data;
      const newDataActiveItems = await pool.query(
        'INSERT INTO active_items (nft_address, token_id, price, seller, last_updated, image_url, token_name, token_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
        [
          nftAddress,
          tokenId,
          price,
          seller,
          time,
          imageUrl,
          tokenName,
          tokenDescription,
        ]
      );
      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nft_address, token_id, price, seller, action, last_updated, image_url, token_name, token_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
        [
          nftAddress,
          tokenId,
          price,
          seller,
          'item_listed',
          time,
          imageUrl,
          tokenName,
          tokenDescription,
        ]
      );
      return { ...newDataActiveItems.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemPrice(data) {
    const time = new Date(Date.now() + 25200000).toISOString();
    try {
      let { nftAddress, tokenId, price, seller } = data;
      console.log(data, ' <<<<< data');
      price = parseFloat(price);
      const updatedActiveItem = await pool.query(
        'UPDATE active_items SET price = $3 WHERE nft_address = $1 AND token_id = $2 AND seller = $4 RETURNING *;',
        [nftAddress, tokenId, price, seller]
      );

      const newDataItemsListed = await pool.query(
        'INSERT INTO items_listed (nft_address, token_id, price, seller, action, last_updated) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [nftAddress, tokenId, price, seller, 'price_updated', time]
      );
      console.log(updatedActiveItem);
      return { ...updatedActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async updateItemSeller(data) {
    const time = new Date(Date.now() + 25200000).toISOString();
    try {
      let {
        nftAddress,
        tokenId,
        price,
        buyer,
        imageUrl,
        tokenName,
        tokenDescription,
        seller,
      } = data;

      const deleteActiveItem = await pool.query(
        'DELETE FROM active_items WHERE nft_address = $1 AND token_id = $2 AND price = $3 AND seller = $4;',
        [nftAddress, tokenId, price, seller]
      );

      const insertItemBought = await pool.query(
        'INSERT INTO items_bought (nft_address, token_id, price, buyer, time, image_url, token_name, token_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
        [
          nftAddress,
          tokenId,
          price,
          buyer,
          time,
          imageUrl,
          tokenName,
          tokenDescription,
        ]
      );

      return { ...deleteActiveItem.rows[0], message: 'Success!' };
    } catch (e) {
      console.log(e);
    }
  }

  static async deleteActiveItem(data) {
    const time = new Date(Date.now() + 25200000).toISOString();
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
