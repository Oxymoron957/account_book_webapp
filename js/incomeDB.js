var db = null;

/*
    DataBase 내용 : 매달 며칠에 얼마의 금액이 정기적으로 들어오는지에 대한 정보 
*/
 
// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('incomeDB', '1.0', '입금정보DB', 1024*1024*5); 
   console.log('DB 생성되었습니다.'); 
} 
// 테이블 생성 트랜잭션 실행
/*
    id(int) | name(text) | amount(int) | day(int)
*/
function createTable() {
   db.transaction(function(tr){
   var createSQL = 'create table if not exists incomeDB(id integer primary key autoincrement ,name text, amount integer, day integer)';       
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

 // 데이터 입력 트랜잭션 실행
 /*
    각 id 선택자에서 name, amount, day를 받아와서 db에 추가한다.
 */
 function insertIncome(){ 
    db.transaction(function(tr){
  		var name = $('#').val();
        var amount = $('#').val();
        var day = $('#').val();

  		var insertSQL = 'insert into incomeDB(name, amount, day) values(?, ?, ?)';      
     	tr.executeSql(insertSQL, [name, amount, day], function(tr, rs){    
      	    console.log('입금정보 등록...no: ' + rs.insertId);
	        		   		   	      
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });      
 }
// 전체 데이터 검색 트랜잭션 실행 (수정 자유)
function listIncome(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from incomeDB';    
  	tr.executeSql(selectSQL, [], function(tr, rs){    
        console.log(' 입금정보 조회... ' + rs.rows.length + '건.');
        // 현재는 인스턴스의 갯수만 출력
 		});   
  });           
}
// 데이터 수정 트랜잭션 실행
/*
    name을 받아 새로운 amount로 수정하는 내용 (수정 자유)
*/
function updateIncome(){
    db.transaction(function(tr){
    	var name = $('#').val();
    	var new_amount = $('#').val();
		var updateSQL = 'update incomeDB set amount = ? where name = ?';          
     	tr.executeSql(updateSQL, [new_amount, name], function(tr, rs){    
	         console.log('입금정보 수정되었습니다.') ; 	         
	   		 
            }, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });       
}

// 데이터 삭제 트랜잭션 실행
/*
    name을 받아 입금정보를 삭제하는 내용 (수정 자유)
*/
function deleteIncome(){
   db.transaction(function(tr){
	  var name = $('#').val();   
 	  var deleteSQL = 'delete from incomeDB where name = ?';      
	  tr.executeSql(deleteSQL, [name], function(tr, rs){    
	     console.log('입금정보 삭제되었습니다.');   
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
} 
