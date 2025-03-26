import {fromEvent} from 'rxjs';
import {map, switchMap, takeUntil, pairwise, startWith} from 'rxjs/operators';
import 'ui';
import {drawerTemplate} from "./drawer.template";

class NskrDrawerElement extends HTMLElement {
    shadow: ShadowRoot;
    private _onSave: (imageUrl: string) => void = () => {
    };

    set onSave(callback: () => void) {
        this._onSave = callback;
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback(): void {
        this.shadow.innerHTML = drawerTemplate;

        const canvas = this.shadow.querySelector('canvas')!;
        const ctx = canvas.getContext('2d')!;
        ctx.lineCap = 'round';

        const colorPicker = this.shadow.querySelector('sl-color-picker')!;
        const range = this.shadow.querySelector('sl-range')!;

        const color$ = fromEvent(colorPicker, 'sl-change').pipe(
            map(() => (colorPicker as any).value),
            startWith((colorPicker as any).value)
        );

        const width$ = fromEvent(range, 'sl-change').pipe(
            map(() => +(range as any).value),
            startWith(+(range as any).value)
        );

        color$.subscribe(color => ctx.strokeStyle = color);
        width$.subscribe(width => ctx.lineWidth = width);

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

        const saveBtn = this.shadow.querySelector('#save-btn')!;
        saveBtn.addEventListener('click', () => {
            const imageUrl = canvas.toDataURL('image/png');
            this._onSave?.(imageUrl);
        });

        const clearBtn = this.shadow.querySelector('#clear-btn')!;
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
}

customElements.define('nskr-drawer', NskrDrawerElement);

export type {NskrDrawerElement} from './types/drawer';
