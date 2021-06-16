passCount=0;
  
  
//암호 테이블 만들기
function createTablePassword() 
{
  db.transaction(function(tr){
    var createSQL = 'create table if not exists password(key number)';      
    tr.executeSql(createSQL, [], function(){
      console.log('패스워드 테이블 생성 sql 실행 성공');
    },function(){
      console.log('패스워드 테이블 생성 sql 실행 실패');
    },function(){
      console.log('패스워드 테이블 생성 트랜잭션 실패 , 롤백 자동');
    },function(){
      console.log('패스워드 테이블 생성 트랜잭션 성공');
    }
  );          
});
}


//암호 onoff 체크박스 상태 유지
function keepPassButton(){

db.transaction(function(tr){
  var selectSQL='select * from password';
  var flag=0;
  
  tr.executeSql(selectSQL,[],function(tr,rs){
    for(var i=0;i<rs.rows.length;i++)
    {
      flag++;
    }
    if(flag!=0)
    {
      $('input:checkbox[id="onoff"]').attr("checked", true);
    }
      
    else
      $('input:checkbox[id="onoff"]').attr("checked", false);
  });
});
}



//암호 onoff에 따른 페이지 선택
function selectPage(){
var tmp = $('input:checkbox[id="onoff"]').is(":checked");
console.log(tmp);
if(tmp==true)
  location.href="#password";
else if(tmp==false){
  db.transaction(function(tr){
    var deleteSQL = 'delete from password where rowid = ?';
    tr.executeSql(deleteSQL, ['1'], function(tr,rs){
        console.log('암호 삭제 완료');
        //화면 업데이트 
    }, function(tr,err){
        console.log('DB 오류'+err.message+err.code);
    });
});
}
}


//이동 위한 함수
function passwordCheck(){
db.transaction(function(tr){
  var selectSQL='select * from password';
  var flag=0;
  
  tr.executeSql(selectSQL,[],function(tr,rs){
    for(var i=0;i<rs.rows.length;i++)
    {
      flag++;
    }
    if(flag!=0)
    {
      document.location.href="#checkpassword";
    }
      
    else
    document.location.href="#passwordMain";
  });
});

}



//암호가 존재하고 설정 접속 시 암호체크
function check_Pass_Enter() {
  var realcode;
  db.transaction(function(tr){
    var selectSQL='select * from password';
    tr.executeSql(selectSQL,[],function(tr,rs){
      realCode=rs.rows.item(0).key;
    });
  });

  if (document.number2.number5.value.length==1) {
    document.number2.number6.focus();
    if (document.number2.number6.value.length==1){
      document.number2.number7.focus();
      if (document.number2.number7.value.length==1){
        document.number2.number8.focus();
        if(document.number2.number8.value.length==1){
          code=document.number2.number5.value + document.number2.number6.value + document.number2.number7.value + document.number2.number8.value;
          if(code==realCode){
            alert("암호가 일치합니다.");
            $('#number5').val('');
            $('#number6').val('');
            $('#number7').val('');
            $('#number8').val('');
            location.href="#passwordMain";
          }
          else{
            alert("암호가 일치하지 않습니다.");
            $('#number5').val('');
            $('#number6').val('');
            $('#number7').val('');
            $('#number8').val('');
            location.href="#main";
          }
        }
      }
    }
  }
  return;
  }




//암호 체크
function check_Pass() {
if (document.number.number1.value.length==1) {
document.number.number2.focus();
if (document.number.number2.value.length==1){
  document.number.number3.focus();
  if (document.number.number3.value.length==1){
    document.number.number4.focus();
    if(document.number.number4.value.length==1){
      code=document.number.number1.value + document.number.number2.value + document.number.number3.value + document.number.number4.value;
        alert("암호는 <"+code+"> 입니다!");
        $('#number1').val('');
        $('#number2').val('');
        $('#number3').val('');
        $('#number4').val('');
        db.transaction(function(tr){
          var insertSQL = 'insert into password(key) values(?)';
          tr.executeSql(insertSQL,[code],function(tr,rs){
            console.log("새 암호 삽입 완료");
            location.href="#main";
          });
        });
      }
    }
  }
}
return;
}



//암호 체크(main 화면)
function check_Pass_Enter_main() {
  var realcode;
  db.transaction(function(tr){
    var selectSQL='select * from password';
    tr.executeSql(selectSQL,[],function(tr,rs){
      realCode=rs.rows.item(0).key;
    });
  });

  if (document.number.number1.value.length==1) {
    document.number.number2.focus();
    if (document.number.number2.value.length==1){
      document.number.number3.focus();
      if (document.number.number3.value.length==1){
        document.number.number4.focus();
        if(document.number.number4.value.length==1){
          code=document.number.number1.value + document.number.number2.value + document.number.number3.value + document.number.number4.value;
          if(code==realCode){
            $('#number1').val('');
            $('#number2').val('');
            $('#number3').val('');
            $('#number4').val('');
            location.href="main.html";
          }
          else{
            alert("암호가 일치하지 않습니다.");
            $('#number1').val('');
            $('#number2').val('');
            $('#number3').val('');
            $('#number4').val('');
          }
        }
      }
    }
  }
  return;
}


//이동 위한 함수
function passwordCheck_main(){
  db.transaction(function(tr){
    var selectSQL='select * from password';
    var flag=0;
    
    tr.executeSql(selectSQL,[],function(tr,rs){
      for(var i=0;i<rs.rows.length;i++)
      {
        flag++;
      }
      if(flag==0)
      {
        document.location.href="main.html";
      }
    });
  });
  
  }