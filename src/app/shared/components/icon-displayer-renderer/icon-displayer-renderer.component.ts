import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
export interface IconDisplayerRendererParams extends ICellRendererParams {
  icon: IconNamesEnum;
}
@Component({
  selector: 'app-icon-displayer-renderer',
  templateUrl: './icon-displayer-renderer.component.html',
  styleUrls: ['./icon-displayer-renderer.component.scss'],
})
export class IconDisplayerRendererComponent
  implements ICellRendererAngularComp
{
  @Input() iconToDisplay!: IconNamesEnum;
  public iconNames = IconNamesEnum;

  agInit(params: IconDisplayerRendererParams): void {
    this.iconToDisplay = params.icon;
  }

  refresh(params: IconDisplayerRendererParams): boolean {
    this.iconToDisplay = params.icon;
    return true;
  }
}
