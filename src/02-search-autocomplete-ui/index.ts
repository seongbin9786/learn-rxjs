import { fromEvent, partition } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  retry,
  finalize,
  tap,
  share,
} from "rxjs/operators";
import {
  $autoCompleteList,
  drawAutoCompleteListItems,
  hideLoading,
  showLoading,
} from "./renderer";

export interface Item {
  avatar_url: string;
  html_url: string;
  login: string;
}

interface GitHubUserListAPIResponse {
  items: Item[];
}

const getGitHubUserListByName = (query: string) =>
  ajax.getJSON<GitHubUserListAPIResponse>(
    `https://api.github.com/search/users?q=${query}`,
  );

const searchTermKeyUp$ = fromEvent(
  document.getElementById("search")!,
  "keyup",
).pipe(
  debounceTime(300),
  map((event) => (event.target as HTMLInputElement).value),
  distinctUntilChanged(),
  // share(),
);

// NOTE: operator로서의 partition이 제거되고, static method로서의 partition이 추가되었다. (v8에 제거 예정)
const [onNormalKeyUp$, onResetKeyUp$] = partition(
  searchTermKeyUp$,
  (query) => query.trim().length > 0,
);

const onSearchTermKeyUp$ = onNormalKeyUp$.pipe(
  // tap(showLoading),
  switchMap(getGitHubUserListByName),
  // tap(hideLoading),
  // retry(2), // catch Error 후 재구독 수행. source$에서 전달된 값이 다시 들어온다.
  // retry(2)는 새로 값이 들어오지 않는 한 반복되지 않는다... 뭐야...?
  // finalize(hideLoading),
  // tap((v) => console.log("from normalKeyUp$", v)),
);

onSearchTermKeyUp$.subscribe({
  next: (v) => drawAutoCompleteListItems(v.items),
  error: (e) => {
    console.error(e);
    alert(e.message);
    return onSearchTermKeyUp$;
    // NOTE: onSearchTermKeyUp을 반환해봤자 이미 종료된 Observable이 되는 것 같다...?

    // NOTE: error 시 unsubcribe 된다.
    // FIXME: 이 경우 더 이상 동작을 하지 않는 문제가 발생한다.
    // TODO: 별도의 에러 복구 로직을 갖는 Observable을 반환. 복구 되면 다시 원래의 Observable을 반환하기.
  },
});

onResetKeyUp$
  .pipe(
    tap((v) => ($autoCompleteList.innerHTML = "")),
    tap((v) => console.log("from resetKeyUp$", v)),
  )
  .subscribe();
