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
      margin-bottom: 1rem;
    }
    
    .controls-row {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .buttons {
      display: flex;
      gap: 1rem;
    }
    
    .full-width {
        width: 100%;
    }
  </style>

  <canvas width="600" height="400"></canvas>
  
  <div class="controls full-width">
    <div class="controls-row">
        <sl-color-picker value="#000000" id="brush-color"></sl-color-picker>
        <sl-color-picker value="#ffffff" id="background-color"></sl-color-picker> 
    </div>
    <sl-range min="1" max="50" value="3" label="Brush width" id="brush-width"></sl-range>
  </div>
  
  <div class="buttons">
    <sl-button variant="primary" id="save-btn">Save</sl-button>
    <sl-button variant="danger" id="clear-btn">Clear</sl-button>
  </div>
`;
