import * as i0 from '@angular/core';
import { Directive, Component, Input, NgModule, APP_INITIALIZER } from '@angular/core';
import { LayoutDirective, ShowHideDirective, ClassDirective, StyleDirective, ImgSrcDirective, FlexDirective, FlexOrderDirective, FlexOffsetDirective, FlexAlignDirective, FlexFillDirective, BREAKPOINT } from '@angular/flex-layout';
import * as i1 from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const layoutInput$3 = ['fxLayout.xxl'];
const hideInput$3 = ['fxHide.xxl'];
const showInput$3 = ['fxShow.xxl'];
const classInput$3 = ['ngClass.xxl'];
const styleInput$3 = ['ngStyle.xxl'];
const imgInput$3 = ['imgSrc.xxl'];
const flexInput$3 = ['fxFlex.xxl'];
const orderInput$3 = ['fxFlexOrder.xxl'];
const offsetInput$3 = ['fxFlexOffset.xxl'];
const flexAlignInput$3 = ['fxFlexAlign.xxl'];
const fillInput$3 = ['fxFlexFill.xxl', 'fxFill.xxl'];
class BreakpointLayoutXxlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput$3;
    }
}
BreakpointLayoutXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutXxlDirective, selector: "[fxLayout.xxl]", inputs: { "fxLayout.xxl": "fxLayout.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxl]`,
                    inputs: layoutInput$3
                }]
        }] });
class BreakpointHideXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput$3;
    }
}
BreakpointHideXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideXxlDirective, selector: "[fxHide.xxl]", inputs: { "fxHide.xxl": "fxHide.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxl]`,
                    inputs: hideInput$3
                }]
        }] });
class BreakpointShowXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput$3;
    }
}
BreakpointShowXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowXxlDirective, selector: "[fxShow.xxl]", inputs: { "fxShow.xxl": "fxShow.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxl]`,
                    inputs: showInput$3
                }]
        }] });
class BreakpointClassXxlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput$3;
    }
}
BreakpointClassXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassXxlDirective, selector: "[ngClass.xxl]", inputs: { "ngClass.xxl": "ngClass.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxl]`,
                    inputs: classInput$3
                }]
        }] });
class BreakpointStyleXxlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput$3;
    }
}
BreakpointStyleXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleXxlDirective, selector: "[ngStyle.xxl]", inputs: { "ngStyle.xxl": "ngStyle.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxl]`,
                    inputs: styleInput$3
                }]
        }] });
class BreakpointImgSrcXxlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput$3;
    }
}
BreakpointImgSrcXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcXxlDirective, selector: "[imgSrc.xxl]", inputs: { "imgSrc.xxl": "imgSrc.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxl]`,
                    inputs: imgInput$3
                }]
        }] });
class BreakpointFlexXxlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput$3;
    }
}
BreakpointFlexXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexXxlDirective, selector: "[fxFlex.xxl]", inputs: { "fxFlex.xxl": "fxFlex.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxl]`,
                    inputs: flexInput$3
                }]
        }] });
class BreakpointOrderXxlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput$3;
    }
}
BreakpointOrderXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderXxlDirective, selector: "[fxFlexOrder.xxl]", inputs: { "fxFlexOrder.xxl": "fxFlexOrder.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxl]`,
                    inputs: orderInput$3
                }]
        }] });
class BreakpointOffsetXxlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput$3;
    }
}
BreakpointOffsetXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetXxlDirective, selector: "[fxFlexOffset.xxl]", inputs: { "fxFlexOffset.xxl": "fxFlexOffset.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxl]`,
                    inputs: offsetInput$3
                }]
        }] });
class BreakpointFlexAlignXxlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput$3;
    }
}
BreakpointFlexAlignXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignXxlDirective, selector: "[fxFlexAlign.xxl]", inputs: { "fxFlexAlign.xxl": "fxFlexAlign.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxl]`,
                    inputs: flexAlignInput$3
                }]
        }] });
class BreakpointFillXxlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput$3;
    }
}
BreakpointFillXxlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillXxlDirective, selector: "[fxFlexFill.xxl]", inputs: { "fxFlexFill.xxl": "fxFlexFill.xxl", "fxFill.xxl": "fxFill.xxl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxl]`,
                    inputs: fillInput$3
                }]
        }] });

