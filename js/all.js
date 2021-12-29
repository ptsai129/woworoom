//初始化
function init(){
  getProductList();
  getCartList();
}

init();
//選取在顯示產品列表的ul標籤
const productList = document.querySelector(".js-productList");
let productData = [];

//取得產品列表資料
function getProductList (){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
        // handle success
          productData = response.data.products;
          renderProductList(productData);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
}


//將產品列表渲染到網頁上
function renderProductList(productData){
  let str ="";
  productData.forEach(function(item){
    str+= `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="${item.description}">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$ ${item.origin_price}</del>
    <p class="nowPrice">NT$ ${item.price}</p>
</li>`;
  })
  productList.innerHTML = str; 
}

//篩選產品列表
const productFilter = document.querySelector(".js-productFilter");

productFilter.addEventListener('change',function(e){
  let productCategory = e.target.value;
  //如果選取欄位內的值不是全部  
    if (productCategory != "全部"){
      let str ="";
      productData.forEach( item =>{
        //篩選出productData中和productCategory值一樣的品項並渲染到畫面上
        if(productCategory == item.category){
          str+=  `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img src="${item.images}" alt="${item.description}">
          <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$ ${item.origin_price}</del>
          <p class="nowPrice">NT$ ${item.price}</p>
      </li>`;
        }
      })
      productList.innerHTML = str; 
    }else{
    //如果選到全部就帶出全部的商品
    renderProductList(productData);
  }
  })


//顯示購物車列表
let cartData = [];
const cartList = document.querySelector(".js-cartList");
const cartTotalAmount = document.querySelector(".js-totalAmount");
//取得購物車內資料
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
    //將取得購物車資料放到cartData空陣列內
    cartData = response.data.carts;
    cartTotalAmount.textContent = response.data.finalTotal; 
    renderCartList(cartData);
  })
}


//將購物車列表渲染到畫面上
function renderCartList(cartData){
  let str = "";
  cartData.forEach((item)=>{
    str+=` <tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="${item.product.description}">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$ ${item.product.price}</td>
    <td><input type="number" class="purchaseNum" min="1" max="10" value="${item.quantity}" data-id="${item.id}"></td>
    <td >NT$ ${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
            clear
        </a>
    </td>
</tr>`
  })
  cartList.innerHTML= str; 
  //選取購物車數量欄位
  const purchaseNum = document.querySelectorAll(".purchaseNum");
     purchaseNum.forEach(item=>{
       //購物車數量輸入欄位綁監聽
      item.addEventListener('change',function(e){
        let inputNum = e.target.value;
        let inputID = e.target.dataset.id;
        if (inputNum <= 0){
          alert("輸入數量錯誤");
        }
        editCartNum(inputNum, inputID);
      })
    })
    
}

 //編輯購物車產品數量
function editCartNum(inputNum, inputID) {
  if (inputNum > 0) {
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,  {
      data: {
        id: inputID,
        quantity: parseInt(inputNum)
      }
    })
      .then(function (response) {
        renderCartList(response.data.carts);
      })
      .catch(function (error) {
        console.log(error);
      })
      }
}


//加入購物車
productList.addEventListener('click', function(e){
//如果點擊到的位置不是加入購物車的按鈕 就中斷執行
if(e.target.nodeName != "A"){
  return; 
}
e.preventDefault();
//將取得的button內的data-id值賦予到productID變數上
const productID = e.target.getAttribute("data-id"); 
 //購物車商品起始數量為1
 let cartNum = 1; 
 cartData.forEach(function(item){
   //如果cartData內產品id的值 和加入購物車按鈕內的id值一樣 代表是加入同個商品 quantity要+1
   if (item.product.id == productID){
     cartNum = item.quantity+=1;
   }
 })

 axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
   data: {
     "productId": productID,
     "quantity": cartNum
   }
 }).
   then(function (response) {
     alert("您已成功將商品加入購物車");
     //重新渲染畫面
     cartData = response.data.carts;
     cartTotalAmount.textContent = response.data.finalTotal;
     renderCartList(cartData);
  
})
})








