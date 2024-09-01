import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'

const ItemOverlay = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItemData = async (itemName) => {
        setLoading(true);
        const endpoint = 'https://api.tarkov.dev/graphql';

        const query = gql`
        query getItemData($name: String!) {
          items(name: $name) {
            id
            name
            shortName
            basePrice
            avg24hPrice
            wikiLink
            iconLink
          }
        }
      `;

      const variables = { name: itemName};

      try {
        const data = await request(endpoint, query, variables);
        setItemData(data.items[0]); // Get the first item in the result
      } catch (err) {
        console.error('API Error:', err);
        setError('Item not found or API error');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchItemData('Red Rebel ice pick');
    }, []);

    if (loading) return <div>Loading item data...</div>;
    if (error) return <div>{error}</div>;

    return itemData ? (
        <div>
          <h2>{itemData.name} ({itemData.shortName})</h2>
          <p>Base Price: {itemData.basePrice}</p>
          <p>24h Avg Price: {itemData.avg24hPrice}</p>
          <a href={itemData.wikiLink} target="_blank" rel="noopener noreferrer">Wiki Link</a>
          <div>
            <img src={itemData.iconLink} alt={itemData.name} style={{ width: '50px', height: '50px' }} />
          </div>
        </div>
      ) : (
        <div>No item data</div>
      );
};

export default ItemOverlay;