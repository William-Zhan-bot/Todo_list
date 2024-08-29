let add = document.querySelector("section form button");
// 新增工作專用
let mission = document.querySelector("section.list");

add.addEventListener("click", (e) => {
  e.preventDefault(); // 先不讓網頁重整

  // 找到表單內容 從父系tags找下來
  let form = e.target.parentElement;
  // console.log(form.children); //HTML collections
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;
  // console.log(todoText, todoMonth, todoDate);

  if (todoText === "") {
    alert("事件不可為空!!!");
    return;
  }

  // 之後加到網頁中間
  // console.log(mission);
  // 先創立一個新的tags 並加上class
  let todo = document.createElement("div");
  todo.classList.add("todo");

  // 建立內容清單
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;

  //加到前面創立的 空TAG
  todo.appendChild(text);
  todo.appendChild(time);

  // 製作按鈕
  let completeBt = document.createElement("button");
  completeBt.classList.add("complete");
  completeBt.innerHTML = '<i class="fa-solid fa-check"></i>';
  // 按鈕功能 斜線+透明
  completeBt.addEventListener("click", (e) => {
    // 有些時候會案到 icon tags而非button
    // 必須先以css暫停i tag的點擊功能 否則容易出bug
    /** 後續處理
     * 掛上一個done class裡面有新屬性
     * toggle 讓class產生相反的功能 無+有-
     */
    todo.classList.toggle("done");
    let todoItems = e.target.parentElement.parentElement;
    let text = todoItems.children[0].innerText;
    let mylist = JSON.parse(localStorage.getItem("list"));
    mylist.forEach((item) => {
      if (text === item.todoText) {
        if (item.complete === 0) {
          console.log("ok");
          item.complete = 1;
          localStorage.setItem("list", JSON.stringify(mylist));
        } else {
          item.complete = 0;
          localStorage.setItem("list", JSON.stringify(mylist));
        }
      }
    });
  });

  let trashBt = document.createElement("button");
  trashBt.classList.add("trash");
  trashBt.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  /**刪除功能 思路
   * 定位元素 => 播放刪除動畫
   * 播完動畫之後 再刪除html tags
   * 必須以事件animationend 來執行刪除tag
   * 以保證動畫播放完全
   */
  trashBt.addEventListener("click", (e) => {
    let todoItems = e.target.parentElement.parentElement;
    // 設定事件檢視器去刪除
    todoItems.addEventListener("animationend", (e) => {
      todoItems.remove();
      /**刪除localstorage
       * 用foreach + splice刪除
       */
      let text = todoItems.children[0].innerText;
      let mylist = JSON.parse(localStorage.getItem("list"));
      mylist.forEach((item, index) => {
        if (text === item.todoText) {
          mylist.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(mylist));
        }
      });
    });
    //動畫會先執行
    todoItems.style.animation = "scaleDown 0.3s forwards";
  });

  let btBox = document.createElement("div");
  btBox.classList.add("button");
  btBox.appendChild(completeBt);
  btBox.appendChild(trashBt);
  todo.appendChild(btBox);

  //加入前面的動畫
  //scaleUp是前面css的函數屬性
  todo.style.animation = "scaleUp 0.3s forwards";
  //掛到網頁上
  mission.appendChild(todo);

  //放入local storage
  /**計畫
   * 設定空obj來放置上述內容
   * 之後以list => [obj1,obj2...] 的格式去放入localstorage
   * 為空則寫入
   * 已有內容則領出後更新arr 重新寫入
   *
   * 因寫入為arr 必須先比JSON轉換
   */
  let todoInLocal = localStorage.getItem("list");
  let todoData = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
    complete: 0,
  };
  let todoInWeb = []; // 放置資料用
  if (todoInLocal === null) {
    todoInWeb.push(todoData);
    localStorage.setItem("list", JSON.stringify(todoInWeb));
    // console.log(todoData);
  } else {
    todoInWeb = JSON.parse(todoInLocal);
    todoInWeb.push(todoData);
    localStorage.setItem("list", JSON.stringify(todoInWeb));
  }

  // 每一輪清空value值
  form.children[0].value = "";
});

