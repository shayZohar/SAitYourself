import { IMessage } from "@/shared/interfaces/IMessage";

import { emptyMessage } from "@/shared/interfaces/IMessage";
import {
  IAppointment,
  emptyAppointment
} from "@/business/interfaces/iAppointment";
import { BusinessService } from "@/business/services/business.service";
import { IUser, emptyUser, ERole } from "@/user/interfaces/iuser";
import { IBusiness } from "@/business/interfaces/IBusiness";
import { AuthenticationService } from "@/core/authentication/authentication.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpBusinessService } from "@/core/http/http-businesses.service";
import { EventSettingsModel } from "@syncfusion/ej2-schedule";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ScheduleComponent,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService,
  ActionEventArgs,
  PopupOpenEventArgs,
  WorkHoursModel
} from "@syncfusion/ej2-angular-schedule";
import { HttpMessagesService } from "@/core/http/http-messages.service";
import { createElement } from "@syncfusion/ej2-base";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-business-appointment",
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService
  ],
  templateUrl: "./business-appointment.component.html",
  styleUrls: ["./business-appointment.component.scss"]
})
export class BusinessAppointmentComponent implements OnInit {
  appointmentDurationInMinutes: number;
  readOnly = true;
  display: boolean;
  ownerCanEdit = true;
  clientMode = false;
  currentBusiness: IBusiness;
  appointment = emptyAppointment();
  newApp = emptyAppointment();
  message = emptyMessage();
  resMessages: IMessage[];
  selectedMessage: IMessage;
  rendered = false;
  showScheduler = false;
  settings = "SiteSettings";
  selected = "";
  startLogoAnim = false;
  appointmentStartDate: Date = new Date();
  appointmentEndDate: Date = new Date();
  public data: object[];
  public clientList: any[] = [];
  public workWeekDays: number[] = [0, 1, 5];
  disabledDays: number[] = [];
  start: Date = new Date();
  end: Date = new Date();
  clientDate: Date = new Date();
  today: Date = new Date();
  isOwner: boolean;
  isClient: boolean;

  // initial schedular hours
  public scheduleHours: WorkHoursModel = {
    highlight: true,
    start: "08:00",
    end: "17:00"
  };

