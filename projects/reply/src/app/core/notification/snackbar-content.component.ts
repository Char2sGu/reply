import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'rpl-snackbar-content',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './snackbar-content.component.html',
  styleUrls: ['./snackbar-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarContentComponent {
  context = inject<SnackbarContentContext>(MAT_SNACK_BAR_DATA);
  snackbarRef = inject(MatSnackBarRef);
}

export interface SnackbarContentContext {
  message: string;
  action?: string;
}
