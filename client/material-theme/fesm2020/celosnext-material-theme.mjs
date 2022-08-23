import * as i0 from '@angular/core';
import { Directive, Component, Input, NgModule } from '@angular/core';
import { LayoutDirective, ShowHideDirective, ClassDirective, StyleDirective, ImgSrcDirective, FlexDirective, FlexOrderDirective, FlexOffsetDirective, FlexAlignDirective, FlexFillDirective, BREAKPOINT } from '@angular/flex-layout';
import * as i1 from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const layoutInputs$3 = ['fxLayout.xxl'];
const hideInputs$3 = ['fxHide.xxl'];
const showInputs$3 = ['fxShow.xxl'];
const classInputs$3 = ['ngClass.xxl'];
const styleInputs$3 = ['ngStyle.xxl'];
const imgInputs$3 = ['imgSrc.xxl'];
const flexInputs$3 = ['fxFlex.xxl'];
const orderInputs$3 = ['fxFlexOrder.xxl'];
const offsetInputs$3 = ['fxFlexOffset.xxl'];
const flexAlignInputs$3 = ['fxFlexAlign.xxl'];
const fillInputs$3 = ['fxFlexFill.xxl', 'fxFill.xxl'];
class BreakpointLayoutXxlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs$3;
    }
}
BreakpointLayoutXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutXxlDirective, selector: "[fxLayout.xxl]", inputs: { "fxLayout.xxl": "fxLayout.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxl]`, inputs: layoutInputs$3
                }]
        }] });
class BreakpointHideXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$3;
    }
}
BreakpointHideXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideXxlDirective, selector: "[fxHide.xxl]", inputs: { "fxHide.xxl": "fxHide.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxl]`, inputs: hideInputs$3
                }]
        }] });
class BreakpointShowXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$3;
    }
}
BreakpointShowXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowXxlDirective, selector: "[fxShow.xxl]", inputs: { "fxShow.xxl": "fxShow.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxl]`, inputs: showInputs$3
                }]
        }] });
class BreakpointClassXxlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$3;
    }
}
BreakpointClassXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassXxlDirective, selector: "[ngClass.xxl]", inputs: { "ngClass.xxl": "ngClass.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxl]`, inputs: classInputs$3
                }]
        }] });
class BreakpointStyleXxlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$3;
    }
}
BreakpointStyleXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleXxlDirective, selector: "[ngStyle.xxl]", inputs: { "ngStyle.xxl": "ngStyle.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxl]`, inputs: styleInputs$3
                }]
        }] });
class BreakpointImgSrcXxlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$3;
    }
}
BreakpointImgSrcXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcXxlDirective, selector: "[imgSrc.xxl]", inputs: { "imgSrc.xxl": "imgSrc.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxl]`, inputs: imgInputs$3
                }]
        }] });
class BreakpointFlexXxlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$3;
    }
}
BreakpointFlexXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexXxlDirective, selector: "[fxFlex.xxl]", inputs: { "fxFlex.xxl": "fxFlex.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxl]`, inputs: flexInputs$3
                }]
        }] });
class BreakpointOrderXxlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$3;
    }
}
BreakpointOrderXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderXxlDirective, selector: "[fxFlexOrder.xxl]", inputs: { "fxFlexOrder.xxl": "fxFlexOrder.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxl]`, inputs: orderInputs$3
                }]
        }] });
class BreakpointOffsetXxlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$3;
    }
}
BreakpointOffsetXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetXxlDirective, selector: "[fxFlexOffset.xxl]", inputs: { "fxFlexOffset.xxl": "fxFlexOffset.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxl]`, inputs: offsetInputs$3
                }]
        }] });
class BreakpointFlexAlignXxlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$3;
    }
}
BreakpointFlexAlignXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignXxlDirective, selector: "[fxFlexAlign.xxl]", inputs: { "fxFlexAlign.xxl": "fxFlexAlign.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxl]`, inputs: flexAlignInputs$3
                }]
        }] });
class BreakpointFillXxlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$3;
    }
}
BreakpointFillXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillXxlDirective, selector: "[fxFlexFill.xxl]", inputs: { "fxFlexFill.xxl": "fxFlexFill.xxl", "fxFill.xxl": "fxFill.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxl]`, inputs: fillInputs$3
                }]
        }] });

