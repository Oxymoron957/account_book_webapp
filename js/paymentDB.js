var db = null;
//var var_no = null;
//var position = null;
//var index;
var category_val
var cur_bal = 0

// Database를 생성합니다.
function openDB(){
    db = window.openDatabase('testDB0609','1.0','입출금내역DB',1024*1024*5);
    console.log('DB 생성');
}

// Table을 생성합니다. 
/*
    id(int) | name(text) | category(text) | year(int) | month(int) | day(int) | amount(int) | latitude(double) | longitude(double)  
*/
function createTable() {
    db.transaction(function(tr){
    // var deleteSQL = 'drop table payment';
    var createSQL = 'create table if not exists payment(id integer primary key autoincrement ,name text, category text, year integer, month integer, day integer, amount integer, latitude double, longitude double)';      
    // tr.executeSql(deleteSQL);
    
    tr.executeSql(createSQL, [], function(){
        console.log('2_1_테이블생성_sql 실행 성공...!!!!!!');       
     }, function(){
        console.log('2_1_테이블생성_sql 실행 실패...');           
     });
     }, function(){
        console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
     }, function(){
        console.log('2_2_테이블 생성 트랜잭션 성공...');
      });
}

/*
결재 정보를 저장합니다.
name : 결재내용, id = PaymentName
category : 카테고리, id = PaymentCategory
year, month, day : 현재날짜, 자동 입력됨
amount : 금액, id = PaymentAmount
현재 Latitude / Longtitude 입력된다. (main에서 불러와진 정보)
*/
function insertPayment(){
    db.transaction(function(tr){
        var name = $('#PaymentName').val();
        var category = category_val
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var day = now.getDate();
        var amount = ($('#PaymentAmount').val()) * ($('input[name="radio_button"]:checked').val()); 
        var insertSQL = 'insert into payment(name,category,year,month,day,amount, latitude, longitude) values(?,?,?,?,?,?,?,?)';
        var latitude_ = latitude;
        var longitude_ = longitude;
        if(name!=''&&category!=''&&amount!=''){
            tr.executeSql(insertSQL,[name,category,year,month,day,amount, latitude_, longitude_], function(tr,rs){
                console.log('no: ' + rs.insertId);
            }, function(tr,err){
                console.log('DB오류'+err.message+err.code);
                }
            );
        }
        else
        {
            console.log('입력을 해주세요');
        }
    });
}


/*
내역을 수정한다. 
ID를 통해 newName, newCategory, newAmount를 받아 값을 갱신한다.
*/
function updatePayment(){
    db.transaction(function(tr){
        var newName = $('#newName').val();
        var newCategory = $('#newCategory').val();
        // var newMonth = $('#newMonth').val();
        // var newDay = $('#newDay').val();
        var newAmount = $('#newAmount').val();
        
        var paymentID = $('#paymentID').val();
        var updateSQL = 'update payment set name=? category=? amount=? where id=?';
        tr.executeSql(updateSQL,[newName,newCategory,newAmount,paymentID],function(tr,rs){
            console.log('내역 수정');

        }, function(tr, err){
            console.log('DB 오류'+err.message + err.code);
        })
    })
}// 수정 후에 ajax로 ? refresh로 ? 페이지 수정하기

/*
Payment id를 받아 Payment 정보 삭제
*/
function deletePayment(id){
    db.transaction(function(tr){
        //var id = $('#deletePaymentId').val();
        var deleteSQL = 'delete from payment where id = ?';
        tr.executeSql(deleteSQL, [id], function(tr,rs){
            console.log('Payment 삭제');
            //화면 업데이트 
        }, function(tr,err){
            console.log('DB 오류'+err.message+err.code);
        });

    });
}