const layoutInput$2 = ['fxLayout.xxs'];
const hideInput$2 = ['fxHide.xxs'];
const showInput$2 = ['fxShow.xxs'];
const classInput$2 = ['ngClass.xxs'];
const styleInput$2 = ['ngStyle.xxs'];
const imgInput$2 = ['imgSrc.xxs'];
const flexInput$2 = ['fxFlex.xxs'];
const orderInput$2 = ['fxFlexOrder.xxs'];
const offsetInput$2 = ['fxFlexOffset.xxs'];
const flexAlignInput$2 = ['fxFlexAlign.xxs'];
const fillInput$2 = ['fxFlexFill.xxs', 'fxFill.xxs'];
class BreakpointLayoutXxsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput$2;
    }
}
BreakpointLayoutXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutXxsDirective, selector: "[fxLayout.xxs]", inputs: { "fxLayout.xxs": "fxLayout.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.xxs]`,
                    inputs: layoutInput$2
                }]
        }] });
class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput$2;
    }
}
BreakpointHideXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideXxsDirective, selector: "[fxHide.xxs]", inputs: { "fxHide.xxs": "fxHide.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.xxs]`,
                    inputs: hideInput$2
                }]
        }] });
class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput$2;
    }
}
BreakpointShowXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowXxsDirective, selector: "[fxShow.xxs]", inputs: { "fxShow.xxs": "fxShow.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.xxs]`,
                    inputs: showInput$2
                }]
        }] });
class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput$2;
    }
}
BreakpointClassXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassXxsDirective, selector: "[ngClass.xxs]", inputs: { "ngClass.xxs": "ngClass.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.xxs]`,
                    inputs: classInput$2
                }]
        }] });
class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput$2;
    }
}
BreakpointStyleXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleXxsDirective, selector: "[ngStyle.xxs]", inputs: { "ngStyle.xxs": "ngStyle.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.xxs]`,
                    inputs: styleInput$2
                }]
        }] });
class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput$2;
    }
}
BreakpointImgSrcXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcXxsDirective, selector: "[imgSrc.xxs]", inputs: { "imgSrc.xxs": "imgSrc.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.xxs]`,
                    inputs: imgInput$2
                }]
        }] });
class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput$2;
    }
}
BreakpointFlexXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexXxsDirective, selector: "[fxFlex.xxs]", inputs: { "fxFlex.xxs": "fxFlex.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.xxs]`,
                    inputs: flexInput$2
                }]
        }] });
class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput$2;
    }
}
BreakpointOrderXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderXxsDirective, selector: "[fxFlexOrder.xxs]", inputs: { "fxFlexOrder.xxs": "fxFlexOrder.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.xxs]`,
                    inputs: orderInput$2
                }]
        }] });
class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput$2;
    }
}
BreakpointOffsetXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetXxsDirective, selector: "[fxFlexOffset.xxs]", inputs: { "fxFlexOffset.xxs": "fxFlexOffset.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.xxs]`,
                    inputs: offsetInput$2
                }]
        }] });
class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput$2;
    }
}
BreakpointFlexAlignXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignXxsDirective, selector: "[fxFlexAlign.xxs]", inputs: { "fxFlexAlign.xxs": "fxFlexAlign.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.xxs]`,
                    inputs: flexAlignInput$2
                }]
        }] });
class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput$2;
    }
}
BreakpointFillXxsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillXxsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillXxsDirective, selector: "[fxFlexFill.xxs]", inputs: { "fxFlexFill.xxs": "fxFlexFill.xxs", "fxFill.xxs": "fxFill.xxs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillXxsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.xxs]`,
                    inputs: fillInput$2
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
        mediaQuery: 'screen and (max-width: 1800.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xxl',
        suffix: 'xxlScreen',
        mediaQuery: 'screen and (min-width: 1801px)',
        overlapping: false,
        priority: 1001
    }];
const CelosNextBreakPointsProvider = {
    provide: BREAKPOINT,
    useValue: CELOSNEXT_BREAKPOINTS,
    multi: true
};

