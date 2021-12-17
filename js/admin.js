const orderList = document.querySelector(".js-orderList");
let orders = [];

//初始化
function initOrders(){
    getOrders();
}
initOrders();

//取得訂單列表
function getOrders(){
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders` , {
    headers:{
        'Authorization':`${token}`
    }
}).then(function(response){
    orders = response.data.orders;
    renderOrderList();
})
}


//渲染訂單資料
function renderOrderList(){
    let str="";
    orders.forEach(item =>{
        
        //訂單品項因為可能有多筆 所以自己跑forEach
        let productStr ="";
        item.products.forEach(product =>{
            productStr+=`<p>${product.title} 數量:${product.quantity}</p>`
        })
        //將item.paid內的值轉成文字
        let orderStatus ="";
        if(item.paid == false){
            orderStatus = "未付款";
        }else{
            orderStatus = "已付款";
        }
        //將unix時間轉換成西元年月日 x1000是因為要變成毫秒
        let orderTime = new Date(item.createdAt * 1000);
        let orderYear = orderTime.getFullYear();
        let orderMonth = orderTime.getMonth()+1;
        let orderDay = orderTime.getDate();
        let orderTimeFormat = `${orderYear}/${orderMonth}/${orderDay}`;

        str+= `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productStr}</p>
        </td>
        <td>${orderTimeFormat}</td>
        <td class="orderStatus">
          <a href="#"  class="js-orderStatus" data-status="${item.paid}"  data-statusId="${item.id}">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
        </td>
    </tr>`
    })
    orderList.innerHTML = str; 
    renderPieData();
}


//組c3 chart需要的資料 

function renderPieData(){
    
    //先把資料組成 {'Louvre 雙人床架':1,'Antony 雙人床架': 2,... }
    let chartObj ={};
    orders.forEach(item=>{
        item.products.forEach(chartProduct =>{
            if( chartObj[chartProduct.title] == undefined){
                chartObj[chartProduct.title] = 1;
               }else{
                chartObj[chartProduct.title] = item.quantity;
               }
        }) 
   
    })
    let newData = [];
   //將chartObj內的屬性都取出 放到chartArr陣列內
   const chartArr = Object.keys(chartObj);
   chartArr.forEach(function(item, index){
       let arr = [];
       arr.push(item);
       arr.push(chartObj[item]);
       newData.push(arr);       
   })

   // C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: newData,
      colors:{
          "Jordan 雙人床架／雙人加大":"#FFE6FF",
          "Louvre 單人床架":"#F1E1FF",
          "Louvre 雙人床架／雙人加大":"#D3A4FF",
          "Antony 雙人床架／雙人加大":"#B15BFF",
          "Antony 遮光窗簾":"#007979",
          "Charles 系列儲物組合":"#8600FF",
          "Antony 床邊桌":"#5B00AE",
          "Charles 雙人床架":"#28004D",
      }
  },
});
}


//修改訂單狀態  沒有如預期的執行???????????
orderList.addEventListener("click", function(e){
   if(e.target.getAttribute("class") != "js-orderStatus"){
       return;
   }
   let paidOrNot = e.target.getAttribute("data-status");
   console.log(paidOrNot);
   if(paidOrNot == "false"){
        paidOrNot = true; 
        orderStatus = "已付款";
           
       }else{
        paidOrNot = false; 
        orderStatus = "未付款";
       }
    
    let orderId = e.target.getAttribute("data-statusID");


   axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": paidOrNot
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      alert("已完成修改訂單狀態");
      getOrders();
    })
    
}) 

//刪除單筆訂單
orderList.addEventListener("click", function(e){
    //若選取到的不是刪除按鈕 就中斷
if (e.target.getAttribute("class") != "delSingleOrder-Btn"){
 return; 
}
//取得刪除按鈕內data-id的值
let deleteItemID = e.target.getAttribute("data-id"); 

axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${deleteItemID}`,
{
  headers: {
    'Authorization': token
  }
})
.then(function (response) {
  alert("刪除特定訂單成功")
  getOrders();
})
})

//刪除全部訂單
const deleteAllOrdersBtn = document.querySelector(".js-deleteAllOrders");

deleteAllOrdersBtn.addEventListener('click' ,function(e){

axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization': token
        }
}).then(function(response){
    alert("已刪除全部訂單")
    getOrders();
})
})




