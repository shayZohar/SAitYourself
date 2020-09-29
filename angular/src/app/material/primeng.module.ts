import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import {GalleriaModule} from 'primeng/galleria';
import { InputSwitchModule } from 'primeng/inputswitch';
import {AutoCompleteModule} from 'primeng/autocomplete';

/**
 * Ng module add-on to help with styling instead of bootstrap
 */
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    FieldsetModule,
    AccordionModule,
    GalleriaModule,
    AutoCompleteModule,
    DropdownModule,
    InputSwitchModule,
  ],
  exports: [
    DataViewModule,
    PanelModule,
    DialogModule,
    FieldsetModule,
    DropdownModule,
    AccordionModule,
    GalleriaModule,
    AutoCompleteModule,
    InputSwitchModule,
  ]
})
export class PrimeNgModule { }