const layoutInputs$2 = ['fxLayout.xxs'];
const hideInputs$2 = ['fxHide.xxs'];
const showInputs$2 = ['fxShow.xxs'];
const classInputs$2 = ['ngClass.xxs'];
const styleInputs$2 = ['ngStyle.xxs'];
const imgInputs$2 = ['imgSrc.xxs'];
const flexInputs$2 = ['fxFlex.xxs'];
const orderInputs$2 = ['fxFlexOrder.xxs'];
const offsetInputs$2 = ['fxFlexOffset.xxs'];
const flexAlignInputs$2 = ['fxFlexAlign.xxs'];
const fillInputs$2 = ['fxFlexFill.xxs', 'fxFill.xxs'];
class BreakpointLayoutXxsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs$2;
    }
}
BreakpointLayoutXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutXxsDirective, selector: "[fxLayout.xxs]", inputs: { "fxLayout.xxs": "fxLayout.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxs]`, inputs: layoutInputs$2
                }]
        }] });
class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$2;
    }
}
BreakpointHideXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideXxsDirective, selector: "[fxHide.xxs]", inputs: { "fxHide.xxs": "fxHide.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxs]`, inputs: hideInputs$2
                }]
        }] });
class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$2;
    }
}
BreakpointShowXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowXxsDirective, selector: "[fxShow.xxs]", inputs: { "fxShow.xxs": "fxShow.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxs]`, inputs: showInputs$2
                }]
        }] });
class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$2;
    }
}
BreakpointClassXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassXxsDirective, selector: "[ngClass.xxs]", inputs: { "ngClass.xxs": "ngClass.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxs]`, inputs: classInputs$2
                }]
        }] });
class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$2;
    }
}
BreakpointStyleXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleXxsDirective, selector: "[ngStyle.xxs]", inputs: { "ngStyle.xxs": "ngStyle.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxs]`, inputs: styleInputs$2
                }]
        }] });
class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$2;
    }
}
BreakpointImgSrcXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcXxsDirective, selector: "[imgSrc.xxs]", inputs: { "imgSrc.xxs": "imgSrc.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxs]`, inputs: imgInputs$2
                }]
        }] });
class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$2;
    }
}
BreakpointFlexXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexXxsDirective, selector: "[fxFlex.xxs]", inputs: { "fxFlex.xxs": "fxFlex.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxs]`, inputs: flexInputs$2
                }]
        }] });
class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$2;
    }
}
BreakpointOrderXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderXxsDirective, selector: "[fxFlexOrder.xxs]", inputs: { "fxFlexOrder.xxs": "fxFlexOrder.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxs]`, inputs: orderInputs$2
                }]
        }] });
class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$2;
    }
}
BreakpointOffsetXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetXxsDirective, selector: "[fxFlexOffset.xxs]", inputs: { "fxFlexOffset.xxs": "fxFlexOffset.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxs]`, inputs: offsetInputs$2
                }]
        }] });
class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$2;
    }
}
BreakpointFlexAlignXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignXxsDirective, selector: "[fxFlexAlign.xxs]", inputs: { "fxFlexAlign.xxs": "fxFlexAlign.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxs]`, inputs: flexAlignInputs$2
                }]
        }] });
class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$2;
    }
}
BreakpointFillXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillXxsDirective, selector: "[fxFlexFill.xxs]", inputs: { "fxFlexFill.xxs": "fxFlexFill.xxs", "fxFill.xxs": "fxFill.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxs]`, inputs: fillInputs$2
                }]
        }] });

