import { TemplateRef, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { PdfThumbnailDrawnEvent } from '../../../events/pdf-thumbnail-drawn-event';
import * as i0 from "@angular/core";
export declare class PdfSidebarContentComponent implements OnDestroy {
    customThumbnail: TemplateRef<any>;
    thumbnailViewTemplate: ElementRef;
    private linkService;
    thumbnailDrawn: EventEmitter<PdfThumbnailDrawnEvent>;
    top: string;
    _hideSidebarToolbar: boolean;
    constructor();
    ngOnDestroy(): void;
    pdfThumbnailGeneratorReady(): boolean;
    private createThumbnail;
    private createElementFromHTML;
    onKeyDown(event: KeyboardEvent): void;
    set hideSidebarToolbar(h: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfSidebarContentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfSidebarContentComponent, "pdf-sidebar-content", never, { "customThumbnail": "customThumbnail"; "hideSidebarToolbar": "hideSidebarToolbar"; }, { "thumbnailDrawn": "thumbnailDrawn"; }, never, ["*"]>;
}
