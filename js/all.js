
//選取在顯示產品列表的ul標籤
const productList = document.querySelector(".js-productList");


let productData = [];
//取得產品列表資料
function getProductList (){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {
        // handle success
          productData = response.data.products;
          console.log(productData);
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