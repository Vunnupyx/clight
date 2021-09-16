import { Directive, NgModule } from '@angular/core';
import { ShowHideDirective, ClassDirective, StyleDirective, ImgSrcDirective, FlexDirective, FlexOrderDirective, FlexOffsetDirective, FlexAlignDirective, FlexFillDirective, BREAKPOINT } from '@angular/flex-layout';

const hideInputs = ['fxHide.xxl'];
const showInputs = ['fxShow.xxl'];
const classInputs = ['ngClass.xxl'];
const styleInputs = ['ngStyle.xxl'];
const imgInputs = ['imgSrc.xxl'];
const flexInputs = ['fxFlex.xxl'];
const orderInputs = ['fxFlexOrder.xxl'];
const offsetInputs = ['fxFlexOffset.xxl'];
const flexAlignInputs = ['fxFlexAlign.xxl'];
const fillInputs = ['fxFlexFill.xxl', 'fxFill.xxl'];
class BreakpointHideXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs;
    }
}
BreakpointHideXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxHide.xxl]`, inputs: hideInputs
            },] }
];
class BreakpointShowXxlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs;
    }
}
BreakpointShowXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxShow.xxl]`, inputs: showInputs
            },] }
];
class BreakpointClassXxlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs;
    }
}
BreakpointClassXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngClass.xxl]`, inputs: classInputs
            },] }
];
class BreakpointStyleXxlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs;
    }
}
BreakpointStyleXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngStyle.xxl]`, inputs: styleInputs
            },] }
];
class BreakpointImgSrcXxlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs;
    }
}
BreakpointImgSrcXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[imgSrc.xxl]`, inputs: imgInputs
            },] }
];
class BreakpointFlexXxlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs;
    }
}
BreakpointFlexXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlex.xxl]`, inputs: flexInputs
            },] }
];
class BreakpointOrderXxlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs;
    }
}
BreakpointOrderXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOrder.xxl]`, inputs: orderInputs
            },] }
];
class BreakpointOffsetXxlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs;
    }
}
BreakpointOffsetXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOffset.xxl]`, inputs: offsetInputs
            },] }
];
class BreakpointFlexAlignXxlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs;
    }
}
BreakpointFlexAlignXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexAlign.xxl]`, inputs: flexAlignInputs
            },] }
];
class BreakpointFillXxlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs;
    }
}
BreakpointFillXxlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexFill.xxl]`, inputs: fillInputs
            },] }
];

const hideInputs$1 = ['fxHide.xxs'];
const showInputs$1 = ['fxShow.xxs'];
const classInputs$1 = ['ngClass.xxs'];
const styleInputs$1 = ['ngStyle.xxs'];
const imgInputs$1 = ['imgSrc.xxs'];
const flexInputs$1 = ['fxFlex.xxs'];
const orderInputs$1 = ['fxFlexOrder.xxs'];
const offsetInputs$1 = ['fxFlexOffset.xxs'];
const flexAlignInputs$1 = ['fxFlexAlign.xxs'];
const fillInputs$1 = ['fxFlexFill.xxs', 'fxFill.xxs'];
class BreakpointHideXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$1;
    }
}
BreakpointHideXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxHide.xxs]`, inputs: hideInputs$1
            },] }
];
class BreakpointShowXxsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$1;
    }
}
BreakpointShowXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxShow.xxs]`, inputs: showInputs$1
            },] }
];
class BreakpointClassXxsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$1;
    }
}
BreakpointClassXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngClass.xxs]`, inputs: classInputs$1
            },] }
];
class BreakpointStyleXxsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$1;
    }
}
BreakpointStyleXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngStyle.xxs]`, inputs: styleInputs$1
            },] }
];
class BreakpointImgSrcXxsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$1;
    }
}
BreakpointImgSrcXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[imgSrc.xxs]`, inputs: imgInputs$1
            },] }
];
class BreakpointFlexXxsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$1;
    }
}
BreakpointFlexXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlex.xxs]`, inputs: flexInputs$1
            },] }
];
class BreakpointOrderXxsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$1;
    }
}
BreakpointOrderXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOrder.xxs]`, inputs: orderInputs$1
            },] }
];
class BreakpointOffsetXxsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$1;
    }
}
BreakpointOffsetXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOffset.xxs]`, inputs: offsetInputs$1
            },] }
];
class BreakpointFlexAlignXxsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$1;
    }
}
BreakpointFlexAlignXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexAlign.xxs]`, inputs: flexAlignInputs$1
            },] }
];
class BreakpointFillXxsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$1;
    }
}
BreakpointFillXxsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexFill.xxs]`, inputs: fillInputs$1
            },] }
];