const layoutInput$1 = ['fxLayout.lt-xs'];
const hideInput$1 = ['fxHide.lt-xs'];
const showInput$1 = ['fxShow.lt-xs'];
const classInput$1 = ['ngClass.lt-xs'];
const styleInput$1 = ['ngStyle.lt-xs'];
const imgInput$1 = ['imgSrc.lt-xs'];
const flexInput$1 = ['fxFlex.lt-xs'];
const orderInput$1 = ['fxFlexOrder.lt-xs'];
const offsetInput$1 = ['fxFlexOffset.lt-xs'];
const flexAlignInput$1 = ['fxFlexAlign.lt-xs'];
const fillInput$1 = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
class BreakpointLayoutLtXsDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput$1;
    }
}
BreakpointLayoutLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutLtXsDirective, selector: "[fxLayout.lt-xs]", inputs: { "fxLayout.lt-xs": "fxLayout.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.lt-xs]`,
                    inputs: layoutInput$1
                }]
        }] });
class BreakpointHideLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput$1;
    }
}
BreakpointHideLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideLtXsDirective, selector: "[fxHide.lt-xs]", inputs: { "fxHide.lt-xs": "fxHide.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.lt-xs]`,
                    inputs: hideInput$1
                }]
        }] });
class BreakpointShowLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput$1;
    }
}
BreakpointShowLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowLtXsDirective, selector: "[fxShow.lt-xs]", inputs: { "fxShow.lt-xs": "fxShow.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.lt-xs]`,
                    inputs: showInput$1
                }]
        }] });
class BreakpointClassLtXsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput$1;
    }
}
BreakpointClassLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassLtXsDirective, selector: "[ngClass.lt-xs]", inputs: { "ngClass.lt-xs": "ngClass.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.lt-xs]`,
                    inputs: classInput$1
                }]
        }] });
class BreakpointStyleLtXsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput$1;
    }
}
BreakpointStyleLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleLtXsDirective, selector: "[ngStyle.lt-xs]", inputs: { "ngStyle.lt-xs": "ngStyle.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.lt-xs]`,
                    inputs: styleInput$1
                }]
        }] });
class BreakpointImgSrcLtXsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput$1;
    }
}
BreakpointImgSrcLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcLtXsDirective, selector: "[imgSrc.lt-xs]", inputs: { "imgSrc.lt-xs": "imgSrc.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.lt-xs]`,
                    inputs: imgInput$1
                }]
        }] });
class BreakpointFlexLtXsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput$1;
    }
}
BreakpointFlexLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexLtXsDirective, selector: "[fxFlex.lt-xs]", inputs: { "fxFlex.lt-xs": "fxFlex.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.lt-xs]`,
                    inputs: flexInput$1
                }]
        }] });
class BreakpointOrderLtXsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput$1;
    }
}
BreakpointOrderLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderLtXsDirective, selector: "[fxFlexOrder.lt-xs]", inputs: { "fxFlexOrder.lt-xs": "fxFlexOrder.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.lt-xs]`,
                    inputs: orderInput$1
                }]
        }] });
class BreakpointOffsetLtXsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput$1;
    }
}
BreakpointOffsetLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetLtXsDirective, selector: "[fxFlexOffset.lt-xs]", inputs: { "fxFlexOffset.lt-xs": "fxFlexOffset.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.lt-xs]`,
                    inputs: offsetInput$1
                }]
        }] });
class BreakpointFlexAlignLtXsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput$1;
    }
}
BreakpointFlexAlignLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignLtXsDirective, selector: "[fxFlexAlign.lt-xs]", inputs: { "fxFlexAlign.lt-xs": "fxFlexAlign.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.lt-xs]`,
                    inputs: flexAlignInput$1
                }]
        }] });
class BreakpointFillLtXsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput$1;
    }
}
BreakpointFillLtXsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillLtXsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillLtXsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillLtXsDirective, selector: "[fxFlexFill.lt-xs]", inputs: { "fxFlexFill.lt-xs": "fxFlexFill.lt-xs", "fxFill.lt-xs": "fxFill.lt-xs" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillLtXsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.lt-xs]`,
                    inputs: fillInput$1
                }]
        }] });

const layoutInput = ['fxLayout.gt-xl'];
const hideInput = ['fxHide.gt-xl'];
const showInput = ['fxShow.gt-xl'];
const classInput = ['ngClass.gt-xl'];
const styleInput = ['ngStyle.gt-xl'];
const imgInput = ['imgSrc.gt-xl'];
const flexInput = ['fxFlex.gt-xl'];
const orderInput = ['fxFlexOrder.gt-xl'];
const offsetInput = ['fxFlexOffset.gt-xl'];
const flexAlignInput = ['fxFlexAlign.gt-xl'];
const fillInput = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
class BreakpointLayoutGtXlDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = layoutInput;
    }
}
BreakpointLayoutGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointLayoutGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointLayoutGtXlDirective, selector: "[fxLayout.gt-xl]", inputs: { "fxLayout.gt-xl": "fxLayout.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointLayoutGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxLayout.gt-xl]`,
                    inputs: layoutInput
                }]
        }] });
class BreakpointHideGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInput;
    }
}
BreakpointHideGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointHideGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointHideGtXlDirective, selector: "[fxHide.gt-xl]", inputs: { "fxHide.gt-xl": "fxHide.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointHideGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxHide.gt-xl]`,
                    inputs: hideInput
                }]
        }] });
class BreakpointShowGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInput;
    }
}
BreakpointShowGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointShowGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointShowGtXlDirective, selector: "[fxShow.gt-xl]", inputs: { "fxShow.gt-xl": "fxShow.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointShowGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxShow.gt-xl]`,
                    inputs: showInput
                }]
        }] });
class BreakpointClassGtXlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInput;
    }
}
BreakpointClassGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointClassGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointClassGtXlDirective, selector: "[ngClass.gt-xl]", inputs: { "ngClass.gt-xl": "ngClass.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointClassGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngClass.gt-xl]`,
                    inputs: classInput
                }]
        }] });
class BreakpointStyleGtXlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInput;
    }
}
BreakpointStyleGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointStyleGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointStyleGtXlDirective, selector: "[ngStyle.gt-xl]", inputs: { "ngStyle.gt-xl": "ngStyle.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointStyleGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[ngStyle.gt-xl]`,
                    inputs: styleInput
                }]
        }] });
class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInput;
    }
}
BreakpointImgSrcGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointImgSrcGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointImgSrcGtXlDirective, selector: "[imgSrc.gt-xl]", inputs: { "imgSrc.gt-xl": "imgSrc.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointImgSrcGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[imgSrc.gt-xl]`,
                    inputs: imgInput
                }]
        }] });
class BreakpointFlexGtXlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInput;
    }
}
BreakpointFlexGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexGtXlDirective, selector: "[fxFlex.gt-xl]", inputs: { "fxFlex.gt-xl": "fxFlex.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlex.gt-xl]`,
                    inputs: flexInput
                }]
        }] });
class BreakpointOrderGtXlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInput;
    }
}
BreakpointOrderGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOrderGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOrderGtXlDirective, selector: "[fxFlexOrder.gt-xl]", inputs: { "fxFlexOrder.gt-xl": "fxFlexOrder.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOrderGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOrder.gt-xl]`,
                    inputs: orderInput
                }]
        }] });
class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInput;
    }
}
BreakpointOffsetGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointOffsetGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointOffsetGtXlDirective, selector: "[fxFlexOffset.gt-xl]", inputs: { "fxFlexOffset.gt-xl": "fxFlexOffset.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointOffsetGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexOffset.gt-xl]`,
                    inputs: offsetInput
                }]
        }] });
class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInput;
    }
}
BreakpointFlexAlignGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFlexAlignGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFlexAlignGtXlDirective, selector: "[fxFlexAlign.gt-xl]", inputs: { "fxFlexAlign.gt-xl": "fxFlexAlign.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFlexAlignGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexAlign.gt-xl]`,
                    inputs: flexAlignInput
                }]
        }] });
class BreakpointFillGtXlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInput;
    }
}
BreakpointFillGtXlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillGtXlDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BreakpointFillGtXlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.2", type: BreakpointFillGtXlDirective, selector: "[fxFlexFill.gt-xl]", inputs: { "fxFlexFill.gt-xl": "fxFlexFill.gt-xl", "fxFill.gt-xl": "fxFill.gt-xl" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: BreakpointFillGtXlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[fxFlexFill.gt-xl]`,
                    inputs: fillInput
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
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
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
DmgHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgHeaderComponent, deps: [{ token: i1.ActivatedRoute }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Component });
DmgHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.2", type: DmgHeaderComponent, selector: "dmg-header", inputs: { includeLayout: "includeLayout" }, ngImport: i0, template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:700;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dmg-header', template: "<div>\n  <div class=\"headline\">\n    <div class=\"header\">{{header}}</div>\n    <div class=\"subheader\">{{subheader}}</div>\n  </div>\n  <hr />\n  <div [class]=\"{'celos-layout' : includeLayout}\">\n    <ng-content></ng-content>\n  </div>\n</div>\n", styles: [".headline{margin-left:35px}.header{font-size:32px;font-weight:700;margin-top:28px}.subheader{color:#9e9e9e;font-size:24px;font-weight:600;margin:2px 0}hr{border:none;border-top:1px solid black;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ActivatedRoute }, { type: i1.Router }]; }, propDecorators: { includeLayout: [{
                type: Input
            }] } });

