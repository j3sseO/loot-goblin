import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'

const ItemOverlay = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showInput, setShowInput] = useState(true);

    const handleCapture = async (imagePath) => {
      setLoading(true);
      try {
        const itemName = await window.electron.ipcRenderer.invoke('process-image', imagePath);

        if (itemName) {
          fetchItemData(itemName);
        } else {
          setError('Failed to recognise text');
        }
      } catch (err) {
          console.error('Error during OCR process:', err);
          setError('Error during OCR process');
      }
      setLoading(false);
    };

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

      const variables = { name: itemName };

      try {
        const data = await request(endpoint, query, variables);
        console.log(data.items[0]);
        setItemData(data.items[0]); // Get the first item in the result
      } catch (err) {
        console.error('API Error:', err);
        setError('Item not found or API error');
      } finally {
        setLoading(false);
        setShowInput(false);
      }
    };

    const handleImageSelect = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Convert image file to data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        const recognizedText = handleCapture(imageUrl);
      };
      reader.readAsDataURL(file);
    }

     // Reset state to allow new image selection
    const handleNewSearch = () => {
      setItemData(null);
      setError(null);
      setShowInput(true);
    };
    
  return (
    <div>
      {showInput && <input type="file" accept="image/*" onChange={handleImageSelect} />} {/* File input to select an image */}
      {loading && <div>Loading item data...</div>}
      {error && <div>{error}</div>}
      {itemData && (
        <div>
          <h2>{itemData.name} ({itemData.shortName})</h2>
          <p>Base Price: {itemData.basePrice}</p>
          <p>24h Avg Price: {itemData.avg24hPrice}</p>
          <a href={itemData.wikiLink} target="_blank" rel="noopener noreferrer">Wiki Link</a>
          <div>
            <img src={itemData.iconLink} alt={itemData.name} style={{ width: '50px', height: '50px' }} />
          </div>
        </div>
      )}
      <button onClick={handleNewSearch}>Select Another Image</button>
    </div>
  );
};


export default ItemOverlay;