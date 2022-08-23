import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class DmgHeaderComponent implements OnInit {
    private route;
    private router;
    includeLayout: boolean;
    header: string;
    subheader: string;
    constructor(route: ActivatedRoute, router: Router);
    ngOnInit(): void;
    private setHeadings;
    static ɵfac: i0.ɵɵFactoryDeclaration<DmgHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DmgHeaderComponent, "dmg-header", never, { "includeLayout": "includeLayout"; }, {}, never, ["*"]>;
}
