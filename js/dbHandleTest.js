var db = null;
var var_no = null;
var position = null;
var index;

// Database를 생성합니다.
function openDB(){
    db = window.openDatabase('paymentDB','1.0','입출금내역DB',1024*1024*5);
    console.log('DB 생성');
}

// Table을 생성합니다. 
/*
    id(int) | name(text) | category(text) | year(int) | month(int) | day(int) | amount(int)
*/

/*
function createTable()  {
    db.transaction(function(tr){
    var createSQL = 'create table payment(id integer primary key autoincrement ,name text, category text, year integer, month integer, day integer, amount integer';
    tr.executeSql(createSQL, [], function(){
        console.log('테이블 생성 sql 실행 성공');
    },function(){
        console.log('테이블 생성 sql 실행 실패');
    });
    }, function(){
        console.log('테이블 생성 트랜잭션 실패 , 롤백 자동');
    }, function(){
        console.log('테이블 생성 트랜잭션 성공');
    });
}
*/

// function createTable_auto() {
//     db.transaction(function(tr){
//     // var deleteSQL = 'drop table payment';
//     var createSQL = 'create table if not exists auto(name text,integer day,boolean ajik';      
//     // tr.executeSql(deleteSQL);
    
//     tr.executeSql(createSQL, [], function(){
//         console.log('2_1_테이블생성_sql 실행 성공...!!!!!!');       
//      }, function(){
//         console.log('2_1_테이블생성_sql 실행 실패...');           
//      });
//      }, function(){
//         console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
//      }, function(){
//         console.log('2_2_테이블 생성 트랜잭션 성공...');
//       });
//   }

//     function insertPayment(){
//     db.transaction(function(tr){
        
//         var insertSQL = 'insert into auto(name,day,ajik) values(test,3,false)';
        
//         tr.executeSql(insertSQL,[], function(tr,rs){
                
//             }, function(tr,err){
//                 console.log('DB오류'+err.message+err.code);
//                 }
//             );
//         });
//     }


//카테고리 테이블 만들기
function createTableCat() 
{
  db.transaction(function(tr){
    var createSQL = 'create table if not exists category(name text, color color)';      
    tr.executeSql(createSQL, [], function(){
      console.log('카테고리 테이블 생성 sql 실행 성공');
    },function(){
      console.log('카테고리 테이블 생성 sql 실행 실패');
    },function(){
      console.log('카테고리 테이블 생성 트랜잭션 실패 , 롤백 자동');
    },function(){
      console.log('카테고리 테이블 생성 트랜잭션 성공');
    }
  );          
});
}


