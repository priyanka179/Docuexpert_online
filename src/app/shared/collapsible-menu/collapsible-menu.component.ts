import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-collapsible-menu',
  templateUrl: './collapsible-menu.component.html',
  styleUrls: ['./collapsible-menu.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openCloseAnimation', [
      state('open', style({ height: '*' })),
      state('closed', style({ height: '0px' })),
      transition('* => closed', animate('0.2s ease-out')),
      transition('* => open', animate('0.3s ease-out')),
    ]),
  ]
})
export class CollapsibleMenuComponent implements OnInit {

  expand: boolean = false;
  @Output()
  onChangeCheckbox = new EventEmitter<string>();

  @Input()
  featureData?: any;

  @Input()
  disabled: boolean = false;

  @Input()
  statusTable: boolean = false;

  constructor(private _common: CommonnService, private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onCheckboxChecked(feature: string, isChecked:boolean) {
    console.log(feature,isChecked);
    
    this.onChangeCheckbox.emit(feature);
    if (isChecked === true) {
      this._common.$featureName.next(feature);
      // this._changeDetectionRef.detectChanges();
    } else {
      this._common.$featureName.next("");
      localStorage.removeItem('sidebaractivefeature');
      // this._changeDetectionRef.detectChanges();
    }
  }

}
