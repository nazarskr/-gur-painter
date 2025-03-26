import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import 'drawer';
import type { NskrDrawerElement } from 'drawer';
import 'ui';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  padding: 2rem;
`;

const Card = styled('sl-card')`
  padding: 2rem;
  max-width: 800px;
  width: 100%;
`;

const DrawerWrapper = () => {
  const drawerRef = useRef<NskrDrawerElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    drawer.onSave = async (imageUrl: string) => {
      const res = await fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();
      alert(data.message);
    };
  }, []);

  return (
    <Wrapper>
      <Card>
        <sl-heading level="1" size="large" style={{ marginBottom: '1rem' }}>
          RxJS Drawer
        </sl-heading>
        <sl-divider style={{ marginBottom: '1rem' }} />
        <nskr-drawer ref={drawerRef} />
      </Card>
    </Wrapper>
  );
};

export default DrawerWrapper;
