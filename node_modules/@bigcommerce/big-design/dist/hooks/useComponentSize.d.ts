import { RefObject } from 'react';
interface ComponentSize {
    height: HTMLElement['offsetHeight'];
    width: HTMLElement['offsetWidth'];
}
export declare const useComponentSize: <T extends HTMLElement>(ref: RefObject<T>) => ComponentSize;
export {};
//# sourceMappingURL=useComponentSize.d.ts.map