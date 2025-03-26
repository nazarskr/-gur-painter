function App() {
  const handleSave = async () => {
    const drawer = document.querySelector('nskr-drawer') as HTMLElement & {
      shadowRoot: ShadowRoot;
    };
    const canvas = drawer.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
    const image = canvas.toDataURL('image/png');

    const res = await fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <>
      <h1>React Wrapper (Client)</h1>
      <nskr-drawer></nskr-drawer>
      <button onClick={handleSave}>Зберегти малюнок</button>
    </>
  );
}

export default App;