const CELOSNEXT_BREAKPOINTS = [{
        alias: 'xxs',
        suffix: 'xxsScreen',
        mediaQuery: 'screen and (max-width: 479.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xs',
        suffix: 'xsScreen',
        mediaQuery: 'screen and (min-width: 480px) and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-xs',
        suffix: 'gtXsScreen',
        mediaQuery: 'screen and (min-width: 480px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-xs',
        suffix: 'ltXsScreen',
        mediaQuery: 'screen and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'sm',
        suffix: 'smScreen',
        mediaQuery: 'screen and (min-width: 768px) and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-sm',
        suffix: 'gtSmScreen',
        mediaQuery: 'screen and (min-width: 768px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-sm',
        suffix: 'ltSmScreen',
        mediaQuery: 'screen and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'md',
        suffix: 'mdScreen',
        mediaQuery: 'screen and (min-width: 992px) and (max-width: 1279.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-md',
        suffix: 'gtMdScreen',
        mediaQuery: 'screen and (min-width: 992px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-md',
        suffix: 'ltMdScreen',
        mediaQuery: 'screen and (max-width: 1279.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lg',
        suffix: 'lgScreen',
        mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1559.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-lg',
        suffix: 'gtLgScreen',
        mediaQuery: 'screen and (min-width: 1280px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-lg',
        suffix: 'ltLgScreen',
        mediaQuery: 'screen and (max-width: 1559.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xl',
        suffix: 'xlScreen',
        mediaQuery: 'screen and (min-width: 1560px) and (max-width: 1799.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-xl',
        suffix: 'gtXlScreen',
        mediaQuery: 'screen and (min-width: 1560px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-xl',
        suffix: 'ltXlScreen',
        mediaQuery: 'screen and (max-width: 1799.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xxl',
        suffix: 'xxlScreen',
        mediaQuery: 'screen and (min-width: 1800px)',
        overlapping: false,
        priority: 1001
    }];
const CelosNextBreakPointsProvider = {
    provide: BREAKPOINT,
    useValue: CELOSNEXT_BREAKPOINTS,
    multi: true
};

const layoutInputs$1 = ['fxLayout.lt-xs'];
const hideInputs$1 = ['fxHide.lt-xs'];
const showInputs$1 = ['fxShow.lt-xs'];
const classInputs$1 = ['ngClass.lt-xs'];
const styleInputs$1 = ['ngStyle.lt-xs'];
const imgInputs$1 = ['imgSrc.lt-xs'];
const flexInputs$1 = ['fxFlex.lt-xs'];
const orderInputs$1 = ['fxFlexOrder.lt-xs'];
const offsetInputs$1 = ['fxFlexOffset.lt-xs'];
const flexAlignInputs$1 = ['fxFlexAlign.lt-xs'];
const fillInputs$1 = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
class BreakpointLayoutLtXsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs$1;
    }
}
BreakpointLayoutLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutLtXsDirective, selector: "[fxLayout.lt-xs]", inputs: { "fxLayout.lt-xs": "fxLayout.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.lt-xs]`, inputs: layoutInputs$1
                }]
        }] });
class BreakpointHideLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$1;
    }
}
BreakpointHideLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideLtXsDirective, selector: "[fxHide.lt-xs]", inputs: { "fxHide.lt-xs": "fxHide.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.lt-xs]`, inputs: hideInputs$1
                }]
        }] });
class BreakpointShowLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$1;
    }
}
BreakpointShowLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowLtXsDirective, selector: "[fxShow.lt-xs]", inputs: { "fxShow.lt-xs": "fxShow.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.lt-xs]`, inputs: showInputs$1
                }]
        }] });
class BreakpointClassLtXsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$1;
    }
}
BreakpointClassLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassLtXsDirective, selector: "[ngClass.lt-xs]", inputs: { "ngClass.lt-xs": "ngClass.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.lt-xs]`, inputs: classInputs$1
                }]
        }] });
class BreakpointStyleLtXsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$1;
    }
}
BreakpointStyleLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleLtXsDirective, selector: "[ngStyle.lt-xs]", inputs: { "ngStyle.lt-xs": "ngStyle.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.lt-xs]`, inputs: styleInputs$1
                }]
        }] });
class BreakpointImgSrcLtXsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$1;
    }
}
BreakpointImgSrcLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcLtXsDirective, selector: "[imgSrc.lt-xs]", inputs: { "imgSrc.lt-xs": "imgSrc.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.lt-xs]`, inputs: imgInputs$1
                }]
        }] });
class BreakpointFlexLtXsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$1;
    }
}
BreakpointFlexLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexLtXsDirective, selector: "[fxFlex.lt-xs]", inputs: { "fxFlex.lt-xs": "fxFlex.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.lt-xs]`, inputs: flexInputs$1
                }]
        }] });
class BreakpointOrderLtXsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$1;
    }
}
BreakpointOrderLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderLtXsDirective, selector: "[fxFlexOrder.lt-xs]", inputs: { "fxFlexOrder.lt-xs": "fxFlexOrder.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.lt-xs]`, inputs: orderInputs$1
                }]
        }] });
class BreakpointOffsetLtXsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$1;
    }
}
BreakpointOffsetLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetLtXsDirective, selector: "[fxFlexOffset.lt-xs]", inputs: { "fxFlexOffset.lt-xs": "fxFlexOffset.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.lt-xs]`, inputs: offsetInputs$1
                }]
        }] });
class BreakpointFlexAlignLtXsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$1;
    }
}
BreakpointFlexAlignLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignLtXsDirective, selector: "[fxFlexAlign.lt-xs]", inputs: { "fxFlexAlign.lt-xs": "fxFlexAlign.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.lt-xs]`, inputs: flexAlignInputs$1
                }]
        }] });
class BreakpointFillLtXsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$1;
    }
}
BreakpointFillLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillLtXsDirective, selector: "[fxFlexFill.lt-xs]", inputs: { "fxFlexFill.lt-xs": "fxFlexFill.lt-xs", "fxFill.lt-xs": "fxFill.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.lt-xs]`, inputs: fillInputs$1
                }]
        }] });

const layoutInputs = ['fxLayout.gt-xl'];
const hideInputs = ['fxHide.gt-xl'];
const showInputs = ['fxShow.gt-xl'];
const classInputs = ['ngClass.gt-xl'];
const styleInputs = ['ngStyle.gt-xl'];
const imgInputs = ['imgSrc.gt-xl'];
const flexInputs = ['fxFlex.gt-xl'];
const orderInputs = ['fxFlexOrder.gt-xl'];
const offsetInputs = ['fxFlexOffset.gt-xl'];
const flexAlignInputs = ['fxFlexAlign.gt-xl'];
const fillInputs = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
class BreakpointLayoutGtXlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInputs;
    }
}
BreakpointLayoutGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointLayoutGtXlDirective, selector: "[fxLayout.lt-xs]", inputs: { "fxLayout.gt-xl": "fxLayout.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointLayoutGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.lt-xs]`, inputs: layoutInputs
                }]
        }] });
class BreakpointHideGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointHideGtXlDirective, selector: "[fxHide.gt-xl]", inputs: { "fxHide.gt-xl": "fxHide.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointHideGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.gt-xl]`, inputs: hideInputs
                }]
        }] });
class BreakpointShowGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointShowGtXlDirective, selector: "[fxShow.gt-xl]", inputs: { "fxShow.gt-xl": "fxShow.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointShowGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.gt-xl]`, inputs: showInputs
                }]
        }] });
class BreakpointClassGtXlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointClassGtXlDirective, selector: "[ngClass.gt-xl]", inputs: { "ngClass.gt-xl": "ngClass.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointClassGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.gt-xl]`, inputs: classInputs
                }]
        }] });
class BreakpointStyleGtXlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointStyleGtXlDirective, selector: "[ngStyle.gt-xl]", inputs: { "ngStyle.gt-xl": "ngStyle.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointStyleGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.gt-xl]`, inputs: styleInputs
                }]
        }] });
class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointImgSrcGtXlDirective, selector: "[imgSrc.gt-xl]", inputs: { "imgSrc.gt-xl": "imgSrc.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointImgSrcGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.gt-xl]`, inputs: imgInputs
                }]
        }] });
class BreakpointFlexGtXlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexGtXlDirective, selector: "[fxFlex.gt-xl]", inputs: { "fxFlex.gt-xl": "fxFlex.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.gt-xl]`, inputs: flexInputs
                }]
        }] });
class BreakpointOrderGtXlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOrderGtXlDirective, selector: "[fxFlexOrder.gt-xl]", inputs: { "fxFlexOrder.gt-xl": "fxFlexOrder.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOrderGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.gt-xl]`, inputs: orderInputs
                }]
        }] });
