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
function createTable() {
    db.transaction(function(tr){
    var createSQL = 'create table if not exists payment(id integer primary key autoincrement ,name text, category text, year integer, month integer, day integer, amount integer)';      
    tr.executeSql(createSQL, [], function(){
        console.log('2_1_테이블생성_sql 실행 성공...');       
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
        var name = $('#PaymentName').val();
        var category = $('PaymentCategory').val();
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = now.getDate();
        var amount = $('#PaymentAmount').val();
        var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?)';
        
        tr.executeSql(insertSQL,[name,category,year,month,day,amount], function(tr,rs){
            console.log('지출 저장완료 no: ' + rs.insertId);
        }, function(tr,err){
            console.log('DB오류'+err.message+err.code);
            }
        );
        
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
    db.transaction(function(tr){
        var selectSQL;
        var year = $('#graphYear').val();
        var month = $('#graphMonth').val();
        if(category==='all')
        {
            selectSQL = 'select * from payment where year =? and month = ? order by day desc';
            tr.executeSql(selectSQL, [year,month], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                for(var i=0;i<rs.rows.length;i++)
                {
                    // rs.rows.item(i).id
                    // rs.rows.item(i).name
                    // rs.rows.item(i).category
                    // rs.rows.item(i).day
                    // rs.rows.item(i).amount
                }
            });
        }
        else
        {
            selectSQL = 'select * from payment where year =? and month = ? and category = ? order by day desc';
            tr.executeSql(selectSQL, [year,month,category], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                for(var i=0;i<rs.rows.length;i++)
                {
                    // rs.rows.item(i).id
                    // rs.rows.item(i).name
                    // rs.rows.item(i).category
                    // rs.rows.item(i).day
                    // rs.rows.item(i).amount
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
function readCategoryPaymentAmountSum_All(category){
    db.transaction(function(tr){
        var selectSQL;
        var year = new Date().getFullYear();    
        if(category==='all')
        {
            selectSQL = 'select sum(amount) from payment where year = ? group by month' ;
            tr.executeSql(selectSQL, [year], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                // 그래프에 값들 표시
                // fillChart(d1,d2,d3~~d12);
            });
        }
        else
        {
            selectSQL = 'select sum(amount) from payment where year =? and category = ? group by month';
            tr.executeSql(selectSQL, [year, category], function(tr,rs){
                console.log('지출 내역 조회' + rs.rows.length+'건');
                // 그래프에 값들 표시
                // fillChart(d1~d12);
            });
        }
    });
}

// 현 연도,월 -> 카테고리별 지출액 -> 내가 소비한 카테고리
function readAllCategoryPaymentAmountSum() {

}

// 최근 발생한 3개의 지출 
function recentPayments() {
    db.transaction(function(tr){
        var selectSQL;
        selectSQL = 'select * from payment order by id desc';
        tr.executeSql(selectSQL, [], function(tr,rs){
            console.log("최근 내역을 불러왔습니다.")
            // 가장 최근 내역 카드 수정
            console.log(rs.rows.item(0).id)
            $('#paymentBoxName-0').text(rs.rows.item(0).name)
            $('#paymentBoxDate-0').text(rs.rows.item(0).year+"_"+rs.rows.item(0).month+"_"+rs.rows.item(0).day)
            $('#paymentBoxAmount-0').text(rs.rows.item(0).amount)
            $('#paymentBoxCategory-0').text(rs.rows.item(0).category)

            console.log(rs.rows.item(1).id)
            $('#paymentBoxName-1').text(rs.rows.item(1).name)
            $('#paymentBoxDate-1').text(rs.rows.item(1).year+"_"+rs.rows.item(1).month+"_"+rs.rows.item(1).day)
            $('#paymentBoxAmount-1').text(rs.rows.item(1).amount)
            $('#paymentBoxCategory-1').text(rs.rows.item(1).category)

            console.log(rs.rows.item(2).id)
            $('#paymentBoxName-2').text(rs.rows.item(2).name)
            $('#paymentBoxDate-2').text(rs.rows.item(2).year+"_"+rs.rows.item(2).month+"_"+rs.rows.item(2).day)
            $('#paymentBoxAmount-2').text(rs.rows.item(2).amount)
            $('#paymentBoxCategory-2').text(rs.rows.item(2).category)

            
        });
        
    });
}

// 수입 테이블 create


// 수입 테이블 관리 (insert, update, select)
// 초기예산+ 각 수입