// load data
load_data();
function load_data() {
  /**讀取local storage 與刪除功能
   * 1.一打開forEach迴圈檢驗
   * 2.刪除local內的功能*/

  //1.
  let localdata = localStorage.getItem("list");
  if (localdata !== null) {
    localdata = JSON.parse(localdata);

    localdata.forEach((data) => {
      // 先創立一個新的tags 並加上class
      let todo = document.createElement("div");
      todo.classList.add("todo");

      // 建立內容清單
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = data.todoText;

      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = data.todoMonth + " / " + data.todoDate;

      // 保存完成紀錄
      if (data.complete === 1) {
        todo.classList.add("done");
      } else if (data.complete === 0) {
        todo.classList.remove("done");
      }
      //加到前面創立的 空TAG
      todo.appendChild(text);
      todo.appendChild(time);

      // 製作按鈕
      let completeBt = document.createElement("button");
      completeBt.classList.add("complete");
      completeBt.innerHTML = '<i class="fa-solid fa-check"></i>';
      // 按鈕功能 斜線+透明
      completeBt.addEventListener("click", (e) => {
        todo.classList.toggle("done");

        let todoItems = e.target.parentElement.parentElement;
        let text = todoItems.children[0].innerText;
        let mylist = JSON.parse(localStorage.getItem("list"));
        mylist.forEach((item) => {
          if (text === item.todoText) {
            if (item.complete === 0) {
              item.complete = 1;
              localStorage.setItem("list", JSON.stringify(mylist));
            } else {
              item.complete = 0;
              localStorage.setItem("list", JSON.stringify(mylist));
            }
          }
        });
      });

      let trashBt = document.createElement("button");
      trashBt.classList.add("trash");
      trashBt.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      trashBt.addEventListener("click", (e) => {
        let todoItems = e.target.parentElement.parentElement;
        // 設定事件檢視器去刪除
        todoItems.addEventListener("animationend", () => {
          todoItems.remove();

          /**刪除localstorage
           * 用foreach + splice刪除
           */
          let text = todoItems.children[0].innerText;
          console.log("text: ", text);
          let mylist = JSON.parse(localStorage.getItem("list"));
          mylist.forEach((item, index) => {
            if (text === item.todoText) {
              mylist.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(mylist));
            }
          });
        });
        //動畫會先執行
        todoItems.style.animation = "scaleDown 0.3s forwards";
      });

      let btBox = document.createElement("div");
      btBox.classList.add("button");
      btBox.appendChild(completeBt);
      btBox.appendChild(trashBt);
      todo.appendChild(btBox);

      //掛到網頁上
      mission.appendChild(todo);
    });
  }
}

//sort by time => merge sort

// 排序試用 merge sort

function sort(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else {
      if (Number(arr1[i].todoDate) < Number(arr2[j].todoDate)) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

//切矩陣
function merge(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return sort(merge(left), merge(right));
  }
}

// console.log(o);
// console.log(merge(o));

//排序安裝進入頁面
let sortbytimeBT = document.querySelector("div.bt button");

sortbytimeBT.addEventListener("click", (e) => {
  // sort by time
  let currentList = JSON.parse(localStorage.getItem("list"));
  localStorage.setItem("list", JSON.stringify(merge(currentList)));
  // remove old data
  let lst = document.querySelector("section.list");
  // console.log(lst.children);
  // 因為為HTML collections 不能foreach
  // console.log(JSON.parse(localStorage.getItem("list")));
  console.log(JSON.parse(localStorage.getItem("list")));
  let len = lst.children.length;
  for (let i = 0; i < len; i++) {
    lst.children[0].remove();
  }
  load_data();
});