class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointOffsetGtXlDirective, selector: "[fxFlexOffset.gt-xl]", inputs: { "fxFlexOffset.gt-xl": "fxFlexOffset.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointOffsetGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.gt-xl]`, inputs: offsetInputs
                }]
        }] });
class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFlexAlignGtXlDirective, selector: "[fxFlexAlign.gt-xl]", inputs: { "fxFlexAlign.gt-xl": "fxFlexAlign.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.gt-xl]`, inputs: flexAlignInputs
                }]
        }] });
class BreakpointFillGtXlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: BreakpointFillGtXlDirective, selector: "[fxFlexFill.gt-xl]", inputs: { "fxFlexFill.gt-xl": "fxFlexFill.gt-xl", "fxFill.gt-xl": "fxFill.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: BreakpointFillGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.gt-xl]`, inputs: fillInputs
                }]
        }] });

class DmgHeaderComponent {
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.includeLayout = true;
        this.header = '';
        this.subheader = '';
    }
    ngOnInit() {
        this.route.url.subscribe(() => {
            this.setHeadings();
        });
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
            this.setHeadings();
        });
    }
    setHeadings() {
        if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data) {
            let data = this.route.snapshot.firstChild.data;
            if (data.header)
                this.header = data.header;
            if (data.subheader)
                this.subheader = data.subheader;
        }
    }
}
DmgHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgHeaderComponent, deps: [{ token: i1.ActivatedRoute }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Component });
DmgHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: DmgHeaderComponent, selector: "dmg-header", inputs: { includeLayout: "includeLayout" }, ngImport: i0, template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:bold;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dmg-header', template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:bold;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }, { type: i1.Router }]; }, propDecorators: { includeLayout: [{
                type: Input
            }] } });

class DmgLayoutModule {
}
DmgLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DmgLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgLayoutModule, declarations: [BreakpointLayoutXxlDirective,
        BreakpointHideXxlDirective,
        BreakpointShowXxlDirective,
        BreakpointClassXxlDirective,
        BreakpointStyleXxlDirective,
        BreakpointImgSrcXxlDirective,
        BreakpointFlexXxlDirective,
        BreakpointOrderXxlDirective,
        BreakpointOffsetXxlDirective,
        BreakpointFlexAlignXxlDirective,
        BreakpointFillXxlDirective,
        BreakpointLayoutXxsDirective,
        BreakpointHideXxsDirective,
        BreakpointShowXxsDirective,
        BreakpointClassXxsDirective,
        BreakpointStyleXxsDirective,
        BreakpointImgSrcXxsDirective,
        BreakpointFlexXxsDirective,
        BreakpointOrderXxsDirective,
        BreakpointOffsetXxsDirective,
        BreakpointFlexAlignXxsDirective,
        BreakpointFillXxsDirective,
        BreakpointLayoutLtXsDirective,
        BreakpointFillLtXsDirective,
        BreakpointHideLtXsDirective,
        BreakpointShowLtXsDirective,
        BreakpointClassLtXsDirective,
        BreakpointStyleLtXsDirective,
        BreakpointImgSrcLtXsDirective,
        BreakpointFlexLtXsDirective,
        BreakpointOrderLtXsDirective,
        BreakpointOffsetLtXsDirective,
        BreakpointFlexAlignLtXsDirective,
        BreakpointLayoutGtXlDirective,
        BreakpointFillGtXlDirective,
        BreakpointHideGtXlDirective,
        BreakpointShowGtXlDirective,
        BreakpointClassGtXlDirective,
        BreakpointStyleGtXlDirective,
        BreakpointImgSrcGtXlDirective,
        BreakpointFlexGtXlDirective,
        BreakpointOrderGtXlDirective,
        BreakpointOffsetGtXlDirective,
        BreakpointFlexAlignGtXlDirective,
        DmgHeaderComponent], exports: [BreakpointLayoutXxlDirective,
        BreakpointHideXxlDirective,
        BreakpointShowXxlDirective,
        BreakpointClassXxlDirective,
        BreakpointStyleXxlDirective,
        BreakpointImgSrcXxlDirective,
        BreakpointFlexXxlDirective,
        BreakpointOrderXxlDirective,
        BreakpointOffsetXxlDirective,
        BreakpointFlexAlignXxlDirective,
        BreakpointFillXxlDirective,
        BreakpointLayoutXxsDirective,
        BreakpointHideXxsDirective,
        BreakpointShowXxsDirective,
        BreakpointClassXxsDirective,
        BreakpointStyleXxsDirective,
        BreakpointImgSrcXxsDirective,
        BreakpointFlexXxsDirective,
        BreakpointOrderXxsDirective,
        BreakpointOffsetXxsDirective,
        BreakpointFlexAlignXxsDirective,
        BreakpointFillXxsDirective,
        BreakpointLayoutLtXsDirective,
        BreakpointFillLtXsDirective,
        BreakpointHideLtXsDirective,
        BreakpointShowLtXsDirective,
        BreakpointClassLtXsDirective,
        BreakpointStyleLtXsDirective,
        BreakpointImgSrcLtXsDirective,
        BreakpointFlexLtXsDirective,
        BreakpointOrderLtXsDirective,
        BreakpointOffsetLtXsDirective,
        BreakpointFlexAlignLtXsDirective,
        BreakpointLayoutGtXlDirective,
        BreakpointFillGtXlDirective,
        BreakpointHideGtXlDirective,
        BreakpointShowGtXlDirective,
        BreakpointClassGtXlDirective,
        BreakpointStyleGtXlDirective,
        BreakpointImgSrcGtXlDirective,
        BreakpointFlexGtXlDirective,
        BreakpointOrderGtXlDirective,
        BreakpointOffsetGtXlDirective,
        BreakpointFlexAlignGtXlDirective,
        DmgHeaderComponent] });
DmgLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgLayoutModule, providers: [
        CelosNextBreakPointsProvider
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: DmgLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        BreakpointLayoutXxlDirective,
                        BreakpointHideXxlDirective,
                        BreakpointShowXxlDirective,
                        BreakpointClassXxlDirective,
                        BreakpointStyleXxlDirective,
                        BreakpointImgSrcXxlDirective,
                        BreakpointFlexXxlDirective,
                        BreakpointOrderXxlDirective,
                        BreakpointOffsetXxlDirective,
                        BreakpointFlexAlignXxlDirective,
                        BreakpointFillXxlDirective,
                        BreakpointLayoutXxsDirective,
                        BreakpointHideXxsDirective,
                        BreakpointShowXxsDirective,
                        BreakpointClassXxsDirective,
                        BreakpointStyleXxsDirective,
                        BreakpointImgSrcXxsDirective,
                        BreakpointFlexXxsDirective,
                        BreakpointOrderXxsDirective,
                        BreakpointOffsetXxsDirective,
                        BreakpointFlexAlignXxsDirective,
                        BreakpointFillXxsDirective,
                        BreakpointLayoutLtXsDirective,
                        BreakpointFillLtXsDirective,
                        BreakpointHideLtXsDirective,
                        BreakpointShowLtXsDirective,
                        BreakpointClassLtXsDirective,
                        BreakpointStyleLtXsDirective,
                        BreakpointImgSrcLtXsDirective,
                        BreakpointFlexLtXsDirective,
                        BreakpointOrderLtXsDirective,
                        BreakpointOffsetLtXsDirective,
                        BreakpointFlexAlignLtXsDirective,
                        BreakpointLayoutGtXlDirective,
                        BreakpointFillGtXlDirective,
                        BreakpointHideGtXlDirective,
                        BreakpointShowGtXlDirective,
                        BreakpointClassGtXlDirective,
                        BreakpointStyleGtXlDirective,
                        BreakpointImgSrcGtXlDirective,
                        BreakpointFlexGtXlDirective,
                        BreakpointOrderGtXlDirective,
                        BreakpointOffsetGtXlDirective,
                        BreakpointFlexAlignGtXlDirective,
                        DmgHeaderComponent
                    ],
                    exports: [
                        BreakpointLayoutXxlDirective,
                        BreakpointHideXxlDirective,
                        BreakpointShowXxlDirective,
                        BreakpointClassXxlDirective,
                        BreakpointStyleXxlDirective,
                        BreakpointImgSrcXxlDirective,
                        BreakpointFlexXxlDirective,
                        BreakpointOrderXxlDirective,
                        BreakpointOffsetXxlDirective,
                        BreakpointFlexAlignXxlDirective,
                        BreakpointFillXxlDirective,
                        BreakpointLayoutXxsDirective,
                        BreakpointHideXxsDirective,
                        BreakpointShowXxsDirective,
                        BreakpointClassXxsDirective,
                        BreakpointStyleXxsDirective,
                        BreakpointImgSrcXxsDirective,
                        BreakpointFlexXxsDirective,
                        BreakpointOrderXxsDirective,
                        BreakpointOffsetXxsDirective,
                        BreakpointFlexAlignXxsDirective,
                        BreakpointFillXxsDirective,
                        BreakpointLayoutLtXsDirective,
                        BreakpointFillLtXsDirective,
                        BreakpointHideLtXsDirective,
                        BreakpointShowLtXsDirective,
                        BreakpointClassLtXsDirective,
                        BreakpointStyleLtXsDirective,
                        BreakpointImgSrcLtXsDirective,
                        BreakpointFlexLtXsDirective,
                        BreakpointOrderLtXsDirective,
                        BreakpointOffsetLtXsDirective,
                        BreakpointFlexAlignLtXsDirective,
                        BreakpointLayoutGtXlDirective,
                        BreakpointFillGtXlDirective,
                        BreakpointHideGtXlDirective,
                        BreakpointShowGtXlDirective,
                        BreakpointClassGtXlDirective,
                        BreakpointStyleGtXlDirective,
                        BreakpointImgSrcGtXlDirective,
                        BreakpointFlexGtXlDirective,
                        BreakpointOrderGtXlDirective,
                        BreakpointOffsetGtXlDirective,
                        BreakpointFlexAlignGtXlDirective,
                        DmgHeaderComponent
                    ],
                    providers: [
                        CelosNextBreakPointsProvider
                    ]
                }]
        }] });