const all = [
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
];
class DmgLayoutModule {
}
DmgLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DmgLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgLayoutModule, declarations: [BreakpointLayoutXxlDirective,
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
DmgLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgLayoutModule, providers: [
        CelosNextBreakPointsProvider
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: DmgLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: all,
                    exports: all,
                    providers: [
                        CelosNextBreakPointsProvider
                    ]
                }]
        }] });

function setHoverClass() {
    const keep_ms = 1000;
    const touchpoints = [];
    function registerTouch(e) {
        const touch = e.touches[0] || e.changedTouches[0];
        const point = { x: touch.pageX, y: touch.pageY };
        touchpoints.push(point);
        setTimeout(function () {
            touchpoints.splice(touchpoints.indexOf(point), 1);
        }, keep_ms);
        if (e.type === 'touchend') {
            document.addEventListener('mouseover', handleMouseEvent, true);
        }
        else {
            document.body.classList.add('no-hover');
        }
    }
    function handleMouseEvent(e) {
        for (const i in touchpoints) {
            if (Math.abs(touchpoints[i].x - e.pageX) < 2 && Math.abs(touchpoints[i].y - e.pageY) < 2) {
                e.triggeredByTouch = true;
                return;
            }
        }
        document.removeEventListener('mouseover', handleMouseEvent, true);
        document.body.classList.remove('no-hover');
    }
    return () => {
        document.addEventListener('touchstart', registerTouch, true);
        document.addEventListener('touchend', registerTouch, true);
    };
}
class HoverControllerModule {
}
HoverControllerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
HoverControllerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule });
HoverControllerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: setHoverClass,
            multi: true
        }
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.2", ngImport: i0, type: HoverControllerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        {
                            provide: APP_INITIALIZER,
                            useFactory: setHoverClass,
                            multi: true
                        }
                    ]
                }]
        }] });

/*
 * Public API Surface of material-theme
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BreakpointClassGtXlDirective, BreakpointClassLtXsDirective, BreakpointClassXxlDirective, BreakpointClassXxsDirective, BreakpointFillGtXlDirective, BreakpointFillLtXsDirective, BreakpointFillXxlDirective, BreakpointFillXxsDirective, BreakpointFlexAlignGtXlDirective, BreakpointFlexAlignLtXsDirective, BreakpointFlexAlignXxlDirective, BreakpointFlexAlignXxsDirective, BreakpointFlexGtXlDirective, BreakpointFlexLtXsDirective, BreakpointFlexXxlDirective, BreakpointFlexXxsDirective, BreakpointHideGtXlDirective, BreakpointHideLtXsDirective, BreakpointHideXxlDirective, BreakpointHideXxsDirective, BreakpointImgSrcGtXlDirective, BreakpointImgSrcLtXsDirective, BreakpointImgSrcXxlDirective, BreakpointImgSrcXxsDirective, BreakpointLayoutGtXlDirective, BreakpointLayoutLtXsDirective, BreakpointLayoutXxlDirective, BreakpointLayoutXxsDirective, BreakpointOffsetGtXlDirective, BreakpointOffsetLtXsDirective, BreakpointOffsetXxlDirective, BreakpointOffsetXxsDirective, BreakpointOrderGtXlDirective, BreakpointOrderLtXsDirective, BreakpointOrderXxlDirective, BreakpointOrderXxsDirective, BreakpointShowGtXlDirective, BreakpointShowLtXsDirective, BreakpointShowXxlDirective, BreakpointShowXxsDirective, BreakpointStyleGtXlDirective, BreakpointStyleLtXsDirective, BreakpointStyleXxlDirective, BreakpointStyleXxsDirective, CELOSNEXT_BREAKPOINTS, CelosNextBreakPointsProvider, DmgHeaderComponent, DmgLayoutModule, HoverControllerModule, setHoverClass };
//# sourceMappingURL=celosnext-material-theme.mjs.map