  // object of list for working days
  selectedDays: number[] = [];
  Days = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 }
  ];
  public selectedDate: Date = new Date();

  // this is the object that holds all the event on schedular
  public eventSettings: EventSettingsModel = {
    dataSource: this.data
  };

  @ViewChild("scheduleObj")
  public scheduleObj: ScheduleComponent;

  constructor(
    private authService: AuthenticationService,
    private businessService: HttpBusinessService,
    private bService: BusinessService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: HttpMessagesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const appkey = "appointment";
    const businessKey = "business";

    // getting business object from service
    this.currentBusiness = this.bService.CurrentBusiness;
    if (this.currentBusiness == null) {
      // if no business found in service. get it from resolver
      this.bService.changeCurrentBusiness(this.route.snapshot.data[businessKey]);
      this.currentBusiness = this.bService.CurrentBusiness;
    }
    // getting the appointment object from appoinement resolver
    // because it can be heavy object, we get it from resolver and then view it
    this.appointment = this.route.snapshot.data[appkey];
    this.bService.init();
    const user = this.authService.currentUserValue;
    // check if user is the owner
    this.isOwner =
      user.type !== ERole.Business ? false :
      this.currentBusiness.bOwner.includes(
        this.authService.currentUserValue.email
      );

      // check if user is a client of business
    this.isClient =   user.type !== ERole.User ? false :
    this.currentBusiness.bClient.includes(
      this.authService.currentUserValue.email);

    if (this.isOwner) {
      // check if owner can edit the page (no other owner of business is already connected)
      this.readOnly = !(this.ownerCanEdit = this.currentBusiness.ownerConnected);

    } else if ( this.isClient ) {
      this.clientMode = true;
    }
    // setting data of appointment schedular
    this.SetAppointmentProperties();
    this.workWeekDays = this.selectedDays = this.appointment.days;
    this.DisabledDaysCalculation();
    this.currentBusiness.bClient.forEach(element => {
      this.clientList.push(Object.assign({ text: element, value: element }));
    });
    // recieving appointment requests of clients
    this.messageService
      .getRecievedMessages(this.currentBusiness.bMail)
      .subscribe(
        data => {
          this.resMessages = data;
          this.resMessages = this.resMessages.filter(
            x => x.subJect === "Appointment"
          );
        },
        error => {
         this.snackBar.open(error, "" , {duration: 3000});
        }
      );

    setTimeout(() => (this.showScheduler = true), 200);
  }

  showDialog() {
    this.display = true;
  }

  /**
   * Deletes message request - deleting request after view it
   */
  DeleteMessageRequest() {
    this.messageService.removeMessage(this.selectedMessage.id).subscribe(
      data => {
        this.snackBar.open("Message request deleted successfuly!", "", {
          duration: 2000
        });
        this.resMessages = this.resMessages.filter(
          x => x.id !== this.selectedMessage.id
        );
        this.selectedMessage = null;
      },
      error => {
        this.snackBar.open(error, "" , {duration: 3000});
      }
    );
  }

  /**
   * Generates date
   * @param date generating a string of date from date object
   * @returns date string
   */
  GenerateDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }

  /**
   * Sends appointment message- sending message to client when an appointment had scheduled
   */
  SendAppointmentMessage() {
    this.message.recieverId = this.currentBusiness.bMail;
    this.message.senderId = this.authService.currentUserValue.email;
    this.message.messContent =
      "From: " +
      this.authService.currentUserValue.email +
      "\nDate: " +
      this.GenerateDate(this.clientDate) +
      "\nTime: " +
      this.clientDate.getHours() +
      ":" +
      this.clientDate.getMinutes();
    this.message.subJect = "Appointment";
    this.message.date = this.GenerateDate(this.today);
    this.messageService.sendMessage(this.message).subscribe(
      data => {
        this.snackBar.open("appointment request sent", "", {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "" , {duration: 3000});
      }
    );
  }

  /**
   * Disabled days calculation - counting disabled days to show only working days set by owner
   */
  DisabledDaysCalculation() {
    for (let i = 0; i < 7; i++) {
      if (!this.workWeekDays.includes(i)) {
        this.disabledDays.push(i);
      }
    }
  }

  /**
   * Saves days and time - saving owner settings of working days and hours
   */
  SaveDaysAndTime() {
    this.selectedDays.sort();
    this.appointment.days = this.selectedDays;
    if (this.start != null) {
      this.appointment.start = this.start.getTime();
      this.scheduleHours.start =
        String(this.start.getHours()).padStart(2, "0") +
        ":" +
        String(this.start.getMinutes()).padStart(2, "0");
    }
    if (this.end != null) {
      this.appointment.end = this.end.getTime();
      this.scheduleHours.end =
        String(this.end.getHours()).padStart(2, "0") +
        ":" +
        String(this.start.getMinutes()).padStart(2, "0");
    }
    this.set(this.appointment);
    this.workWeekDays = this.selectedDays;
    this.DisabledDaysCalculation();
  }

  /**
   * Sets business appointment in server
   * @param app - appointment to save on server
   */
  set(app: IAppointment) {
    this.businessService.setApointments(app).subscribe(
      data => {
      },
      error => {
        this.snackBar.open(error, "" , {duration: 3000});
      }
    );
  }

  /**
   * Sets appointment properties from server in the current appointment object to work on
   */
  SetAppointmentProperties() {
    this.appointment.appointmentList.forEach(element => {
      this.newApp.appointmentList.push(this.allKeysToUpperCase(element));
    });
    this.appointment.appointmentList = this.newApp.appointmentList;

    this.selectedDays = this.workWeekDays = this.appointment.days;
    this.start.setTime(this.appointment.start);
    this.end.setTime(this.appointment.end);

    this.scheduleHours.start =
      String(this.start.getHours()).padStart(2, "0") +
      ":" +
      String(this.start.getMinutes()).padStart(2, "0");
    this.scheduleHours.end =
      String(this.end.getHours()).padStart(2, "0") +
      ":" +
      String(this.start.getMinutes()).padStart(2, "0");

    this.eventSettings.dataSource = JSON.parse(
      JSON.stringify(this.appointment.appointmentList)
    );

    this.rendered = !this.readOnly;
  }

/**
 * All keys to upper case - set the keys of schedular data to uppercase to save
 * as required by the code of schedular
 * @param obj
 * @returns keys to upper case only first letters
 */
allKeysToUpperCase(obj): object {
    const output = {};
    for (const i in obj) {
      if (Object.prototype.toString.apply(obj[i]) === "[object Object]") {
        output[i.toUpperCase()] = this.allKeysToUpperCase(obj[i]);
      } else {
        const nameCapitalized = i.charAt(0).toUpperCase() + i.slice(1);
        output[nameCapitalized] = obj[i];
      }
    }
    return output;
  }

/**
 * Sends message to client - when scheduling an appintment
 * @param args
 */
sendMessageToClient(args: ActionEventArgs) {
    this.message.recieverId = args.data[0]["Client"];
    this.message.senderId = this.currentBusiness.bMail;
    this.message.subJect = "Appointment Scheduled";
    this.appointmentStartDate = args.data[0]["StartTime"];
    this.appointmentEndDate = args.data[0]["EndTime"];
    this.message.messContent =
      "Details: \n Date: " +
      this.GenerateDate(this.appointmentStartDate) +
      "time: " +
      this.appointmentStartDate.getHours() +
      ":" +
      this.appointmentStartDate.getMinutes() +
      " In : " +
      this.currentBusiness.bName;
    this.messageService.sendMessage(this.message).subscribe(
      data => {
        this.snackBar.open("message sent", "", {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open(error, "" , {duration: 3000});
      }
    );
  }

  /**
   * Determines whether action begin on the schedular
   * @param args
   */
  onActionBegin(args: ActionEventArgs): void {
    const role = this.authService.currentUserType;
    if (args.requestType === "eventChange") {
      // while editing the existing event
      this.appointment.bName = this.currentBusiness.bName;
      const id = args.data["Id"];
      this.appointment.appointmentList = this.appointment.appointmentList.filter(
        el => el["Id"] != id
      );
      this.appointment.appointmentList.push(args.data);
      this.set(this.appointment);
    }
    if (args.requestType === "eventCreate") {
      // while creating new event
      this.appointment.bName = this.currentBusiness.bName;
      this.appointment.counter++;
      this.appointment.appointmentList.push(
        Object.assign(args.data[0], { Id: this.appointment.counter })
      );
      if (args.data[0]["Client"] != null) {
        this.sendMessageToClient(args);
      }
      this.set(this.appointment);
    }
    if (args.requestType === "eventRemove") {
      // when removing an event from schedular
      const id = args.data[0]["Id"];
      this.appointment.appointmentList = this.appointment.appointmentList.filter(
        el => el["Id"] != id
      );
      this.appointment.bName = this.currentBusiness.bName;
      this.set(this.appointment);
    }
  }
 /**
  * Determines whether popup open on
  * @param args
  */
 onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === "Editor") {
      this.appointmentDurationInMinutes = 30;
      args.duration = this.appointmentDurationInMinutes;
      // Create required custom elements in initial time
      if (!args.element.querySelector(".custom-field-row")) {
        const row: HTMLElement = createElement("div", {
          className: "custom-field-row"
        });
        const formElement: HTMLElement = args.element.querySelector(
          ".e-schedule-form"
        );
        formElement.firstChild.insertBefore(
          row,
          args.element.querySelector(".e-title-location-row")
        );
        const container: HTMLElement = createElement("div", {
          className: "custom-field-container"
        });
        const inputEle: HTMLInputElement = createElement("input", {
          className: "e-field",
          attrs: { name: "Client" }
        }) as HTMLInputElement;
        container.appendChild(inputEle);
        row.appendChild(container);
        const dropDownList: DropDownList = new DropDownList({
          dataSource: this.clientList,
          fields: { text: "text", value: "value" },
          value: (<{ [key: string]: Object }>args.data).EventType as string,
          floatLabelType: "Always",
          placeholder: "Clients List"
        });
        dropDownList.appendTo(inputEle);
        // setting new attribute of clients list so owner can choose a client to assign event to
        inputEle.setAttribute("name", "Client");
      }
    }
  }

  /**
   * Created business appointment spinner
   */
  created() {
    this.scheduleObj.showSpinner();
  }
}
