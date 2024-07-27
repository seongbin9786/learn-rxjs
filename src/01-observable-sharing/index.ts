import { fromEvent, share, tap } from "rxjs";

// HTML 요소를 선택합니다 (예: 버튼)
const button = document.getElementById("myButton")!;

const buttonClickSubject$ = fromEvent<MouseEvent>(button, "click");

const sharedClickObservable = buttonClickSubject$.pipe(
  tap((event) => console.log("Shared Pipe!")),
  share(),
);

const unsharedClickObservable = buttonClickSubject$.pipe(
  tap((event) => console.log("Unshared Pipe!")),
);

sharedClickObservable.subscribe((event) => {
  console.log("Shared Subscriber!");
});

sharedClickObservable.subscribe((event) => {
  console.log("Shared Subscriber!");
});

unsharedClickObservable.subscribe((event) => {
  console.log("Unshared Subscriber!");
});

unsharedClickObservable.subscribe((event) => {
  console.log("Unshared Subscriber!");
});
