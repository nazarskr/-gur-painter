import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

class Drawer extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.shadow.innerHTML = `
      <style>canvas { border: 1px solid black; }</style>
      <canvas width="600" height="400"></canvas>
    `;

    const canvas = this.shadow.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(window, 'mouseup');

    mouseDown$
      .pipe(
        switchMap(() =>
          mouseMove$.pipe(pairwise(), takeUntil(mouseUp$))
        )
      )
      .subscribe(([prev, curr]) => {
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(prev.clientX - rect.left, prev.clientY - rect.top);
        ctx.lineTo(curr.clientX - rect.left, curr.clientY - rect.top);
        ctx.stroke();
      });
  }
}

customElements.define('nskr-drawer', Drawer);
