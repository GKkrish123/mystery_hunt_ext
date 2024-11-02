import React, { useState } from 'react';
import { Button, Group, Title, Text } from '@mantine/core';

const Toolbox = () => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);

    // Send a message to the content script to activate the tool
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { tool });
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Title order={3}>GKrish Puzzle Tools</Title>
      <Text>Select a tool to reveal clues:</Text>

      <Group direction="column" position="center" mt="md">
        <Button onClick={() => handleToolSelect('uv')} color="yellow">UV Light</Button>
        <Button onClick={() => handleToolSelect('magnifying')} color="blue">Magnifying Glass</Button>
        <Button onClick={() => handleToolSelect('eraser')} color="gray">Eraser</Button>
      </Group>
    </div>
  );
};

export default Toolbox;
