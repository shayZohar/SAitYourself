import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpMessagesService } from '@/core/http/http-messages.service';
import { IMessage } from '@/shared/interfaces/IMessage';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sh-new-massage',
  templateUrl: './new-massage.component.html',
  styleUrls: ['./new-massage.component.scss']
})
export class NewMassageComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewMassageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMessage,
    private httpMessage: HttpMessagesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  /**
   * Closes new massage component closes new message component
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Saves and send the new massage
   */
  save() {
    // save new message function
    this.httpMessage.sendMessage(this.data).subscribe(
      data => {
        this.snackBar.open('Message sent successfuly!', '', {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "" , { duration: 3000});
      }
    );
    this.dialogRef.close();
  }
}
