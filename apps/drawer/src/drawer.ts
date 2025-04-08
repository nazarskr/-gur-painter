import {filter, fromEvent, merge, tap, withLatestFrom} from 'rxjs';
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

        const undoBtn = this.shadow.querySelector('#undo-btn')!;
        const redoBtn = this.shadow.querySelector('#redo-btn')!;

        const brushColorPicker = this.shadow.querySelector('#brush-color') as any; // TODO: SlColorPicker
        const backgroundColorPicker = this.shadow.querySelector('#background-color') as any; // TODO: SlColorPicker
        const range = this.shadow.querySelector('#brush-width') as any; // // TODO: SlRange

        const color$ = fromEvent(brushColorPicker, 'sl-change').pipe(
            map(() => brushColorPicker.value),
            startWith(brushColorPicker.value)
        );

        // TODO: add layer
        // const backgroundColor$ = fromEvent(backgroundColorPicker, 'sl-change').pipe(
        //     map(() => backgroundColorPicker.value),
        //     startWith(backgroundColorPicker.value),
        //     tap(color => {
        //         ctx.fillStyle = color;
        //         ctx.clearRect(0, 0, canvas.width, canvas.height);
        //         ctx.fillRect(0, 0, canvas.width, canvas.height);
        //     })
        // );

        const backgroundColor$ = fromEvent(backgroundColorPicker, 'sl-change')
            .pipe(
                map(() => backgroundColorPicker.value),
                startWith(backgroundColorPicker.value),
            );

        const width$ = fromEvent(range, 'sl-change').pipe(
            map(() => +range.value),
            startWith(+range.value)
        );

        const isErasing$ = merge(
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(e => e.key === 'Shift'), map(() => true)),
            fromEvent<KeyboardEvent>(document, 'keyup').pipe(filter(e => e.key === 'Shift'), map(() => false))
        ).pipe(
            startWith(false),
            tap(isErasing => {
                canvas.style.cursor = isErasing ? 'grab' : 'default';
            })
        );

        const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
        const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
        const mouseUp$ = fromEvent<MouseEvent>(window, 'mouseup');

        const drawing$ = mouseDown$.pipe(
            switchMap(() => mouseMove$.pipe(
                takeUntil(mouseUp$),
                pairwise()
            ))
        );

        drawing$.pipe(
            withLatestFrom(color$, width$, backgroundColor$, isErasing$)
        ).subscribe(([[prev, curr], color, width, bgColor, isErasing]) => {
            const rect = canvas.getBoundingClientRect();
            const prevX = prev.clientX - rect.left;
            const prevY = prev.clientY - rect.top;
            const currX = curr.clientX - rect.left;
            const currY = curr.clientY - rect.top;

            ctx.lineWidth = width;

            if (isErasing) {
                ctx.beginPath();
                ctx.fillStyle = bgColor;
                ctx.arc(currX, currY, width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(currX, currY);
                ctx.stroke();
            }
        });

        // і тут rxjs виявився не таким вже і потрібним
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
