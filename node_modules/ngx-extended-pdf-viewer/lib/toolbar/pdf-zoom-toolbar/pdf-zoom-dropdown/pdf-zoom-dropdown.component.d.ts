import { OnInit, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
interface ZoomLevel {
    id: string;
    dataL10nId: string;
    dataL10nArgs: string | undefined;
    value: string;
    displayValue: string;
}
export declare class PdfZoomDropdownComponent implements OnInit {
    private element;
    _zoomLevels: Array<ZoomLevel>;
    set zoomLevels(levels: Array<string | number>);
    sizeSelector: any;
    constructor(element: ElementRef);
    ngOnInit(): void;
    private valueToZoomLevel;
    private snakeToCamel;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfZoomDropdownComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfZoomDropdownComponent, "pdf-zoom-dropdown", never, { "zoomLevels": "zoomLevels"; }, {}, never, never>;
}
export {};
