export const drawerTemplate = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
      padding: 1rem;
    }

    canvas {
      border: 1px solid black;
      display: block;
      margin-bottom: 1rem;
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 150px;
      margin-bottom: 1rem;
    }

    .buttons {
      display: flex;
      gap: 1rem;
    }
  </style>

  <canvas width="600" height="400"></canvas>
  
  <div class="controls">
    <sl-color-picker value="#000000"></sl-color-picker>
    <sl-range min="1" max="20" value="3"></sl-range>
  </div>
  
  <div class="buttons">
    <sl-button variant="primary" id="save-btn">Save</sl-button>
    <sl-button variant="danger" id="clear-btn">Clear</sl-button>
  </div>
`;