const CELOSNEXT_BREAKPOINTS = [{
        alias: 'xxs',
        suffix: 'xxsScreen',
        mediaQuery: 'screen and (max-width: 479.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xs',
        suffix: 'xsScreen',
        mediaQuery: 'screen and (min-width: 480px) and (max-width: 575.9px)',
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
        mediaQuery: 'screen and (max-width: 575.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'sm',
        suffix: 'smScreen',
        mediaQuery: 'screen and (min-width: 576px) and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-sm',
        suffix: 'gtSmScreen',
        mediaQuery: 'screen and (min-width: 576px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-sm',
        suffix: 'ltSmScreen',
        mediaQuery: 'screen and (max-width: 767.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'md',
        suffix: 'mdScreen',
        mediaQuery: 'screen and (min-width: 768px) and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-md',
        suffix: 'gtMdScreen',
        mediaQuery: 'screen and (min-width: 768px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-md',
        suffix: 'ltMdScreen',
        mediaQuery: 'screen and (max-width: 991.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lg',
        suffix: 'lgScreen',
        mediaQuery: 'screen and (min-width: 992px) and (max-width: 1280.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-lg',
        suffix: 'gtLgScreen',
        mediaQuery: 'screen and (min-width: 992px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-lg',
        suffix: 'ltLgScreen',
        mediaQuery: 'screen and (max-width: 1280.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xl',
        suffix: 'xlScreen',
        mediaQuery: 'screen and (min-width: 1281px) and (max-width: 1919.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'gt-xl',
        suffix: 'gtXlScreen',
        mediaQuery: 'screen and (min-width: 1281px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'lt-xl',
        suffix: 'ltXlScreen',
        mediaQuery: 'screen and (max-width: 1919.9px)',
        overlapping: false,
        priority: 1001
    }, {
        alias: 'xxl',
        suffix: 'xxlScreen',
        mediaQuery: 'screen and (min-width: 1920px)',
        overlapping: false,
        priority: 1001
    }];
const CelosNextBreakPointsProvider = {
    provide: BREAKPOINT,
    useValue: CELOSNEXT_BREAKPOINTS,
    multi: true
};

const hideInputs$2 = ['fxHide.lt-xs'];
const showInputs$2 = ['fxShow.lt-xs'];
const classInputs$2 = ['ngClass.lt-xs'];
const styleInputs$2 = ['ngStyle.lt-xs'];
const imgInputs$2 = ['imgSrc.lt-xs'];
const flexInputs$2 = ['fxFlex.lt-xs'];
const orderInputs$2 = ['fxFlexOrder.lt-xs'];
const offsetInputs$2 = ['fxFlexOffset.lt-xs'];
const flexAlignInputs$2 = ['fxFlexAlign.lt-xs'];
const fillInputs$2 = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
class BreakpointHideLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$2;
    }
}
BreakpointHideLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxHide.lt-xs]`, inputs: hideInputs$2
            },] }
];
class BreakpointShowLtXsDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$2;
    }
}
BreakpointShowLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxShow.lt-xs]`, inputs: showInputs$2
            },] }
];
class BreakpointClassLtXsDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$2;
    }
}
BreakpointClassLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngClass.lt-xs]`, inputs: classInputs$2
            },] }
];
class BreakpointStyleLtXsDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$2;
    }
}
BreakpointStyleLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngStyle.lt-xs]`, inputs: styleInputs$2
            },] }
];
class BreakpointImgSrcLtXsDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$2;
    }
}
BreakpointImgSrcLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[imgSrc.lt-xs]`, inputs: imgInputs$2
            },] }
];
class BreakpointFlexLtXsDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$2;
    }
}
BreakpointFlexLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlex.lt-xs]`, inputs: flexInputs$2
            },] }
];
class BreakpointOrderLtXsDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$2;
    }
}
BreakpointOrderLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOrder.lt-xs]`, inputs: orderInputs$2
            },] }
];
class BreakpointOffsetLtXsDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$2;
    }
}
BreakpointOffsetLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOffset.lt-xs]`, inputs: offsetInputs$2
            },] }
];
class BreakpointFlexAlignLtXsDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$2;
    }
}
BreakpointFlexAlignLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexAlign.lt-xs]`, inputs: flexAlignInputs$2
            },] }
];
class BreakpointFillLtXsDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$2;
    }
}
BreakpointFillLtXsDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexFill.lt-xs]`, inputs: fillInputs$2
            },] }
];