// 按照分类分组
function unique(data, keys = []) {
    var c = [];
    var d = {};
    for (var element of data) {
      let element_keyStr = "";
      let element_key = [];
      let element_keyObj = {};
      for (var key of keys) {
        element_key.push(element[key]);
        element_keyObj[key] = element[key];
      }
      element_keyStr = element_key.join("_");
      if (!d[element_keyStr]) {
        c.push({
          ...element_keyObj,
          children: [element]
        });
        d[element_keyStr] = element;
      } else {
        for (var ele of c) {
          let isTrue = keys.some(key => {
            return ele[key] != element[key];
          });
          if (!isTrue) {
            ele.children.push(element);
          }
        }
      }
    }
    return c;
}
// 统计分类总数
function getData(data, amountCount) {
    data.forEach(item => {
        if (item.children.length == 1) {
            item.count = item.children[0].amount
            item.baifen =  Math.round(item.count / amountCount * 10000) / 100 + "%";  
        } else {
            item.count = 0
            item.children.forEach(itemA => {
                item.count += itemA.amount
                item.baifen =  Math.round(item.count / amountCount * 10000) / 100 + "%";  
            })
        }
    });
}
// 统计月份总数
function countTotal(arr, keyName) {
	let $total = 0;
	$total = arr.reduce(function (total, currentValue, currentIndex, arr){
	    return currentValue[keyName] ? (total + currentValue[keyName]) : total;
	}, 0);
	return $total;
}
// 初始化echarts
function initEcharts(data) {
    var myChart = echarts.init(document.getElementById('graphical'));
	option = {
	    color:['#37a7e1','#dacb64', '#10832e', '#dd7bac'],
	    //提示框组件,鼠标移动上去显示的提示内容
	    tooltip: {
	       trigger: 'item',
               		fontSize: 35,
	       formatter: "{a} <br/>{b}: {c} ({d}%)"//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
	    },
	    series: [
	        {
	            name:'명세',
	            type:'pie',
	            //饼状图
	          //  radius: ['30%', '70%'],
	            avoidLabelOverlap: false,
	            //标签
	            label: {
	            	position: 'inner',
               		fontSize: 35,
	                normal: {
	                    show: true,
	                    position: 'inside',
	                    formatter: '{b}',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比

	                   textStyle : {                   
	                    align : 'center',
	                    baseline : 'middle',
	                    fontFamily : '微软雅黑',
	                    fontSize : 35,
	                    fontWeight : 'bolder'
	                 }
	                },
	            },
	            data:data
	        }
	    ]
	};
	option && myChart.setOption(option);
}

// 카테고리별 지출 내역 (선택 연도,월에 지출내역 표시 -> 각각 반복문에서 카드를 만들고 값 표시) 各类型支出明细
function readCategoryPayment(category1, year, month, category){
    console.log(month, category);
    db.transaction(function(tr){
        var selectSQL;
       
        if (year === undefined) {
            year = 2021
        }
        year = parseInt(year)
        month = parseInt(month)
        if(category1==='all')
        {
            selectSQL = 'select * from payment where year =? and month = ? order by day desc';
            tr.executeSql(selectSQL, [year,month], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                arr1 = []
                if(rs.rows.length>1) {
                    for(let i=0;i<rs.rows.length;i++)
                    {
                        arr1.push({
                            name: rs.rows.item(i).name,
                            amount: rs.rows.item(i).amount,
                            category:rs.rows.item(i).category
                        })
                    }
                    amountCount = countTotal(arr1, 'amount')
                    arr = unique(arr1, ['category'])
                    let arr3 = []
                    getData(arr, amountCount)
                    arr.forEach(item => {
                        msg = "<div id='Adetailed'>" +
                        "<div class='databar'>" +
                            "<div class='logo'><img src='./img/gw.png' height='80px' width='80px'></div>" +
                            "<div class='databarbig'>" +
                                "<div class='databarmini'>" +
                                    "<div class='name' id='name'>"+item.category+"</div>" +
                                    "<div class='proportion'>"+ item.baifen + "</div>" +
                                    "<div class='data'>"+item.count+"</div>" + 
                                "</div>" +
                                "<div class='dataprogressbar'>" +
                                    "<div class='dataprogressdetailedbar detailedbarcolor1'></div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "</div>"
                        arr3.push({
                            value: item.count,
                            name: item.category
                        })
                        document.querySelector('#detail').innerHTML += msg;
                    });
                    console.log(arr3)
                    initEcharts(arr3)
                } else {
                    msg = "<div class='databar'>" + 'no data..' + "</div>"
                    document.querySelector('#detail').innerHTML = msg;
                    document.querySelector('#graphical').innerHTML = msg;
                }
            }, null);
        }
        else
        {
            
            selectSQL = 'select * from payment where year =? and month = ? and category = ? order by day desc';
            tr.executeSql(selectSQL, [year,month,category], function(tr,rs){
                console.log(rs.rows);
                for(var i=0;i<rs.rows.length;i++)
                {
                    // rs.rows.item(i).id
                    // rs.rows.item(i).name
                    // rs.rows.item(i).category
                    // rs.rows.item(i).day
                    // rs.rows.item(i).amount
                    msg = "<div class='columdetailed'>"+
                    "<div class='name2 columfont'>"+ rs.rows.item(i).name + "</div>"+
                    "<div class='time columfont2'>"+rs.rows.item(i).year+'년'+ rs.rows.item(i).month +'월'+ rs.rows.item(i).day +'일'+"</div>" +
                    "<div class='money columfont'>" + rs.rows.item(i).amount + "</div>"+
                    "<div class='signlogo'></div>"+
                    "<div class='sign columfont'>비고</div>" +
                    "</div>"
                    document.querySelector('.inform').innerHTML += msg
                    document.querySelector('.detailedmonth').innerHTML = rs.rows.item(i).year+'년'+ rs.rows.item(i).month +'월'
                }
            });
        }
    });
}