/*
 * Public API Surface of material-theme
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BreakpointClassGtXlDirective, BreakpointClassLtXsDirective, BreakpointClassXxlDirective, BreakpointClassXxsDirective, BreakpointFillGtXlDirective, BreakpointFillLtXsDirective, BreakpointFillXxlDirective, BreakpointFillXxsDirective, BreakpointFlexAlignGtXlDirective, BreakpointFlexAlignLtXsDirective, BreakpointFlexAlignXxlDirective, BreakpointFlexAlignXxsDirective, BreakpointFlexGtXlDirective, BreakpointFlexLtXsDirective, BreakpointFlexXxlDirective, BreakpointFlexXxsDirective, BreakpointHideGtXlDirective, BreakpointHideLtXsDirective, BreakpointHideXxlDirective, BreakpointHideXxsDirective, BreakpointImgSrcGtXlDirective, BreakpointImgSrcLtXsDirective, BreakpointImgSrcXxlDirective, BreakpointImgSrcXxsDirective, BreakpointLayoutGtXlDirective, BreakpointLayoutLtXsDirective, BreakpointLayoutXxlDirective, BreakpointLayoutXxsDirective, BreakpointOffsetGtXlDirective, BreakpointOffsetLtXsDirective, BreakpointOffsetXxlDirective, BreakpointOffsetXxsDirective, BreakpointOrderGtXlDirective, BreakpointOrderLtXsDirective, BreakpointOrderXxlDirective, BreakpointOrderXxsDirective, BreakpointShowGtXlDirective, BreakpointShowLtXsDirective, BreakpointShowXxlDirective, BreakpointShowXxsDirective, BreakpointStyleGtXlDirective, BreakpointStyleLtXsDirective, BreakpointStyleXxlDirective, BreakpointStyleXxsDirective, CELOSNEXT_BREAKPOINTS, CelosNextBreakPointsProvider, DmgHeaderComponent, DmgLayoutModule };
//# sourceMappingURL=celosnext-material-theme.mjs.map