//Payment테이블 생성
function createTable() {
    db.transaction(function(tr){
    // var deleteSQL = 'drop table payment';
    var createSQL = 'create table if not exists payment(id integer primary key autoincrement ,name text, category text, year integer, month integer, day integer, amount integer)';      
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
*/
function insertPayment(){
    db.transaction(function(tr){
        var name = $('#id_memo').val();
        var category = $('#id_category').val();
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var day = now.getDate();
        var amount = $('#id_money').val();
        var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?)';
        
        if(name!=''&&category!=''&&amount!=''){
            tr.executeSql(insertSQL,[name,category,year,month,day,amount], function(tr,rs){
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
function deletePayment(){
    db.transaction(function(tr){
        var id = $('#deletePaymentId').val();
        var deleteSQL = 'delete from payment where id = ?';
        tr.executeSql(deleteSQL, [id], function(tr,rs){
            console.log('Payment 삭제');
            //화면 업데이트 
        }, function(tr,err){
            console.log('DB 오류'+err.message+err.code);
        });

    });
}

// 카테고리별 지출 내역 (선택 연도,월에 지출내역 표시 -> 각각 반복문에서 카드를 만들고 값 표시)
function readCategoryPayment(category){
    
    // const paymentID = [];
    // const paymentName = [];
    // const paymentCategory = [];
    // const paymentDay = [];
    // const paymentAmount = [];
    // const categoryColor = [];
    // var test='no';

    db.transaction(function(tr){
        const paymentID = [];
        const paymentName = [];
        const paymentCategory = [];
        const paymentDay = [];
        const paymentAmount = [];
        const categoryColor = [];
        var test='no';

        function A(callback){
        var selectSQL;
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        test='yest'
        if(category==='all')
        {
            selectSQL = 'select payment.id, payment.name,payment.category,payment.day,payment.amount,category.color from payment join category on payment.category=category.name where payment.year =? and payment.month = ? order by payment.day desc';
            tr.executeSql(selectSQL, [year,month], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');

                for(var i=0;i<rs.rows.length;i++)
                {
                    console.log(rs.rows.item(i));
                    paymentID[i] = rs.rows.item(i).id;
                    paymentName[i] = rs.rows.item(i).name;
                    paymentCategory[i] = rs.rows.item(i).category;
                    paymentDay[i] = rs.rows.item(i).day;
                    paymentAmount[i] = rs.rows.item(i).amount;
                    categoryColor[i] = rs.rows.item(i).color;
                }
                callback(paymentID,categoryColor,paymentCategory,paymentName,paymentAmount);
            });
            
        }
        else
        {
            selectSQL = 'select * from payment where year =? and month = ? and category = ? order by day desc';
            tr.executeSql(selectSQL, [year,month,category], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                test='yes';
                for(var i=0;i<rs.rows.length;i++)
                {
                    
                    paymentID[i] = rs.rows.item(i).id;
                    paymentName[i] = rs.rows.item(i).name;
                    paymentCategory[i] = rs.rows.item(i).category;
                    // paymentDay[i] = rs.rows.item(i).day;
                    paymentAmount[i] = rs.rows.item(i).amount;
                    categoryColor[i] = rs.rows.item(i).color;
                }
                callback(paymentID,categoryColor,paymentCategory,paymentName,paymentAmount);
            });
        }
            
        }
        
        function B(paymentID,categoryColor,paymentCategory,paymentName,paymentAmount){
    
            console.log(test);
            console.log(paymentID.length);
            for(var i=0;i<paymentID.length;i++)
            {
                console.log(paymentID[i]);

                let list = document.createElement('li');
                list.className="list-item";
                list.setAttribute('data-id',paymentID[i]);

                let card = document.createElement('div');
                card.className="card";

                let thumbnail = document.createElement('div');
                thumbnail.className="thumbnail";

                let tumbImg = document.createElement('div');
                tumbImg.className = "tumbImg";
                tumbImg.style.background = categoryColor[i];

                let tumbInfo = document.createElement('div');
                tumbInfo.className = "tumbInfo";
                tumbInfo.innerText = paymentCategory[i];

                thumbnail.appendChild(tumbImg);
                thumbnail.appendChild(tumbInfo);

                let details = document.createElement('div');
                details.className = "details";

                let name = document.createElement('div');
                name.className = "name";
                name.innerText = paymentName[i];

                let money = document.createElement('div');
                money.className = "money";
                money.innerText = paymentAmount[i];

                details.appendChild(name);
                details.appendChild(money);

                card.appendChild(thumbnail);
                card.appendChild(details);

                list.appendChild(card);
                
                document.getElementById("list-ul").appendChild(list);

                // $("#list-ul").append("<li>test</li>");
                // $("#list-ul").append("<li class=\"list-item\" data-id =\""
                // +paymentID[i]+
                // "\">\n\
                //             <div class=\"card\">\n\
                //                 <div class=\"thumbnail\">\n\
                //                     <div class=\"tumbImg\" style=\"background: "
                //                     + categoryColor[i] +
                //                     ";\"></div>\n\
                //                     <div class=\"tumbInfo\">"
                //                         + paymentCategory[i] +   
                //                     "</div>\n\
                //                 </div>\n\
                //                 <div class=\"details\">\n\
                //                     <div class=\"name\">"
                //                     + paymentName[i] +
                //                     "</div>\n\
                //                     <div class=\"money\">"
                //                     + paymentAmount[i] +
                //                     "</div>\n\
                //                 </div>\n\
                //             </div>\n\
                //         </li>");
            }
        }
        A(B);
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
function readCategoryPaymentAmountSum_All(category){
    var arr = [0,0,0,0,0,0,0,0,0,0,0,0];
    var flag=0;
    var label1='1';
    var label2='2';
    var label3='3';
    var label4='4';
    var label5='5';
    var label6='6';
    var label7='7';
    var label8='8';
    var label9='9';
    var label10='10';
    var label11='11';
    var label12='12';
    
    db.transaction(function(tr){
        var ctx = document.getElementById('myChart').getContext('2d');

        var selectSQL;
        var year = new Date().getFullYear();
        var retArr = new Array();
        if(category==='all')
        {
            console.log('모두 조회');
            selectSQL = 'select month,sum(amount) from payment where year = ? group by month' ;
            tr.executeSql(selectSQL, [year], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                for(var i=0;i<rs.rows.length;i++)
                {
                    console.log(rs.rows.item(i));
                    arr[rs.rows[i]['month']-1]=rs.rows[i]['sum(amount)']
                }

                var chart = new Chart(ctx, {
                    // 챠트 종류를 선택
                    type: 'line',
                    data: {
                        labels: [label1,label2,label3,label4,label5,label6,label7,label8,label9,label10,label11,label12],
                        datasets: [{
                        backgroundColor: 'transparent',
                        //   backgroundColor: 'black',
                        borderColor: 'blue',
                        data: [arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],arr[9],arr[10],arr[11]]
                        }]
                    },
                    options: {
                        responsive: false,
                        // scales: {
                        //     yAxes: [{
                        //         ticks: {
                        //             beginAtZero: true
                        //         }
                        //     }]
                        //     },
                        legend:{
                            display:false
                        },
                        
                    }
                    });

            });
        }
        else
        {
            selectSQL = 'select month,sum(amount) from payment where year =? and category = ? group by month';
            tr.executeSql(selectSQL, [year, category], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                // 그래프에 값들 표시
                // fillChart(d1~d12);
                // var arr = [0,0,0,0,0,0,0,0,0,0,0,0];

                for(var i=0;i<rs.rows.length;i++)
                {
                    arr[rs.rows[i]['month']]=rs.rows[i]['sum(amount)']
                }
                for(var i=0;i<rs.rows.length;i++)
                {
                    arr[rs.rows[i]['month']]=rs.rows[i]['sum(amount)']
                }

                var chart = new Chart(ctx, {
                    // 챠트 종류를 선택
                    type: 'line',
                    data: {
                        labels: [label1,label2,label3,label4,label5,label6,label7,label8,label9,label10,label11,label12],
                        datasets: [{
                        // label: '월별 소비액',
                        backgroundColor: 'transparent',
                        //   backgroundColor: 'black',
                        borderColor: 'blue',
                        data: [arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8],arr[9],arr[10],arr[11]]
                        }]
                    },
                    options: {
                        responsive: false,
                        // scales: {
                        //     yAxes: [{
                        //         ticks: {
                        //             beginAtZero: true
                        //         }
                        //     }]
                        //     },
                        legend:{
                            display:false
                        },
                        
                    }
                    });
            });
        }
    });
    return arr;

    
}

// 현 연도,월 -> 카테고리별 지출액 -> 내가 소비한 카테고리
function readAllCategoryPaymentAmountSum() {




    

}

// 최근 발생한 5개의 지출 
function recentPayments() {
    db.transaction(function(tr){
        var cur_id = 0
        selectSQL = 'select * from payment where id = 1';

        var selectSQL;
        
        selectSQL = 'select * from payment where id = 1';
        tr.executeSql(selectSQL, [], function(tr,rs){
            console.log('지출 내역 조회' + rs.rows.length+'건');
        });
        
    });
}

// 수입 테이블 create


// 수입 테이블 관리 (insert, update, select)
// 초기예산+ 각 수입

function createCatIcon(callback){
    // document.getElementById('catIcons').onclick = function(){
    //     var categoryCircles = document.getElementsByClassName('dot-wrap2');
    //     for(var i=0;i<categoryCircles.length;i++)
    //     {
    //         var categoryCircle = categoryCircles[i];
            
    //         categoryCircle.onclick = function() {
    //             console.log(categoryCircle);
    //         }
    //     }
        
    // };
    db.transaction(function(tr){
      var selectSQL='select * from category';

      function setCategory(callback){
        tr.executeSql(selectSQL,[],function(tr,rs){
            //dot-wrap : 동그라미들을 예쁘게 나열하려고 설정 동그라미들을 감싸주는 역할
            $('<div class="dot-wrap" id="dot-wrap">').appendTo('#catIcons');
            //   var target=document.getElementById('#dot-wrap');
    
            //정보 하나씩 불러옴
            for(var i=0;i<rs.rows.length;i++)
            {
              var catName=rs.rows.item(i).name;
              var catColor=rs.rows.item(i).color;
              
              //span 하나씩 추가
              $('<span class="dot-wrap2" data-name='+ catName+'; style="border:3px solid black; background-color:'+catColor+' "><p style="font-size:13px; margin-top:-15px;">'+catName+'</p></span>').appendTo('#catIcons');
              var target2=document.getElementsByTagName('span');
              //현재 span의 css스타일 설정해줌
              $(target2).css({        
                "width":"60px",
                "height":"60px",
                "margin-right":"3px",
                "margin-left":"3px",
                "align-items": "center",
                "border-radius":"50%",
                "font-weight":"bold",
                "text-align":"center",
                "line-height":"200px",
                "float":"left",
                "margin-top": "50px",
                "margin-left":"20px",
                "margin-right":"20px",
                "margin-bottom":"30px"});
              }
              //catIcons라는 카테고리 페이지의 content부분에 넣음
              $('</div>').appendTo('#catIcons');
            
              callback();
          });
          
      }

      function addClick(){
        var circles = document.getElementsByClassName('dot-wrap2');
        for(var i=0;i<circles.length;i++)
        {
            var circle = circles[i];
            circle.addEventListener('click',myFunction,false);
        }
    }

      setCategory(addClick); 
    }); 
}

function myFunction(){
    
    var X = $(this).data('name');
    var catName = X.substr(0,X.length-1);
    console.log(catName);
    readCategoryPayment(catName);

}