import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [],
  imports: [CommonModule, MatCardModule, MatRadioModule, MatTooltipModule, MatSnackBarModule, MatTabsModule, MatSelectModule],
  exports: [MatCardModule, MatRadioModule, MatTooltipModule, MatSnackBarModule, MatTabsModule, MatSelectModule]
})
export class MaterialModule { }
