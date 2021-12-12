// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});



const orderList = document.querySelector(".js-orderList");
console.log(orderList);
let orders = [];

//取得訂單列表
function getOrders(){
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders` , {
    headers:{
        'Authorization':`${token}`
    }
}).then(function(response){
    orders = response.data.orders;
    let str ="";
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
        <td>${item.createdAt}</td>
        <td class="orderStatus">
          <a href="#">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id="${item.id}"value="刪除">
        </td>
    </tr>`
    })
    orderList.innerHTML = str; 
})
}

getOrders();