import type * as React from 'react';

import type { NskrDrawerElement } from './drawer';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'nskr-drawer': React.DetailedHTMLProps<
                React.HTMLAttributes<NskrDrawerElement>,
                NskrDrawerElement
            >;
        }
    }
}

export {};