// 선택한 연도,월에 ex) 2021 5월의 지출 총액 조회(원형 그래프에서 1. 전체지출)
function readCategoryPaymentAmountSum_present(category){
    db.transaction(function(tr){
        var selectSQL;
        var year = $('#graphYear').val();
        var month = $('#graphMonth').val();
        if(category==='all')
        {
            selectSQL = 'select sum(amount) from payment where year =? and month = ?';
            tr.executeSql(selectSQL, [year,month], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                // 현재 월 지출 총액
                // rs.rows.item(0)['sum(amount)']
            });
        }
        else
        {
            selectSQL = 'select sum(amount) from payment where year =? and month = ? and category = ?';
            tr.executeSql(selectSQL, [year,month,category], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                // 현재 월 지출 총액
                // rs.rows.item(0)['sum(amount)']
            });
        }   
    });
}

// 현재 연도에 월별 지출액 (선형 그래프에서 표시)
// function readCategoryPaymentAmountSum_All(category){
//     var arr = [0,0,0,0,0,0,0,0,0,0,0,0];
//     var flag=0;
//     var label1='1';
//     var label2='2';
//     var label3='3';
//     var label4='4';
//     var label5='5';
//     var label6='6';
//     var label7='7';
//     var label8='8';
//     var label9='9';
//     var label10='10';
//     var label11='11';
//     var label12='12';
    
//     db.transaction(function(tr){
//         var ctx = document.getElementById('myChart').getContext('2d');

//         var selectSQL;
//         var year = new Date().getFullYear();
//         var retArr = new Array();
//         if(category==='all')
//         {
//             console.log('모두 조회');
//             selectSQL = 'select month,sum(amount) from payment where year = ? group by month' ;
//             tr.executeSql(selectSQL, [year], function(tr,rs){
//                 console.log('지출 내역 조회' + rs.rows.length+'건');
//                 for(var i=0;i<rs.rows.length;i++)
//                 {
//                     arr[rs.rows[i]['month']]=rs.rows[i]['sum(amount)']
//                 }

//                 var chart = new Chart(ctx, {
//                     // 챠트 종류를 선택
//                     type: 'line',
//                     data: {
//                         labels: [label1,label2,label3,label4,label5,label6,label7,label8,label9,label10,label11,label12],
//                         datasets: [{
//                         label: '월별 소비액',
//                         backgroundColor: 'transparent',
//                         //   backgroundColor: 'black',
//                         borderColor: 'blue',
//                         data: [arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],arr[9],arr[10],arr[11]]
//                         }]
//                     },
//                     options: {
//                         responsive: false,
//                         scales: {
//                             yAxes: [{
//                                 ticks: {
//                                     beginAtZero: true
//                                 }
//                             }]
//                             },
//                     }
//                     });

//             });
//         }
//         else
//         {
//             selectSQL = 'select month,sum(amount) from payment where year =? and category = ? group by month';
//             tr.executeSql(selectSQL, [year, category], function(tr,rs){
//                 console.log('지출 내역 조회' + rs.rows.length+'건');
//                 // 그래프에 값들 표시
//                 // fillChart(d1~d12);
//                 // var arr = [0,0,0,0,0,0,0,0,0,0,0,0];

//                 for(var i=0;i<rs.rows.length;i++)
//                 {
//                     arr[rs.rows[i]['month']]=rs.rows[i]['sum(amount)']
//                 }
//                 for(var i=0;i<rs.rows.length;i++)
//                 {
//                     arr[rs.rows[i]['month']]=rs.rows[i]['sum(amount)']
//                 }