//刪除全部購物車
const deleteAllBtn = document.querySelector(".js-deleteAllbtn");
//刪除所有品項按鈕綁監聽
deleteAllBtn.addEventListener("click", function(e){
  e.preventDefault();
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response) {
      alert("已清空購物車");
      //畫面重新渲染
      cartData = response.data.carts;
      cartTotalAmount.textContent = response.data.finalTotal;
      renderCartList(cartData);
  })
  .catch(function (response) {
    alert("購物車已清空");
  })
})


//刪除單筆商品
cartList.addEventListener('click', function(e){
//如果點擊到的位置不是刪除的按鈕 就中斷執行
if(e.target.nodeName != "A"){
  return; 
}
e.preventDefault();
//取得欲刪除品項的data-id內的值並賦予到cartItemID變數內
let cartItemID = e.target.getAttribute("data-id");

axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartItemID}`)
.then(function (response) {
  alert("刪除商品成功");
   //重新渲染畫面
   cartData = response.data.carts;
   cartTotalAmount.textContent = response.data.finalTotal;
    renderCartList(cartData);
})
})




//表單驗證 (使用validate.js)

const validateForm = document.querySelector(".orderInfo-form");

const constraints = {
  //定義input name屬性值為的設定
     "姓名": {
    presence:  {
      //presense代表必填 若沒有填寫會跳出message訊息
      message: "請輸入姓名"
    },
    length:{
      minimum:2
    }
  },
    "電話":{
    presence:{
      message:"請輸入連絡電話"
    },
    length:{
    minimum:7, 
    message: "需超過7碼"
    }
  },
    Email: {
      presence:  {
      message: "請輸入Email",
    },  
    email: {
      message: "請輸入正確Email",
    }   
    },
    "寄送地址": {
      presence:{
        message: "請輸入寄送地址"
      }
    }
}

const inputs = document.querySelectorAll("input[type=text],input[type=tel] ,input[type=email], #tradeWay");
inputs.forEach((item) =>{
  item.addEventListener("change" ,function(e){
   
    let errors = validate(validateForm, constraints);
    item.nextElementSibling.textContent='';
    if(errors){
    Object.keys(errors).forEach(function(keys){
      if(e.target.getAttribute("name") === keys){
        document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys]; 
        
      }
      })
    }else{
      return;
    }
  });
 });
   
  



//送出訂單資料
const submitOrderBtn = document.querySelector(".js-orderSubmitBtn");

submitOrderBtn.addEventListener("click", function(e){
  e.preventDefault();
  validate(validateForm, constraints); 
  //把填寫欄位都選取起來
  let customerName = document.querySelector("#customerName").value;
  let customerPhone = document.querySelector("#customerPhone").value; 
  let customerEmail = document.querySelector("#customerEmail").value; 
  let customerAddress = document.querySelector("#customerAddress").value; 
  let tradeWay = document.querySelector("#tradeWay").value; 
  //如果有漏填欄位就不執行送出表單動作
  if (customerName == "" || customerPhone == "" || customerEmail =="" || customerAddress ==""){
    alert("請完成表單填寫");
    return;
  }

  //如果購物車內沒有商品就不執行送出表單動作
  if (cartData.length == 0){
    alert("購物車內沒有商品喔");
    return; 
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
    data: {
     user: {
       name: customerName,
       tel: customerPhone,
       email: customerEmail,
       address: customerAddress,
       payment: tradeWay
     }
   }
   }).then(function(response){
     alert("訂單建立成功");
   //重新取得購物車內資料並渲染畫面
   getCartList();
   //清空表單
   validateForm.reset();
   })

})


//送出訂單
function placeOrders(){
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
    data: {
     user: {
       name: customerName,
       tel: customerPhone,
       email: customerEmail,
       address: customerAddress,
       payment: tradeWay
     }
   }
   }).then(function(response){
     alert("訂單建立成功");
   //重新取得購物車內資料並渲染畫面
   getCartList();
   //清空表單
   form.reset();
   })
}