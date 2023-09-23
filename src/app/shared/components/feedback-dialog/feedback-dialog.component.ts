import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Sentry from '@sentry/browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {
  public formGroup: FormGroup = this.fb.group({
    name: [],
    email: [],
    feedback: ['', Validators.required],
    attachment: [],
  });
  @Output() closeDialog = new EventEmitter<void>();
  constructor(private fb: FormBuilder, private alertService: ToastrService) {}
  public async sendFeedback() {
    const id = +new Date();
    const attachment = this.formGroup.value.attachment;
    if (!!attachment) {
      await new Promise((resolve, reject) => {
        try {
          const extension = '.' + attachment.type.split('/').slice(-1);
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileContentArrayBuffer: ArrayBuffer = e.target.result;
            const fileContentUint8Array = new Uint8Array(
              fileContentArrayBuffer
            );
            Sentry.configureScope((scope) => {
              scope.addAttachment({
                filename: id + extension,
                data: fileContentUint8Array,
                contentType: attachment.type,
              });
            });
            resolve(true);
          };
          reader.readAsArrayBuffer(attachment);
        } catch (error) {
          this.alertService.error('Uuuups. Something wrong happened.');
          reject(error);
        }
      });
    }
    const eventId = Sentry.captureMessage('User Feedback ' + id);

    const userFeedback = {
      event_id: eventId,
      name: this.formGroup.value.name,
      email: this.formGroup.value.email,
      comments: this.formGroup.value.feedback,
    };
    this.alertService.success('The feedback has been sent correctly!');
    Sentry.captureUserFeedback(userFeedback);
    this.closeDialog.emit();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.formGroup.patchValue({
      attachment: file,
    });
  }
}