//                 var chart = new Chart(ctx, {
//                     // 챠트 종류를 선택
//                     type: 'line',
//                     data: {
//                         labels: [label1,label2,label3,label4,label5,label6,label7,label8,label9,label10,label11,label12],
//                         datasets: [{
//                         label: '월별 소비액',
//                         backgroundColor: 'transparent',
//                         //   backgroundColor: 'black',
//                         borderColor: 'blue',
//                         data: [arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],arr[9],arr[10],arr[11]]
//                         }]
//                     },
//                     options: {
//                         responsive: false,
//                         scales: {
//                             yAxes: [{
//                                 ticks: {
//                                     beginAtZero: true
//                                 }
//                             }]
//                             },
//                     }
//                     });
//             });
//         }
//     });
//     return arr;

    
// }

// 현 연도,월 -> 카테고리별 지출액 -> 내가 소비한 카테고리
function readAllCategoryPaymentAmountSum() {

}

function drawCard(){
    
    db.transaction(function(tr){
        const paymentID = [];
        const paymentName = [];
        const paymentCategory = [];
        const paymentDay = [];
        const paymentAmount = [];
        const categoryColor = [];
        const Y = [];
        const M = [];
        const D = [];
        var test='no';

        function readPaymentAll(callback){
            var selectSQL;
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            test='yest'
            
            selectSQL = 'select payment.id, payment.name,payment.category,payment.year,payment.month,payment.day,payment.amount,category.color from payment join category on payment.category=category.name where payment.year =? and payment.month = ? order by payment.day desc';
            tr.executeSql(selectSQL, [year,month], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');

                for(var i=0;i<rs.rows.length;i++)
                {
                    console.log(rs.rows.item(i));
                    paymentID[i] = rs.rows.item(i).id;
                    paymentName[i] = rs.rows.item(i).name;
                    paymentCategory[i] = rs.rows.item(i).category;
                    // paymentDay[i] = rs.rows.item(i).day;
                    paymentAmount[i] = rs.rows.item(i).amount;
                    categoryColor[i] = rs.rows.item(i).color;
                    Y[i] = rs.rows.item(i).year;
                    M[i] = rs.rows.item(i).month;
                    D[i] = rs.rows.item(i).day;
                }
                callback(paymentID,categoryColor,paymentCategory,paymentName,paymentAmount);
            });
            
        }
        
        function addCard(paymentID,categoryColor,paymentCategory,paymentName,paymentAmount){
            const ul = document.getElementById('list-ul');
            const li = ul.getElementsByTagName('li');
            for(var i=li.length-1;i>=0;i--)
            {
                li[i].remove();
            }
            console.log(test);
            console.log(paymentID.length);
            for(var i=0;i<paymentID.length;i++)
            {
                // <a data-role='button' id = 'del_button' style='float: right;color:#800000' value = '"+rs.rows.item(i).id+"' >x</a>
                let list = document.createElement('li');
                list.className="list-item";
                list.setAttribute('data-id',paymentID[i]);

                let card = document.createElement('div');
                card.className="card";

                let firstRow = document.createElement('div');
                firstRow.className="firstRow";

                let thumbnail = document.createElement('div');
                thumbnail.className="thumbnail";

                let tumbImg = document.createElement('div');
                tumbImg.className = "tumbImg";
                tumbImg.style.background = categoryColor[i];

                let tumbInfo = document.createElement('div');
                tumbInfo.className = "tumbInfo";
                tumbInfo.innerText = paymentCategory[i];

                let cDate = document.createElement('div');
                cDate.className = "cDate";
                cDate.innerText = Y[i]+"년 "+M[i]+"월 "+D[i]+"일 ";
                
                thumbnail.appendChild(tumbImg);
                thumbnail.appendChild(cDate);
                
                let del = document.createElement('a');
                del.setAttribute('data-role','button');
                del.setAttribute('value',paymentID[i]);
                del.id = 'del_button';
                del.style.color = "#800000";
                del.innerText = 'X';
                thumbnail.appendChild(del);

                let details = document.createElement('div');
                details.className = "details";

                let name = document.createElement('div');
                name.className = "name";
                name.innerText = paymentName[i];

                let money = document.createElement('div');
                money.className = "money";
                money.innerText = addComma(paymentAmount[i]) +"￦";

                details.appendChild(money);
                details.appendChild(tumbInfo);
                
                // firstRow.appendChild(thumbnail);
                // firstRow.appendChild(cDate);

                firstRow.appendChild(name);
                firstRow.appendChild(thumbnail);

                card.appendChild(firstRow);
                card.appendChild(details);

                list.appendChild(card);
                
                document.getElementById("list-ul").appendChild(list);

                if(i==4)
                    break;
            }
        }
        readPaymentAll(addCard);
    });    
}

