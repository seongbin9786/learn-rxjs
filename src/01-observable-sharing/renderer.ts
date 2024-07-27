import { Item } from ".";

export const $autoCompleteList = document.getElementById("autocomplete-list")!;
export const $autoCompleteLoading = document.getElementById("loading")!;

export function drawAutoCompleteListItems(items: Item[]) {
  $autoCompleteList.innerHTML = items
    .map(
      (item) => `
        <li class="user">
            <img src="${item.avatar_url}" width="50px" height="50px"/>
            <p><a href="${item.html_url}" target="_blank">${item.login}</a></p>
        </li>
    `,
    )
    .join("");
}

export function showLoading() {
  $autoCompleteLoading.style.display = "block";
}

export function hideLoading() {
  $autoCompleteLoading.style.display = "none";
}
