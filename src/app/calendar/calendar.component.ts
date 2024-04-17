import { Component, OnInit, TemplateRef } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/core"; // useful for typechecking
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import * as bootstrap from "bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  missions: any = [
    {
      id: 1,
      name: "Jean",
      title: "Menu déroulant",
      description: "Menu déroulant dans le choix de la langue",
      date: "2024-04-18",
      color: "#0056ff",
      image: "../../assets/oni.png"
    },
    {
      id: 2,
      name: "Marc",
      title: "Navbar responsive",
      description:
        "Faire un navbar avec hamburger avec le résolution standard d'un mobile",
      date: "2024-04-19",
      color: "#ff0e00",
      image: "../../assets/marco.jpg"
    },
    {
      id: 3,
      name: "Jean",
      title: "Pagination Backend",
      description: "Faire une fonction de pagination pour le Backend",
      date: "2024-04-20",
      color: "#0056ff",
      image: "../../assets/oni.png"
    }
  ];

  eventForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const highestId = this.missions.reduce(
      (maxId: number, mission: { id: number }) => Math.max(mission.id, maxId),
      0
    );

    // Initialize the form in ngOnInit
    this.eventForm = this.formBuilder.group({
      id: [highestId + 1],
      name: ["", Validators.required],
      title: ["", Validators.required],
      description: ["", Validators.required],
      date: ["", Validators.required],
      color: ["blue", Validators.required],
      image: [""]
    });
  }

  openLg(content: TemplateRef<any>) {
    this.modalService.open(content, { size: "lg" });
  }

  addEvent() {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
      const eventDate = new Date(
        newEvent.date.year,
        newEvent.date.month - 1,
        newEvent.date.day + 1
      );
      newEvent.date = eventDate.toISOString().slice(0, 10);
      this.missions.push(newEvent);
      this.calendarOptions.events = [...this.missions];
      this.eventForm.reset();
    }
  }

  removeEvent(eventId: number) {
    const index = this.missions.findIndex((event: any) => event.id === eventId);
    if (index !== -1) {
      this.missions = this.missions.filter(
        (event: any) => event.id !== eventId
      );
      this.calendarOptions.events = [...this.missions];
    }
  }

  customEventRender = (info: any) => {
    const eventEl = document.createElement("div");

    eventEl.style.maxWidth = "100%";
    eventEl.style.height = "auto";
    eventEl.style.textAlign = "center";

    const imageEl = document.createElement("img");
    imageEl.src = info.event.extendedProps.image;
    imageEl.style.maxWidth = "100px";
    imageEl.style.height = "100px";
    imageEl.style.borderRadius = "50%";
    imageEl.style.margin = "5px 0";
    eventEl.appendChild(imageEl);

    const nameEl = document.createElement("p");
    nameEl.innerText = info.event.extendedProps.name;
    nameEl.style.textTransform = "uppercase";
    nameEl.style.fontWeight = "bold";
    nameEl.style.fontSize = "1.1em";
    eventEl.appendChild(nameEl);

    const titleEl = document.createElement("p");
    titleEl.innerText = info.event.title;
    eventEl.appendChild(titleEl);

    const popover = new bootstrap.Popover(imageEl, {
      title: "Description",
      content: info.event.extendedProps.description,
      trigger: "hover",
      placement: "top",
      container: "body"
    });

    const removeButton = document.createElement("button");
    removeButton.innerText = "Supprimer";
    removeButton.className = "btn btn-sm my-2 btn-warning";
    removeButton.addEventListener("click", () => {
      console.log(info.event.id);

      this.removeEvent(parseInt(info.event.id));
    });
    eventEl.appendChild(removeButton);

    return { domNodes: [eventEl] };
  };

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, interactionPlugin],
    contentHeight: 750,
    dateClick: arg => this.handleDateClick(arg),
    events: this.missions,
    fixedWeekCount: false,
    showNonCurrentDates: false,
    eventContent: this.customEventRender
  };

  handleDateClick(arg: DateClickArg) {
    alert("date click! " + arg.dateStr);
  }
}