// 최근 발생한 5개의 지출 
function recentPayments() {
    db.transaction(function(tr){
        var selectSQL;
        selectSQL = 'select * from payment order by id desc';
        tr.executeSql(selectSQL, [], function(tr,rs){
            $('.payment_history').empty()
            // 5개 이상일땐 카드를 5개 만든다.
            if(rs.rows.length>=5){ 
                for (var i = 0; i < 5 ; i++) {
                    var payment_card = 
                    "<!-- 하나의 지출 카드 -->\
                    <div id='cost_details' class='ui-body ui-body-a' style='padding-right:0.5em;border:2px solid #000;background-color: white'>\
                        <a data-role='button' id = 'del_button' style='float: right;color:#800000' value = '"+rs.rows.item(i).id+"' >x</a>\
                        <div style='height: 2em;' id = 'first_row'>\
                            <h4 style='float: left;' id = 'paymentBoxName'>"+rs.rows.item(i).name+"</h4>\
                            <h4 style='text-align: right; float: right; padding-right: 1em;' id = 'paymentBoxDate'>"+rs.rows.item(i).year+"년 "+rs.rows.item(i).month+"월 "+rs.rows.item(i).day+"일"+"</h4>\
                        </div>\
                        <div style='height: 1em;'>\
                            <h4 style='float: left;' id = 'paymentBoxAmount-0'>"+addComma(rs.rows.item(i).amount)+"￦"+"</h4>\
                            <h4 style='text-align: right; float: right; padding-right: 2em' id = 'paymentBoxCategory-0'>"+rs.rows.item(i).category+"</h4>\
                        </div>\
                    </div>\
                    <br>"

                    $('.payment_history').append(payment_card);
                }
            }
            else{
                for (var i = 0; i < rs.rows.length ; i++) {
                    var payment_card = 
                    "<!-- 하나의 지출 카드 -->\
                    <div id='cost_details' class='ui-body ui-body-a' style='padding-right:0.5em;border:2px solid #000;background-color: white'>\
                        <a data-role='button' id = 'del_button' style='float: right;color:#800000' value = '"+rs.rows.item(i).id+"' >x</a>\
                        <div style='height: 2em;' id = 'first_row'>\
                            <h4 style='float: left;' id = 'paymentBoxName'>"+rs.rows.item(i).name+"</h4>\
                            <h4 style='text-align: right; float: right; padding-right: 1em;' id = 'paymentBoxDate'>"+rs.rows.item(i).year+"년 "+rs.rows.item(i).month+"월 "+rs.rows.item(i).day+"일"+"</h4>\
                        </div>\
                        <div style='height: 1em;'>\
                            <h4 style='float: left;' id = 'paymentBoxAmount-0'>"+addComma(rs.rows.item(i).amount)+"￦"+"</h4>\
                            <h4 style='text-align: right; float: right; padding-right: 2em' id = 'paymentBoxCategory-0'>"+rs.rows.item(i).category+"</h4>\
                        </div>\
                    </div>\
                    <br>"

                    $('.payment_history').append(payment_card);
                }
            }
        });
        
    });

}

// 이번달 현재까지의 최종 금액
function get_cur_amount(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    console.log('hello')
    db.transaction(function(tr){
        var selectSQL;
        selectSQL = 'select * from payment where year = ? and month = ?';
        tr.executeSql(selectSQL, [year, month], function(tr,rs){
            cur_bal = 0
            for (var i = 0; i < rs.rows.length ; i++) {
                if (rs.rows.item(i).amount != 'undefined'){
                    cur_bal += (rs.rows.item(i).amount)        
                }
            }
            console.log(cur_bal)
            $("#cur_money").text(addComma(cur_bal))
        });
    });
}

// 숫자를 받아 3자리마다 ,찍기
function addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }


// 이번달에 소비한 위치를 배열로 가공해서 리턴한다.   
function getLoc(){
    
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;

    loc_info = new Array();

    db.transaction(function(tr){
        var selectSQL;
        selectSQL = 'select * from payment where year = ? and month = ?';
        tr.executeSql(selectSQL, [year, month], function(tr,rs){
            for (var i = 0; i < rs.rows.length ; i++) {
                if (rs.rows.item(i).amount < 0) {
                    var name = rs.rows.item(i).name;
                    var lat = rs.rows.item(i).latitude;
                    var lon = rs.rows.item(i).longitude;
                    element = [name, lat, lon] 
                    loc_info.push(element);                    
                }
            }
        });
        
    });
    return loc_info;
}