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
        var createSQL = 'create table payment(name text, category text, year integer, month integer, day integer, amount integer, plus boolean';
        tr.excuteSql(createSQL, [], function(){
            console.log('테이블 생성 sql 실행 성공');
        },function(){
            console.log('테이블 생성 sql 실행 실패');
        });
        }, function(){
            console.log('테이블 생성 트랜잭션 실패 , 롤백 자동');
        }, function(){
            console.log('테이블 생성 트랜잭션 성공');
        })
    })

}

