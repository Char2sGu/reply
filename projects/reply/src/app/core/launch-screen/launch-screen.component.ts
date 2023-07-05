import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rpl-launch-screen',
  templateUrl: './launch-screen.component.html',
  styleUrls: ['./launch-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchScreenComponent {}
