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

//取得購物車內資料
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
    //將取得購物車資料放到cartData空陣列內
    cartData = response.data.carts;
    renderCartList();
  })
}

const cartTotalAmount = document.querySelector(".js-totalAmount");
//將購物車列表渲染到畫面上
function renderCartList(){
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
    <td>${item.quantity}</td>
    <td >NT$ ${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
            clear
        </a>
    </td>
</tr>`
  })
  cartList.innerHTML= str; 
  //總金額計算
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function(response){
    cartTotalAmount.textContent = response.data.finalTotal; 
})
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
     getCartList();
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
      getCartList();
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
   getCartList();
})
})


//送出訂單資料
const submitOrderBtn = document.querySelector(".js-orderSubmitBtn");
const form = document.querySelector(".orderInfo-form");

submitOrderBtn.addEventListener("click", function(e){
  e.preventDefault();
  //把填寫欄位都選取起來
  let customerName = document.querySelector("#customerName").value;
  let customerPhone = document.querySelector("#customerPhone").value; 
  let customerEmail = document.querySelector("#customerEmail").value; 
  let customerAddress = document.querySelector("#customerAddress").value; 
  let tradeWay = document.querySelector("#tradeWay").value; 
  
  //如果有漏填欄位就不執行送出表單動作
  if (customerName== "" || customerPhone== "" || customerEmail =="" || customerAddress =="" || tradeWay =="" ){
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
   form.reset();
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