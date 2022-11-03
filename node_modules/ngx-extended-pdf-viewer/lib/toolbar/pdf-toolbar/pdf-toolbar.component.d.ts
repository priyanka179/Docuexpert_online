import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PdfToolbarComponent {
    customToolbar: TemplateRef<any>;
    mobileFriendlyZoomScale: number;
    primaryMenuVisible: boolean;
    showBookmarkButton: boolean;
    showDownloadButton: boolean;
    showFindButton: boolean | undefined;
    showHandToolButton: boolean;
    showOpenFileButton: boolean;
    showPrintButton: boolean;
    showPagingButtons: boolean;
    showPresentationModeButton: boolean;
    showRotateButton: boolean;
    showSecondaryToolbarButton: boolean;
    showSidebarButton: boolean;
    showZoomButtons: boolean;
    textLayer: boolean | undefined;
    toolbarMarginTop: string;
    toolbarWidth: string;
    zoomLevels: (string | number)[];
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfToolbarComponent, "pdf-toolbar", never, { "customToolbar": "customToolbar"; "mobileFriendlyZoomScale": "mobileFriendlyZoomScale"; "primaryMenuVisible": "primaryMenuVisible"; "showBookmarkButton": "showBookmarkButton"; "showDownloadButton": "showDownloadButton"; "showFindButton": "showFindButton"; "showHandToolButton": "showHandToolButton"; "showOpenFileButton": "showOpenFileButton"; "showPrintButton": "showPrintButton"; "showPagingButtons": "showPagingButtons"; "showPresentationModeButton": "showPresentationModeButton"; "showRotateButton": "showRotateButton"; "showSecondaryToolbarButton": "showSecondaryToolbarButton"; "showSidebarButton": "showSidebarButton"; "showZoomButtons": "showZoomButtons"; "textLayer": "textLayer"; "toolbarMarginTop": "toolbarMarginTop"; "toolbarWidth": "toolbarWidth"; "zoomLevels": "zoomLevels"; }, {}, never, ["*"]>;
}
