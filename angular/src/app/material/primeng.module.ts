import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';

import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import {GalleriaModule} from 'primeng/galleria';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    FieldsetModule,
    DropdownModule,
    AccordionModule,
    GalleriaModule
  ],
  exports: [
    DataViewModule,
    PanelModule,
    DialogModule,
    FieldsetModule,
    DropdownModule,
    AccordionModule,
    GalleriaModule
  ]
})
export class PrimeNgModule { } // Tania
