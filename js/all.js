
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
getProductList();

//將產品列表渲染到網頁上
function renderProductList(productData){
  let str ="";
  productData.forEach(function(item){
    str+= `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="${item.description}">
    <a href="#" class="addCardBtn">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$ ${item.origin_price}</del>
    <p class="nowPrice">NT$ ${item.price}</p>
</li>`;
  })
  productList.innerHTML = str; 
}

//顯示購物車列表
let cartData = [];
const cartList = document.querySelector(".js-cartList");

//取得購物車內資料
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
    //將取得購物車資料放到cartData空陣列內
    cartData = response.data.carts;
    console.log(cartData);
    renderCartList(cartData);
  })
}
getCartList();

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
    <td>NT$ ${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons">
            clear
        </a>
    </td>
</tr>`
  })
  cartList.innerHTML= str; 
}


