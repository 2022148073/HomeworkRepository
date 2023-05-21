let picture = 1;

fetch("product.json")
  .then((response) => response.json())
  .then((json) => initialize(json))
  .catch((error) => console.log("Error: " + error.message));

let category_group = [];
let filter_group = [];

let pre_category = "";
let pre_search = "";
let pre_sort = "";

const category = document.querySelector("#choose_a_category");
const term = document.querySelector("#Enter_search_term");
const sorting = document.querySelector("#choose_a_sort");
const button = document.querySelector("#filter_results");
const item = document.querySelector("#main_item");

window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    load();
  }
};

function initialize(product) {
  filter_group = product;
  update_item();

  button.onclick = filtering;

  function filtering(button) {
    button.preventDefault();
    picture = 1;

    category_group = [];
    filter_group = [];

    if (
      category.value === pre_category &&
      term.value.trim() === pre_search &&
      sorting.value === pre_sort
    ) {
      return;
    } else {
      pre_category = category.value;
      pre_search = term.value.trim();
      pre_sort = sorting.value;

      if (category.value === "All") {
        category_group = product;
        select_term();
      } else {
        for (let i = 0; i < product.length; i++) {
          if (product[i].type === category.value) {
            category_group.push(product[i]);
          }
        }
        select_term();
      }
    }
  }
}

function select_term() {
  if (term.value.trim() !== "") {
    let lower_term = term.value.trim().toLowerCase();
    for (let i = 0; i < category_group.length; i++) {
      title_lower = category_group[i].name.toLowerCase();
      if (title_lower.indexOf(lower_term) !== -1) {
        filter_group.push(category_group[i]);
      }
    }
  } else {
    filter_group = category_group;
  }

  sorting_book();
  update_item();
}

function sorting_book() {
  if (sorting.value === "기본순") {
    return;
  } else if (sorting.value == "가격 낮은 순") {
    for (let i = 0; i < filter_group.length; i++) {
      for (let j = i + 1; j < filter_group.length; j++) {
        if (filter_group[i].price > filter_group[j].price) {
          let lower = filter_group[j];
          filter_group[j] = filter_group[i];
          filter_group[i] = lower;
        }
      }
    }
  } else if (sorting.value == "가격 높은 순") {
    for (let i = 0; i < filter_group.length; i++) {
      for (let j = i + 1; j < filter_group.length; j++) {
        if (filter_group[i].price < filter_group[j].price) {
          let bigger = filter_group[j];
          filter_group[j] = filter_group[i];
          filter_group[i] = bigger;
        }
      }
    }
  }
}

function update_item() {
  while (item?.firstChild) {
    item.removeChild(item.firstChild);
  }

  if (filter_group.length === 0) {
    let no_result = document.createElement("div");
    no_result.className = "no_result";
    no_result.innerHTML = "검색 결과가 없습니다.";
    item.appendChild(no_result);
  } else {
    load();
  }
}

function load() {
  for (let i = (picture - 1) * 2; i < picture * 2; i++) {
    if (i >= filter_group.length) {
      break;
    }
    show(
      filter_group[i].image,
      filter_group[i].name,
      filter_group[i].dollars,
      filter_group[i].info
    );
  }

  picture++;
}

function show(image_url, product_name, product_str_dollars, product_info) {
  const book = document.createElement("div");
  const image = document.createElement("img");
  const explain = document.createElement("span");

  book.className = "flex_image";

  explain.className = "textbook_title";
  let str_explain =
    "이름: &nbsp;" +
    product_name +
    "<br><br>가격: &nbsp;" +
    product_str_dollars +
    "<br><br>설명: &nbsp;" +
    product_info;
  explain.innerHTML = str_explain;

  image.src = `image/${image_url}`;
  image.alt = product_name;

  item.appendChild(book);
  book.appendChild(image);
  book.appendChild(explain);
}