const hideInputs$3 = ['fxHide.gt-xl'];
const showInputs$3 = ['fxShow.gt-xl'];
const classInputs$3 = ['ngClass.gt-xl'];
const styleInputs$3 = ['ngStyle.gt-xl'];
const imgInputs$3 = ['imgSrc.gt-xl'];
const flexInputs$3 = ['fxFlex.gt-xl'];
const orderInputs$3 = ['fxFlexOrder.gt-xl'];
const offsetInputs$3 = ['fxFlexOffset.gt-xl'];
const flexAlignInputs$3 = ['fxFlexAlign.gt-xl'];
const fillInputs$3 = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
class BreakpointHideGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = hideInputs$3;
    }
}
BreakpointHideGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxHide.gt-xl]`, inputs: hideInputs$3
            },] }
];
class BreakpointShowGtXlDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = showInputs$3;
    }
}
BreakpointShowGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxShow.gt-xl]`, inputs: showInputs$3
            },] }
];
class BreakpointClassGtXlDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = classInputs$3;
    }
}
BreakpointClassGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngClass.gt-xl]`, inputs: classInputs$3
            },] }
];
class BreakpointStyleGtXlDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = styleInputs$3;
    }
}
BreakpointStyleGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[ngStyle.gt-xl]`, inputs: styleInputs$3
            },] }
];
class BreakpointImgSrcGtXlDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = imgInputs$3;
    }
}
BreakpointImgSrcGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[imgSrc.gt-xl]`, inputs: imgInputs$3
            },] }
];
class BreakpointFlexGtXlDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexInputs$3;
    }
}
BreakpointFlexGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlex.gt-xl]`, inputs: flexInputs$3
            },] }
];
class BreakpointOrderGtXlDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = orderInputs$3;
    }
}
BreakpointOrderGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOrder.gt-xl]`, inputs: orderInputs$3
            },] }
];
class BreakpointOffsetGtXlDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = offsetInputs$3;
    }
}
BreakpointOffsetGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexOffset.gt-xl]`, inputs: offsetInputs$3
            },] }
];
class BreakpointFlexAlignGtXlDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = flexAlignInputs$3;
    }
}
BreakpointFlexAlignGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexAlign.gt-xl]`, inputs: flexAlignInputs$3
            },] }
];
class BreakpointFillGtXlDirective extends FlexFillDirective {
    constructor() {
        super(...arguments);
        this.inputs = fillInputs$3;
    }
}
BreakpointFillGtXlDirective.decorators = [
    { type: Directive, args: [{
                selector: `[fxFlexFill.gt-xl]`, inputs: fillInputs$3
            },] }
];

class DmgLayoutModule {
}
DmgLayoutModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
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
                    BreakpointFillGtXlDirective,
                    BreakpointHideGtXlDirective,
                    BreakpointShowGtXlDirective,
                    BreakpointClassGtXlDirective,
                    BreakpointStyleGtXlDirective,
                    BreakpointImgSrcGtXlDirective,
                    BreakpointFlexGtXlDirective,
                    BreakpointOrderGtXlDirective,
                    BreakpointOffsetGtXlDirective,
                    BreakpointFlexAlignGtXlDirective
                ],
                exports: [
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
                    BreakpointFillGtXlDirective,
                    BreakpointHideGtXlDirective,
                    BreakpointShowGtXlDirective,
                    BreakpointClassGtXlDirective,
                    BreakpointStyleGtXlDirective,
                    BreakpointImgSrcGtXlDirective,
                    BreakpointFlexGtXlDirective,
                    BreakpointOrderGtXlDirective,
                    BreakpointOffsetGtXlDirective,
                    BreakpointFlexAlignGtXlDirective
                ],
                providers: [
                    CelosNextBreakPointsProvider
                ]
            },] }
];

/*
 * Public API Surface of material-theme
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BreakpointClassGtXlDirective, BreakpointClassLtXsDirective, BreakpointClassXxlDirective, BreakpointClassXxsDirective, BreakpointFillGtXlDirective, BreakpointFillLtXsDirective, BreakpointFillXxlDirective, BreakpointFillXxsDirective, BreakpointFlexAlignGtXlDirective, BreakpointFlexAlignLtXsDirective, BreakpointFlexAlignXxlDirective, BreakpointFlexAlignXxsDirective, BreakpointFlexGtXlDirective, BreakpointFlexLtXsDirective, BreakpointFlexXxlDirective, BreakpointFlexXxsDirective, BreakpointHideGtXlDirective, BreakpointHideLtXsDirective, BreakpointHideXxlDirective, BreakpointHideXxsDirective, BreakpointImgSrcGtXlDirective, BreakpointImgSrcLtXsDirective, BreakpointImgSrcXxlDirective, BreakpointImgSrcXxsDirective, BreakpointOffsetGtXlDirective, BreakpointOffsetLtXsDirective, BreakpointOffsetXxlDirective, BreakpointOffsetXxsDirective, BreakpointOrderGtXlDirective, BreakpointOrderLtXsDirective, BreakpointOrderXxlDirective, BreakpointOrderXxsDirective, BreakpointShowGtXlDirective, BreakpointShowLtXsDirective, BreakpointShowXxlDirective, BreakpointShowXxsDirective, BreakpointStyleGtXlDirective, BreakpointStyleLtXsDirective, BreakpointStyleXxlDirective, BreakpointStyleXxsDirective, CELOSNEXT_BREAKPOINTS, CelosNextBreakPointsProvider, DmgLayoutModule };
//# sourceMappingURL=material-theme.js.map
