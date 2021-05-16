var db = null;
var var_no = null;
var position = null;
var index;

function openDB(){
    db.window.openDatabase('paymentDB','1.0','입출금내역DB',1024*1024*5);
    console.log('DB 생성');
}

function createTable()  {
    db.transaction(function(tr){
    var createSQL = 'create table payment(id integer primary key autoincrement ,name text, category text, year integer, month integer, day integer, amount integer';
    tr.excuteSql(createSQL, [], function(){
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

function insertPayment(){
    db.transaction(function(tr){
        var name = $('#PaymentName').val();
        var category = $('PaymentCategory').val();
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = now.getDate();
        var amount = $('#PaymentAmount').val();
        var insertSQL = 'insert into payment(name,category,year,month,day,amount) values(?,?,?,?,?,?,?,?)';
        tr.excuteSql(insertSQL,[name,category,year,month,day,amount], function(tr,rs){
            console.log('내역 등록'+rs.insertId);
            // 등록 alert?
            $('#PaymentName').val=('');
            // 등록 후 지워줄지 
            
        }, function(tr,err){
            console.log('DB오류'+err.message+err.code);
        });
    });
}

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

function deletePayment(){
    db.transaction(function(tr){
        var id = $('#deletePaymentId').val();
        var deleteSQL = 'delete from payment where id = ?';
        tr.excuteSql(deleteSQL, [id], function(tr,rs){
            console.log('Payment 삭제');
            //화면 업데이트 
        }, function(tr,err){
            console.log('DB 오류'+err.message+err.code);
        });

    });
}
/*
    그래프 상에서 -> 월별 수입, 지출 총합
                 -> 수입 
                 -> 지출
                
*/
function readCategoryPayment(category){
    db.transaction
}